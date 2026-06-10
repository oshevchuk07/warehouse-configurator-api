/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ApiResponse } from "src/common/api-response.dto";
import { CreatePlanDto, UpdatePlanDto } from "./plan.dto";

@Injectable()
export class PlanService {
  constructor(
    private prisma: PrismaService
  ) { }

  async findAll(): Promise<ApiResponse<any>> {
    const plans = await this.prisma.plan.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        subtitle: true,
        isActive: true,
        isPopular: true,
        monthlyPrice: true,
        yearlyPrice: true,
        prevMonthlyPrice: true,
        prevYearlyPrice: true,
        advantages: true,
        createdAt: true,
        updatedAt: true,
        planServices: true
      }
    });
    return new ApiResponse(true, '', plans);
  }

  async getPlanById(id: number): Promise<ApiResponse<any>> {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        subtitle: true,
        isActive: true,
        isPopular: true,
        monthlyPrice: true,
        yearlyPrice: true,
        prevMonthlyPrice: true,
        prevYearlyPrice: true,
        advantages: true,
        createdAt: true,
        updatedAt: true,
        planServices: true
      }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return new ApiResponse(true, 'Plan retrieved successfully', plan);
  }

  async getPlanWithServices(id: number): Promise<ApiResponse<any>> {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        subtitle: true,
        isActive: true,
        isPopular: true,
        monthlyPrice: true,
        yearlyPrice: true,
        prevMonthlyPrice: true,
        prevYearlyPrice: true,
        advantages: true,
        createdAt: true,
        updatedAt: true,
        planServices: {
          select: {
            id: true,
            service: {
              select: {
                id: true,
                name: true,
                url: true,
                description: true,
                logoImage: true,
                isActive: true,
                category: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return new ApiResponse(true, 'Plan with services retrieved successfully', plan);
  }

  async createPlan(createPlanDto: CreatePlanDto): Promise<ApiResponse<any>> {
    const data = Object.fromEntries(
      Object.entries(createPlanDto).filter(([_, v]) => v !== undefined)
    ) as CreatePlanDto;

    const plan = await this.prisma.plan.create({
      data: data,
      // {
      //   name: createPlanDto.name,
      //   description: createPlanDto.description,
      //   subtitle: createPlanDto.subtitle,
      //   isActive: createPlanDto.isActive,
      //   isPopular: createPlanDto.isPopular,

      //   monthlyPrice: createPlanDto.monthlyPrice,
      //   yearlyPrice: createPlanDto.yearlyPrice,
      //   prevMonthlyPrice: createPlanDto.prevMonthlyPrice,
      //   prevYearlyPrice: createPlanDto.prevYearlyPrice,
      //   advantages: createPlanDto.advantages
      // },
      select: {
        id: true,
        name: true,
        description: true,
        subtitle: true,
        isActive: true,
        isPopular: true,

        monthlyPrice: true,
        yearlyPrice: true,
        prevMonthlyPrice: true,
        prevYearlyPrice: true,
        advantages: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return new ApiResponse(true, 'Plan created successfully', plan);
  }

  async updatePlan(id: number, updatePlanDto: UpdatePlanDto): Promise<ApiResponse<any>> {
    const plan = await this.prisma.plan.findUnique({
      where: { id }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const updatedPlan = await this.prisma.plan.update({
      where: { id },
      data: {
        name: updatePlanDto.name,
        description: updatePlanDto.description,
        subtitle: updatePlanDto.subtitle,
        isActive: updatePlanDto.isActive,
        isPopular: updatePlanDto.isPopular,

        monthlyPrice: updatePlanDto.monthlyPrice,
        yearlyPrice: updatePlanDto.yearlyPrice,
        prevMonthlyPrice: updatePlanDto.prevMonthlyPrice,
        prevYearlyPrice: updatePlanDto.prevYearlyPrice,
        advantages: updatePlanDto.advantages
      },
      select: {
        id: true,
        name: true,
        description: true,
        subtitle: true,
        isActive: true,
        isPopular: true,

        monthlyPrice: true,
        yearlyPrice: true,
        prevMonthlyPrice: true,
        prevYearlyPrice: true,
        advantages: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return new ApiResponse(true, 'Plan updated successfully', updatedPlan);
  }

  async removePlan(id: number): Promise<ApiResponse<any>> {
    const plan = await this.prisma.plan.findUnique({
      where: { id }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Delete all related plan services first
    await this.prisma.planService.deleteMany({
      where: { planId: id }
    });

    // Then delete the plan itself
    await this.prisma.plan.delete({
      where: { id }
    });

    return new ApiResponse(true, 'Plan deleted successfully');
  }

  async bulkReplacePlanServices(planId: number, serviceIds: number[]): Promise<ApiResponse<any>> {
    // Check if plan exists
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Delete all existing plan services for this plan
    await this.prisma.planService.deleteMany({
      where: { planId }
    });

    // Create new plan services
    const newPlanServices = serviceIds.map(serviceId => ({
      planId,
      serviceId
    }));

    if (newPlanServices.length > 0) {
      await this.prisma.planService.createMany({
        data: newPlanServices
      });
    }

    return new ApiResponse(true, 'Plan services updated successfully');
  }
}