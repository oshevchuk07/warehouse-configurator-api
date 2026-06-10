/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import * as bcrypt from 'bcrypt';
import { PaginationDto, PaginatedResponseDto } from "src/common/dto/pagination.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) { }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<any>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
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
      }),
      this.prisma.user.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  async getUserById(id: number): Promise<any> {
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

    return user;
  }

  async updateUser(id: number, updateUserDto: any): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
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
  }

  async removeUser(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id }
    });
  }

  async assignPlan(id: number, assignPlanDto: any): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const paymentType = assignPlanDto.paymentType || 'MONTHLY';

    return this.prisma.user.update({
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
  }

  async removePlan(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
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
  }

  async changePassword(id: number, changePasswordDto: any): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if current password is correct
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);

    // Update the user with the new password
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
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
  }

  async updateSelf(id: number, updateSelfDto: any, avatar?: Express.Multer.File): Promise<any> {
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

    return this.prisma.user.update({
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
  }

  async removeAvatar(id: number): Promise<any> {
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
    const urlParts = user.avatar.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    let publicId = publicIdWithExtension.split('.')[0];
    
    if (urlParts.length >= 2 && urlParts[urlParts.length - 2].startsWith('v') && urlParts[urlParts.length - 2].match(/^v\d+$/)) {
      publicId = urlParts[urlParts.length - 2] + '/' + publicId;
    }

    // Delete image from Cloudinary
    try {
      await this.cloudinary.deleteImage(publicId);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }

    // Remove avatar reference from user
    return this.prisma.user.update({
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
  }
}
