import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateIntegrationGroupDto,
  UpdateIntegrationGroupDto,
  CreateIntegrationDto,
  UpdateIntegrationDto,
  CreatePlanIntegrationDto,
  UpdatePlanIntegrationDto
} from "./integrations.dto";
import { IStorageService, STORAGE_SERVICE } from "src/storage/storage.interface";
import { PaginationDto, PaginatedResponseDto } from "src/common/dto/pagination.dto";

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private storageService: IStorageService
  ) { }

  // IntegrationGroup CRUD operations
  async findAllIntegrationGroups(paginationDto: PaginationDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [groups, total] = await Promise.all([
      this.prisma.integrationGroup.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          integrations: true
        }
      }),
      this.prisma.integrationGroup.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: groups,
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

  async getIntegrationGroupsById(id: number): Promise<any> {
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

    return group;
  }

  async createIntegrationGroups(createIntegrationGroupDto: CreateIntegrationGroupDto): Promise<any> {
    return await this.prisma.integrationGroup.create({
      data: {
        name: createIntegrationGroupDto.name
      },
      select: {
        id: true,
        name: true
      }
    });
  }

  async updateIntegrationGroups(id: number, updateIntegrationGroupDto: UpdateIntegrationGroupDto): Promise<any> {
    const group = await this.prisma.integrationGroup.findUnique({
      where: { id }
    });

    if (!group) {
      throw new NotFoundException('Integration group not found');
    }

    return this.prisma.integrationGroup.update({
      where: { id },
      data: {
        name: updateIntegrationGroupDto.name
      },
      select: {
        id: true,
        name: true
      }
    });
  }

  async removeIntegrationGroups(id: number): Promise<void> {
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
  }

  // Integration CRUD operations
  async findAllIntegrations(paginationDto: PaginationDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [integrations, total] = await Promise.all([
      this.prisma.integration.findMany({
        skip,
        take: limit,
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
      }),
      this.prisma.integration.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: integrations,
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

  async getIntegrationById(id: number): Promise<any> {
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

    return integration;
  }

  async createIntegration(createIntegrationDto: CreateIntegrationDto): Promise<any> {
    return await this.prisma.integration.create({
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
  }

  async updateIntegration(id: number, updateIntegrationDto: UpdateIntegrationDto): Promise<any> {
    const integration = await this.prisma.integration.findUnique({
      where: { id }
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return this.prisma.integration.update({
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
  }

  async removeIntegration(id: number): Promise<void> {
    const integration = await this.prisma.integration.findUnique({
      where: { id }
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    // Delete logo if exists
    if (integration.logoImage) {
      try {
        await this.deleteIntegrationImage(id);
      } catch (error) {
        console.warn(`Could not delete logo for integration ${id}: ${error.message}`);
      }
    }

    // Delete all related plan integrations first
    await this.prisma.planIntegration.deleteMany({
      where: { integrationId: id }
    });

    // Then delete the integration itself
    await this.prisma.integration.delete({
      where: { id }
    });
  }

  // PlanIntegration CRUD operations
  async findAllPlanIntegrations(paginationDto: PaginationDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [planIntegrations, total] = await Promise.all([
      this.prisma.planIntegration.findMany({
        skip,
        take: limit,
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
      }),
      this.prisma.planIntegration.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: planIntegrations,
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

  async getPlanIntegrationById(id: number): Promise<any> {
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

    return planIntegration;
  }

  async createPlanIntegration(createPlanIntegrationDto: CreatePlanIntegrationDto): Promise<any> {
    return await this.prisma.planIntegration.create({
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
  }

  async updatePlanIntegration(id: number, updatePlanIntegrationDto: UpdatePlanIntegrationDto): Promise<any> {
    const planIntegration = await this.prisma.planIntegration.findUnique({
      where: { id }
    });

    if (!planIntegration) {
      throw new NotFoundException('Plan integration not found');
    }

    return this.prisma.planIntegration.update({
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
  }

  async removePlanIntegration(id: number): Promise<void> {
    const planIntegration = await this.prisma.planIntegration.findUnique({
      where: { id }
    });

    if (!planIntegration) {
      throw new NotFoundException('Plan integration not found');
    }

    await this.prisma.planIntegration.delete({
      where: { id }
    });
  }

  async uploadIntegrationImage(id: number, file: Express.Multer.File): Promise<any> {
    // Check if integration exists
    const integration = await this.prisma.integration.findUnique({
      where: { id }
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    // Upload image using the unified storage service
    const uploadedImage = await this.storageService.uploadImage(file, 'integrations');
    
    // Update integration with the image URL
    return this.prisma.integration.update({
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
  }

  async deleteIntegrationImage(id: number): Promise<any> {
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
      // For local storage, the URL contains the public_id pattern
      // For Cloudinary, we might need a more robust extraction if not stored separately
      // In this simple implementation, we'll try to extract it from the URL
      const publicId = this.extractPublicIdFromUrl(integration.logoImage);
      await this.storageService.deleteImage(publicId);
    } catch (error) {
      console.warn(`Failed to delete image from storage: ${error.message}`);
    }

    // Remove image URL from integration
    return this.prisma.integration.update({
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
  }

  private extractPublicIdFromUrl(url: string): string {
    // Local: /uploads/integrations/uuid.png -> integrations/uuid.png
    if (url.startsWith('/uploads/')) {
      return url.replace('/uploads/', '');
    }

    // Cloudinary: extract from URL
    try {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[^/.]+$/);
      return match ? match[1] : url;
    } catch (error) {
      return url;
    }
  }
}
