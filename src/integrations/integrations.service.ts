import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ApiResponse } from "src/common/api-response.dto";
import {
  CreateIntegrationGroupDto,
  UpdateIntegrationGroupDto,
  CreateIntegrationDto,
  UpdateIntegrationDto,
  CreatePlanIntegrationDto,
  UpdatePlanIntegrationDto
} from "./integrations.dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) { }

  // IntegrationGroup CRUD operations
  async findAllIntegrationGroups(): Promise<ApiResponse<any>> {
    const groups = await this.prisma.integrationGroup.findMany({
      select: {
        id: true,
        name: true,
        integrations: true
      }
    });
    return new ApiResponse(true, '', groups);
  }

  async getIntegrationGroupsById(id: number): Promise<ApiResponse<any>> {
    const group = await this.prisma.integrationGroup.findUnique({
      where: { id },
      select: {
        id: true,
        name: true
      }
    });

    if (!group) {
      throw new NotFoundException('Integration group not found');
    }

    return new ApiResponse(true, 'Integration group retrieved successfully', group);
  }

  async createIntegrationGroups(createIntegrationGroupDto: CreateIntegrationGroupDto): Promise<ApiResponse<any>> {
    const group = await this.prisma.integrationGroup.create({
      data: {
        name: createIntegrationGroupDto.name
      },
      select: {
        id: true,
        name: true
      }
    });

    return new ApiResponse(true, 'Integration group created successfully', group);
  }

  async updateIntegrationGroups(id: number, updateIntegrationGroupDto: UpdateIntegrationGroupDto): Promise<ApiResponse<any>> {
    const group = await this.prisma.integrationGroup.findUnique({
      where: { id }
    });

    if (!group) {
      throw new NotFoundException('Integration group not found');
    }

    const updatedGroup = await this.prisma.integrationGroup.update({
      where: { id },
      data: {
        name: updateIntegrationGroupDto.name
      },
      select: {
        id: true,
        name: true
      }
    });

    return new ApiResponse(true, 'Integration group updated successfully', updatedGroup);
  }

  async removeIntegrationGroups(id: number): Promise<ApiResponse<any>> {
    const group = await this.prisma.integrationGroup.findUnique({
      where: { id }
    });

    if (!group) {
      throw new NotFoundException('Integration group not found');
    }

    // Get all integrations in this group
    const integrations = await this.prisma.integration.findMany({
      where: { groupId: id }
    });

    // Delete all related plan integrations for all integrations in this group
    if (integrations.length > 0) {
      const integrationIds = integrations.map(integration => integration.id);
      await this.prisma.planIntegration.deleteMany({
        where: { integrationId: { in: integrationIds } }
      });
    }

    // Delete all integrations in this group
    await this.prisma.integration.deleteMany({
      where: { groupId: id }
    });

    // Then delete the group itself
    await this.prisma.integrationGroup.delete({
      where: { id }
    });

    return new ApiResponse(true, 'Integration group deleted successfully');
  }

  // Integration CRUD operations
  async findAllIntegrations(): Promise<ApiResponse<any>> {
    const integrations = await this.prisma.integration.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        logoImage: true,
        isActive: true,
        groupId: true,
        group: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return new ApiResponse(true, '', integrations);
  }

  async getIntegrationById(id: number): Promise<ApiResponse<any>> {
    const integration = await this.prisma.integration.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        logoImage: true,
        isActive: true,
        groupId: true,
        group: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return new ApiResponse(true, 'Integration retrieved successfully', integration);
  }

  async createIntegration(createIntegrationDto: CreateIntegrationDto): Promise<ApiResponse<any>> {
    const integration = await this.prisma.integration.create({
      data: {
        name: createIntegrationDto.name,
        url: createIntegrationDto.url,
        description: createIntegrationDto.description,
        logoImage: createIntegrationDto.logoImage,
        isActive: createIntegrationDto.isActive,
        group: {
          connect: {
            id: createIntegrationDto.groupId
          }
        }
      },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        logoImage: true,
        isActive: true,
        groupId: true,
        group: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Integration created successfully', integration);
  }

  async updateIntegration(id: number, updateIntegrationDto: UpdateIntegrationDto): Promise<ApiResponse<any>> {
    const integration = await this.prisma.integration.findUnique({
      where: { id }
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    const updatedIntegration = await this.prisma.integration.update({
      where: { id },
      data: {
        name: updateIntegrationDto.name,
        url: updateIntegrationDto.url,
        description: updateIntegrationDto.description,
        logoImage: updateIntegrationDto.logoImage,
        isActive: updateIntegrationDto.isActive,
        group: updateIntegrationDto.groupId ? {
          connect: {
            id: updateIntegrationDto.groupId
          }
        } : undefined
      },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        logoImage: true,
        isActive: true,
        groupId: true,
        group: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Integration updated successfully', updatedIntegration);
  }

  async removeIntegration(id: number): Promise<ApiResponse<any>> {
    const integration = await this.prisma.integration.findUnique({
      where: { id }
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    // Delete all related plan integrations first
    await this.prisma.planIntegration.deleteMany({
      where: { integrationId: id }
    });

    // Then delete the integration itself
    await this.prisma.integration.delete({
      where: { id }
    });

    return new ApiResponse(true, 'Integration deleted successfully');
  }

  // PlanIntegration CRUD operations
  async findAllPlanIntegrations(): Promise<ApiResponse<any>> {
    const planIntegrations = await this.prisma.planIntegration.findMany({
      select: {
        id: true,
        planId: true,
        integrationId: true,
        plan: {
          select: {
            id: true,
            name: true
          }
        },
        integration: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return new ApiResponse(true, '', planIntegrations);
  }

  async getPlanIntegrationById(id: number): Promise<ApiResponse<any>> {
    const planIntegration = await this.prisma.planIntegration.findUnique({
      where: { id },
      select: {
        id: true,
        planId: true,
        integrationId: true,
        plan: {
          select: {
            id: true,
            name: true
          }
        },
        integration: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!planIntegration) {
      throw new NotFoundException('Plan integration not found');
    }

    return new ApiResponse(true, 'Plan integration retrieved successfully', planIntegration);
  }

  async createPlanIntegration(createPlanIntegrationDto: CreatePlanIntegrationDto): Promise<ApiResponse<any>> {
    const planIntegration = await this.prisma.planIntegration.create({
      data: {
        plan: {
          connect: {
            id: createPlanIntegrationDto.planId
          }
        },
        integration: {
          connect: {
            id: createPlanIntegrationDto.integrationId
          }
        }
      },
      select: {
        id: true,
        planId: true,
        integrationId: true,
        plan: {
          select: {
            id: true,
            name: true
          }
        },
        integration: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Plan integration created successfully', planIntegration);
  }

  async updatePlanIntegration(id: number, updatePlanIntegrationDto: UpdatePlanIntegrationDto): Promise<ApiResponse<any>> {
    const planIntegration = await this.prisma.planIntegration.findUnique({
      where: { id }
    });

    if (!planIntegration) {
      throw new NotFoundException('Plan integration not found');
    }

    const updatedPlanIntegration = await this.prisma.planIntegration.update({
      where: { id },
      data: {
        plan: updatePlanIntegrationDto.planId ? {
          connect: {
            id: updatePlanIntegrationDto.planId
          }
        } : undefined,
        integration: updatePlanIntegrationDto.integrationId ? {
          connect: {
            id: updatePlanIntegrationDto.integrationId
          }
        } : undefined
      },
      select: {
        id: true,
        planId: true,
        integrationId: true,
        plan: {
          select: {
            id: true,
            name: true
          }
        },
        integration: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Plan integration updated successfully', updatedPlanIntegration);
  }

  async removePlanIntegration(id: number): Promise<ApiResponse<any>> {
    const planIntegration = await this.prisma.planIntegration.findUnique({
      where: { id }
    });

    if (!planIntegration) {
      throw new NotFoundException('Plan integration not found');
    }

    await this.prisma.planIntegration.delete({
      where: { id }
    });

    return new ApiResponse(true, 'Plan integration deleted successfully');
  }

  async uploadIntegrationImage(id: number, file: Express.Multer.File): Promise<ApiResponse<any>> {
    // Check if integration exists
    const integration = await this.prisma.integration.findUnique({
      where: { id }
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    // Upload image to Cloudinary
    const uploadedImage = await this.cloudinary.uploadImage(file, 'integrations');
    
    // Update integration with the image URL
    const updatedIntegration = await this.prisma.integration.update({
      where: { id },
      data: {
        logoImage: uploadedImage.url
      },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        logoImage: true,
        isActive: true,
        groupId: true,
        group: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Integration image uploaded successfully', updatedIntegration);
  }

  async deleteIntegrationImage(id: number): Promise<ApiResponse<any>> {
    // Check if integration exists
    const integration = await this.prisma.integration.findUnique({
      where: { id }
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    // Check if integration has an image
    if (!integration.logoImage) {
      throw new NotFoundException('Integration does not have an image');
    }

    try {
      // Extract public ID from the image URL
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const publicId = this.extractPublicIdFromUrl(integration.logoImage);
      
      // Delete image from Cloudinary
      await this.cloudinary.deleteImage(publicId);
    } catch (error) {
      // If we can't delete from Cloudinary, we still want to remove the URL from the integration
      console.warn(`Failed to delete image from Cloudinary: ${error.message}`);
    }

    // Remove image URL from integration
    const updatedIntegration = await this.prisma.integration.update({
      where: { id },
      data: {
        logoImage: null
      },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        logoImage: true,
        isActive: true,
        groupId: true,
        group: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Integration image deleted successfully', updatedIntegration);
  }

  private extractPublicIdFromUrl(url: string): string {
    // Extract public ID from Cloudinary URL
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1644334844/products/sample.jpg
    // Public ID would be: products/sample
    
    try {
      // Match the public ID part of the URL
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[^/.]+$/);
      if (!match || !match[1]) {
        throw new Error('Could not extract public ID from URL');
      }
      
      return match[1];
    } catch (error) {
      throw new Error(`Invalid Cloudinary URL: ${error.message}`);
    }
  }
}
