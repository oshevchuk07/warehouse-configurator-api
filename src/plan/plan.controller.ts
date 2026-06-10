import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PlanService } from "./plan.service";
import { CreatePlanDto, UpdatePlanDto, AddServicesToPlanDto } from "./plan.dto";

@Controller('plan')
@UseGuards(JwtAuthGuard)
export class PlanController {
  constructor(
    private planService: PlanService
  ) { }

  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.createPlan(createPlanDto);
  }

  @Get('list')
  findAll() {
    return this.planService.findAll();
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

  @Post('bulk-replace-services')
  bulkReplaceServices(@Body() addServicesToPlanDto: AddServicesToPlanDto) {
    return this.planService.bulkReplacePlanServices(addServicesToPlanDto.planId, addServicesToPlanDto.serviceIds);
  }
}