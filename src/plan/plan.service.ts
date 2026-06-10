/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePlanDto, UpdatePlanDto } from "./plan.dto";
import { PaginationDto, PaginatedResponseDto } from "src/common/dto/pagination.dto";

@Injectable()
export class PlanService {
  constructor(
    private prisma: PrismaService
  ) { }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [plans, total] = await Promise.all([
      this.prisma.plan.findMany({
        skip,
        take: limit,
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
      }),
      this.prisma.plan.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: plans,
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

  async getPlanById(id: number): Promise<any> {
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

    return plan;
  }

  async getPlanWithIntegrations(id: number): Promise<any> {
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

    return plan;
  }

  async createPlan(createPlanDto: CreatePlanDto): Promise<any> {
    const data = Object.fromEntries(
      Object.entries(createPlanDto).filter(([_, v]) => v !== undefined)
    ) as any;

    return this.prisma.plan.create({
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
  }

  async updatePlan(id: number, updatePlanDto: UpdatePlanDto): Promise<any> {
    const plan = await this.prisma.plan.findUnique({
      where: { id }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return this.prisma.plan.update({
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
  }

  async removePlan(id: number): Promise<void> {
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
  }

  async bulkReplacePlanIntegrations(planId: number, integrationIds: number[]): Promise<void> {
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
  }
}
