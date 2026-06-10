import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Query } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PlanService } from "./plan.service";
import { CreatePlanDto, UpdatePlanDto, AddIntegrationsToPlanDto } from "./plan.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlanController {
  constructor(
    private planService: PlanService
  ) { }

  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.createPlan(createPlanDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.planService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.planService.getPlanById(+id);
  }

  @Put(':id')
  update(@Param('id') id: number | string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.updatePlan(+id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.planService.removePlan(+id);
  }

  @Put(':id/integrations')
  replaceIntegrations(@Param('id') id: number, @Body() body: { integrationIds: number[] }) {
    return this.planService.bulkReplacePlanIntegrations(+id, body.integrationIds);
  }
}
