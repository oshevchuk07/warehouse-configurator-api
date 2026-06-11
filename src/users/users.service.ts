/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, Injectable, NotFoundException, Inject } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { PaginationDto, PaginatedResponseDto } from "src/common/dto/pagination.dto";
import { IStorageService, STORAGE_SERVICE } from "src/storage/storage.interface";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private storageService: IStorageService
  ) { }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 20 } = paginationDto;
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
        updatedAt: true,
        avatar: true
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

    // Delete avatar if exists
    if (user.avatar) {
      try {
        await this.removeAvatar(id);
      } catch (error) {
        console.warn(`Could not delete avatar for user ${id}: ${error.message}`);
      }
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
      const uploadedImage = await this.storageService.uploadImage(avatar, 'avatars');
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
        updatedAt: true,
        avatar: true
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

    try {
      const publicId = this.extractPublicIdFromUrl(user.avatar);
      await this.storageService.deleteImage(publicId);
    } catch (error) {
      console.error('Failed to delete image from storage:', error);
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

  private extractPublicIdFromUrl(url: string): string {
    // Local: /uploads/avatars/uuid.png -> avatars/uuid.png
    if (url.startsWith('/uploads/')) {
      return url.replace('/uploads/', '');
    }

    // Cloudinary logic
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicIdWithFolder = parts.slice(parts.indexOf('upload') + 2, parts.length - 1).join('/') + '/' + filename.split('.')[0];
      
      // If simplified version doesn't work, we use simple match
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[^/.]+$/);
      return match ? match[1] : publicIdWithFolder;
    } catch (error) {
      return url;
    }
  }
}
