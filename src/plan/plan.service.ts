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
        oldMonthlyPrice: true,
        oldYearlyPrice: true,
        features: true,
        createdAt: true,
        updatedAt: true,
        planIntegrations: true
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
        oldMonthlyPrice: true,
        oldYearlyPrice: true,
        features: true,
        createdAt: true,
        updatedAt: true,
        planIntegrations: true
      }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return new ApiResponse(true, 'Plan retrieved successfully', plan);
  }

  async getPlanWithIntegrations(id: number): Promise<ApiResponse<any>> {
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
        oldMonthlyPrice: true,
        oldYearlyPrice: true,
        features: true,
        createdAt: true,
        updatedAt: true,
        planIntegrations: {
          select: {
            id: true,
            integration: {
              select: {
                id: true,
                name: true,
                url: true,
                description: true,
                logoImage: true,
                isActive: true,
                group: {
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

    return new ApiResponse(true, 'Plan with integrations retrieved successfully', plan);
  }

  async createPlan(createPlanDto: CreatePlanDto): Promise<ApiResponse<any>> {
    const data = Object.fromEntries(
      Object.entries(createPlanDto).filter(([_, v]) => v !== undefined)
    ) as any;

    const plan = await this.prisma.plan.create({
      data: data,
      select: {
        id: true,
        name: true,
        description: true,
        subtitle: true,
        isActive: true,
        isPopular: true,

        monthlyPrice: true,
        yearlyPrice: true,
        oldMonthlyPrice: true,
        oldYearlyPrice: true,
        features: true,
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
        oldMonthlyPrice: updatePlanDto.oldMonthlyPrice,
        oldYearlyPrice: updatePlanDto.oldYearlyPrice,
        features: updatePlanDto.features
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
        oldMonthlyPrice: true,
        oldYearlyPrice: true,
        features: true,
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

    // Delete all related plan integrations first
    await this.prisma.planIntegration.deleteMany({
      where: { planId: id }
    });

    // Then delete the plan itself
    await this.prisma.plan.delete({
      where: { id }
    });

    return new ApiResponse(true, 'Plan deleted successfully');
  }

  async bulkReplacePlanIntegrations(planId: number, integrationIds: number[]): Promise<ApiResponse<any>> {
    // Check if plan exists
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // Delete all existing plan integrations for this plan
    await this.prisma.planIntegration.deleteMany({
      where: { planId }
    });

    // Create new plan integrations
    const newPlanIntegrations = integrationIds.map(integrationId => ({
      planId,
      integrationId
    }));

    if (newPlanIntegrations.length > 0) {
      await this.prisma.planIntegration.createMany({
        data: newPlanIntegrations
      });
    }

    return new ApiResponse(true, 'Plan integrations updated successfully');
  }
}
