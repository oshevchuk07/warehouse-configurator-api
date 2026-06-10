import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UploadedFile, UseInterceptors } from "@nestjs/common";
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

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(
    private integrationsService: IntegrationsService
  ) { }

  @Post('groups')
  createGroup(@Body() createIntegrationGroupDto: CreateIntegrationGroupDto) {
    return this.integrationsService.createIntegrationGroups(createIntegrationGroupDto);
  }

  @Get('groups')
  findAllGroups() {
    return this.integrationsService.findAllIntegrationGroups();
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


  @Post()
  create(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationsService.createIntegration(createIntegrationDto);
  }

  @Get('')
  findAll() {
    return this.integrationsService.findAllIntegrations();
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

  // PlanIntegration endpoints
  @Post('plan-integration')
  createPlanIntegration(@Body() createPlanIntegrationDto: CreatePlanIntegrationDto) {
    return this.integrationsService.createPlanIntegration(createPlanIntegrationDto);
  }

  @Get('plan-integration/list')
  findAllPlanIntegrations() {
    return this.integrationsService.findAllPlanIntegrations();
  }

  @Get('plan-integration/:id')
  findOnePlanIntegration(@Param('id') id: number) {
    return this.integrationsService.getPlanIntegrationById(+id);
  }

  @Put('plan-integration/:id')
  updatePlanIntegration(@Param('id') id: number, @Body() updatePlanIntegrationDto: UpdatePlanIntegrationDto) {
    return this.integrationsService.updatePlanIntegration(+id, updatePlanIntegrationDto);
  }

  @Delete('plan-integration/:id')
  removePlanIntegration(@Param('id') id: number) {
    return this.integrationsService.removePlanIntegration(+id);
  }

  @Post('upload-image/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadIntegrationImage(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.integrationsService.uploadIntegrationImage(+id, file);
  }

  @Delete('delete-image/:id')
  deleteIntegrationImage(@Param('id') id: number) {
    return this.integrationsService.deleteIntegrationImage(+id);
  }
}
