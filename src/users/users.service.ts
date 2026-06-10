/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ApiResponse } from "src/common/api-response.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) { }

  async findAll(): Promise<ApiResponse<any>> {
    const users = await this.prisma.user.findMany({
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        paymentType: true,
        plan: true,
        planId: true,
        role: true,
        updatedAt: true
      }
    })
    return new ApiResponse(true, '', users)
  }

  async getUserById(id: number): Promise<ApiResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        paymentType: true,
        plan: true,
        planId: true,
        role: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new ApiResponse(true, 'User retrieved successfully', user);
  }

  async updateUser(id: number, updateUserDto: any): Promise<ApiResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        paymentType: true,
        plan: true,
        planId: true,
        role: true,
        updatedAt: true
      }
    });

    return new ApiResponse(true, 'User updated successfully', updatedUser);
  }

  async removeUser(id: number): Promise<ApiResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id }
    });

    return new ApiResponse(true, 'User deleted successfully');
  }

  async assignPlan(id: number, assignPlanDto: any): Promise<ApiResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const paymentType = assignPlanDto.paymentType || 'MONTHLY';

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        planId: assignPlanDto.planId,
        paymentType: paymentType
      },
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        paymentType: true,
        plan: true,
        planId: true,
        role: true,
        updatedAt: true
      }
    });

    return new ApiResponse(true, 'Plan assigned successfully', updatedUser);
  }

  async removePlan(id: number): Promise<ApiResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { planId: null },
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        paymentType: true,
        plan: true,
        planId: true,
        role: true,
        updatedAt: true
      }
    });

    return new ApiResponse(true, 'Plan removed successfully', updatedUser);
  }

  async changePassword(id: number, changePasswordDto: any): Promise<ApiResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if current password is correct
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.hash);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);

    // Update the user with the new password
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { hash: hashedPassword },
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        plan: true,
        planId: true,
        role: true,
        updatedAt: true
      }
    });

    return new ApiResponse(true, 'Password changed successfully', updatedUser);
  }

  async updateSelf(id: number, updateSelfDto: any, avatar?: Express.Multer.File): Promise<ApiResponse<any>> {
    // Only allow updating firstName and lastName
    const updateData: any = {};
    if (updateSelfDto.firstName !== undefined) {
      updateData.firstName = updateSelfDto.firstName;
    }
    if (updateSelfDto.lastName !== undefined) {
      updateData.lastName = updateSelfDto.lastName;
    }

    // Handle avatar upload if provided
    if (avatar) {
      // Upload image to Cloudinary
      const uploadedImage = await this.cloudinary.uploadImage(avatar, 'avatars');
      updateData.avatar = uploadedImage.url;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        paymentType: true,
        plan: true,
        planId: true,
        role: true,
        updatedAt: true
      }
    });

    return new ApiResponse(true, 'User updated successfully', updatedUser);
  }

  async removeAvatar(id: number): Promise<ApiResponse<any>> {
    // Get the current user to check if they have an avatar
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has an avatar
    if (!user.avatar) {
      throw new BadRequestException('User does not have an avatar');
    }

    // Extract public ID from Cloudinary URL
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/{type}/{public_id}.{format}
    // Or: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const urlParts = user.avatar.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    let publicId = publicIdWithExtension.split('.')[0];
    
    // Handle versioned URLs (v{version}/public_id.format)
    // Check if the previous part is a version indicator
    if (urlParts.length >= 2 && urlParts[urlParts.length - 2].startsWith('v') && urlParts[urlParts.length - 2].match(/^v\d+$/)) {
      // This is a versioned URL, combine the version and public ID
      publicId = urlParts[urlParts.length - 2] + '/' + publicId;
    }

    // Delete image from Cloudinary
    try {
      await this.cloudinary.deleteImage(publicId);
    } catch (error) {
      // Log the error but continue with removing the avatar reference
      console.error('Failed to delete image from Cloudinary:', error);
    }

    // Remove avatar reference from user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { avatar: null },
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        paymentType: true,
        plan: true,
        planId: true,
        role: true,
        updatedAt: true
      }
    });

    return new ApiResponse(true, 'Avatar removed successfully', updatedUser);
  }
}