import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Query } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PlanService } from "./plan.service";
import { CreatePlanDto, UpdatePlanDto } from "./plan.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags('Plans')
@ApiBearerAuth('access-token')
@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlanController {
  constructor(
    private planService: PlanService
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new subscription plan' })
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.createPlan(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all plans with pagination' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.planService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plan by ID' })
  findOne(@Param('id') id: number) {
    return this.planService.getPlanById(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a plan' })
  update(@Param('id') id: number | string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.updatePlan(+id, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a plan' })
  remove(@Param('id') id: number) {
    return this.planService.removePlan(+id);
  }

  @Put(':id/integrations')
  @ApiOperation({ summary: 'Bulk replace integrations for a plan' })
  replaceIntegrations(@Param('id') id: number, @Body() body: { integrationIds: number[] }) {
    return this.planService.bulkReplacePlanIntegrations(+id, body.integrationIds);
  }
}
