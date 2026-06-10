import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UploadedFile, UseInterceptors, Query } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { IntegrationsService } from "./integrations.service";
import {
  CreateIntegrationGroupDto,
  UpdateIntegrationGroupDto,
  CreateIntegrationDto,
  UpdateIntegrationDto,
  CreatePlanIntegrationDto,
  UpdatePlanIntegrationDto
} from "./integrations.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(
    private integrationsService: IntegrationsService
  ) { }

  // --- Integration Groups ---
  @Post('groups')
  createGroup(@Body() createIntegrationGroupDto: CreateIntegrationGroupDto) {
    return this.integrationsService.createIntegrationGroups(createIntegrationGroupDto);
  }

  @Get('groups')
  findAllGroups(@Query() paginationDto: PaginationDto) {
    return this.integrationsService.findAllIntegrationGroups(paginationDto);
  }

  @Get('groups/:id')
  findOneGroup(@Param('id') id: number) {
    return this.integrationsService.getIntegrationGroupsById(+id);
  }

  @Put('groups/:id')
  updateGroup(@Param('id') id: number, @Body() updateIntegrationGroupDto: UpdateIntegrationGroupDto) {
    return this.integrationsService.updateIntegrationGroups(+id, updateIntegrationGroupDto);
  }

  @Delete('groups/:id')
  removeGroup(@Param('id') id: number) {
    return this.integrationsService.removeIntegrationGroups(+id);
  }

  // --- Integrations ---
  @Post()
  create(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationsService.createIntegration(createIntegrationDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.integrationsService.findAllIntegrations(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.integrationsService.getIntegrationById(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateIntegrationDto: UpdateIntegrationDto) {
    return this.integrationsService.updateIntegration(+id, updateIntegrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.integrationsService.removeIntegration(+id);
  }

  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('file'))
  uploadLogo(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.integrationsService.uploadIntegrationImage(+id, file);
  }

  @Delete(':id/logo')
  deleteLogo(@Param('id') id: number) {
    return this.integrationsService.deleteIntegrationImage(+id);
  }

  // --- Plan Integrations (Relationships) ---
  @Post('plan-integrations')
  createPlanIntegration(@Body() createPlanIntegrationDto: CreatePlanIntegrationDto) {
    return this.integrationsService.createPlanIntegration(createPlanIntegrationDto);
  }

  @Get('plan-integrations')
  findAllPlanIntegrations(@Query() paginationDto: PaginationDto) {
    return this.integrationsService.findAllPlanIntegrations(paginationDto);
  }

  @Get('plan-integrations/:id')
  findOnePlanIntegration(@Param('id') id: number) {
    return this.integrationsService.getPlanIntegrationById(+id);
  }

  @Put('plan-integrations/:id')
  updatePlanIntegration(@Param('id') id: number, @Body() updatePlanIntegrationDto: UpdatePlanIntegrationDto) {
    return this.integrationsService.updatePlanIntegration(+id, updatePlanIntegrationDto);
  }

  @Delete('plan-integrations/:id')
  removePlanIntegration(@Param('id') id: number) {
    return this.integrationsService.removePlanIntegration(+id);
  }
}
