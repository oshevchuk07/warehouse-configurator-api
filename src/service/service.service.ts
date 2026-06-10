import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ApiResponse } from "src/common/api-response.dto";
import {
  CreateServiceCategoryDto,
  UpdateServiceCategoryDto,
  CreateServiceDto,
  UpdateServiceDto,
  CreatePlanServiceDto,
  UpdatePlanServiceDto
} from "./service.dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) { }

  // ServiceCategory CRUD operations
  async findAllServiceCategories(): Promise<ApiResponse<any>> {
    const categories = await this.prisma.serviceCategory.findMany({
      select: {
        id: true,
        name: true,
        services: true
      }
    });
    return new ApiResponse(true, '', categories);
  }

  async getServiceCategoryById(id: number): Promise<ApiResponse<any>> {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true
      }
    });

    if (!category) {
      throw new NotFoundException('Service category not found');
    }

    return new ApiResponse(true, 'Service category retrieved successfully', category);
  }

  async createServiceCategory(createServiceCategoryDto: CreateServiceCategoryDto): Promise<ApiResponse<any>> {
    const category = await this.prisma.serviceCategory.create({
      data: {
        name: createServiceCategoryDto.name
      },
      select: {
        id: true,
        name: true
      }
    });

    return new ApiResponse(true, 'Service category created successfully', category);
  }

  async updateServiceCategory(id: number, updateServiceCategoryDto: UpdateServiceCategoryDto): Promise<ApiResponse<any>> {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException('Service category not found');
    }

    const updatedCategory = await this.prisma.serviceCategory.update({
      where: { id },
      data: {
        name: updateServiceCategoryDto.name
      },
      select: {
        id: true,
        name: true
      }
    });

    return new ApiResponse(true, 'Service category updated successfully', updatedCategory);
  }

  async removeServiceCategory(id: number): Promise<ApiResponse<any>> {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException('Service category not found');
    }

    // Get all services in this category
    const services = await this.prisma.service.findMany({
      where: { categoryId: id }
    });

    // Delete all related plan services for all services in this category
    if (services.length > 0) {
      const serviceIds = services.map(service => service.id);
      await this.prisma.planService.deleteMany({
        where: { serviceId: { in: serviceIds } }
      });
    }

    // Delete all services in this category
    await this.prisma.service.deleteMany({
      where: { categoryId: id }
    });

    // Then delete the category itself
    await this.prisma.serviceCategory.delete({
      where: { id }
    });

    return new ApiResponse(true, 'Service category deleted successfully');
  }

  // Service CRUD operations
  async findAllServices(): Promise<ApiResponse<any>> {
    const services = await this.prisma.service.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        logoImage: true,
        isActive: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return new ApiResponse(true, '', services);
  }

  async getServiceById(id: number): Promise<ApiResponse<any>> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        logoImage: true,
        isActive: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return new ApiResponse(true, 'Service retrieved successfully', service);
  }

  async createService(createServiceDto: CreateServiceDto): Promise<ApiResponse<any>> {
    const service = await this.prisma.service.create({
      data: {
        name: createServiceDto.name,
        url: createServiceDto.url,
        description: createServiceDto.description,
        logoImage: createServiceDto.logoImage,
        isActive: createServiceDto.isActive,
        category: {
          connect: {
            id: createServiceDto.categoryId
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
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Service created successfully', service);
  }

  async updateService(id: number, updateServiceDto: UpdateServiceDto): Promise<ApiResponse<any>> {
    const service = await this.prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: {
        name: updateServiceDto.name,
        url: updateServiceDto.url,
        description: updateServiceDto.description,
        logoImage: updateServiceDto.logoImage,
        isActive: updateServiceDto.isActive,
        category: updateServiceDto.categoryId ? {
          connect: {
            id: updateServiceDto.categoryId
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
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Service updated successfully', updatedService);
  }

  async removeService(id: number): Promise<ApiResponse<any>> {
    const service = await this.prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Delete all related plan services first
    await this.prisma.planService.deleteMany({
      where: { serviceId: id }
    });

    // Then delete the service itself
    await this.prisma.service.delete({
      where: { id }
    });

    return new ApiResponse(true, 'Service deleted successfully');
  }

  // PlanService CRUD operations
  async findAllPlanServices(): Promise<ApiResponse<any>> {
    const planServices = await this.prisma.planService.findMany({
      select: {
        id: true,
        planId: true,
        serviceId: true,
        plan: {
          select: {
            id: true,
            name: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return new ApiResponse(true, '', planServices);
  }

  async getPlanServiceById(id: number): Promise<ApiResponse<any>> {
    const planService = await this.prisma.planService.findUnique({
      where: { id },
      select: {
        id: true,
        planId: true,
        serviceId: true,
        plan: {
          select: {
            id: true,
            name: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!planService) {
      throw new NotFoundException('Plan service not found');
    }

    return new ApiResponse(true, 'Plan service retrieved successfully', planService);
  }

  async createPlanService(createPlanServiceDto: CreatePlanServiceDto): Promise<ApiResponse<any>> {
    const planService = await this.prisma.planService.create({
      data: {
        plan: {
          connect: {
            id: createPlanServiceDto.planId
          }
        },
        service: {
          connect: {
            id: createPlanServiceDto.serviceId
          }
        }
      },
      select: {
        id: true,
        planId: true,
        serviceId: true,
        plan: {
          select: {
            id: true,
            name: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Plan service created successfully', planService);
  }

  async updatePlanService(id: number, updatePlanServiceDto: UpdatePlanServiceDto): Promise<ApiResponse<any>> {
    const planService = await this.prisma.planService.findUnique({
      where: { id }
    });

    if (!planService) {
      throw new NotFoundException('Plan service not found');
    }

    const updatedPlanService = await this.prisma.planService.update({
      where: { id },
      data: {
        plan: updatePlanServiceDto.planId ? {
          connect: {
            id: updatePlanServiceDto.planId
          }
        } : undefined,
        service: updatePlanServiceDto.serviceId ? {
          connect: {
            id: updatePlanServiceDto.serviceId
          }
        } : undefined
      },
      select: {
        id: true,
        planId: true,
        serviceId: true,
        plan: {
          select: {
            id: true,
            name: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Plan service updated successfully', updatedPlanService);
  }

  async removePlanService(id: number): Promise<ApiResponse<any>> {
    const planService = await this.prisma.planService.findUnique({
      where: { id }
    });

    if (!planService) {
      throw new NotFoundException('Plan service not found');
    }

    await this.prisma.planService.delete({
      where: { id }
    });

    return new ApiResponse(true, 'Plan service deleted successfully');
  }

  async uploadServiceImage(id: number, file: Express.Multer.File): Promise<ApiResponse<any>> {
    // Check if service exists
    const service = await this.prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Upload image to Cloudinary
    const uploadedImage = await this.cloudinary.uploadImage(file, 'services');
    
    // Update service with the image URL
    const updatedService = await this.prisma.service.update({
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
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Service image uploaded successfully', updatedService);
  }

  async deleteServiceImage(id: number): Promise<ApiResponse<any>> {
    // Check if service exists
    const service = await this.prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Check if service has an image
    if (!service.logoImage) {
      throw new NotFoundException('Service does not have an image');
    }

    try {
      // Extract public ID from the image URL
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const publicId = this.extractPublicIdFromUrl(service.logoImage);
      
      // Delete image from Cloudinary
      await this.cloudinary.deleteImage(publicId);
    } catch (error) {
      // If we can't delete from Cloudinary, we still want to remove the URL from the service
      console.warn(`Failed to delete image from Cloudinary: ${error.message}`);
    }

    // Remove image URL from service
    const updatedService = await this.prisma.service.update({
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
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return new ApiResponse(true, 'Service image deleted successfully', updatedService);
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