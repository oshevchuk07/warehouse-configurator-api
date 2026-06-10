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
  UpdatePlanIntegrationDto,
  UploadIntegrationImageDto
} from "./integrations.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from "@nestjs/swagger";

@ApiTags('Integrations')
@ApiBearerAuth('access-token')
@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(
    private integrationsService: IntegrationsService
  ) { }

  // --- Integration Groups ---
  @Post('groups')
  @ApiOperation({ summary: 'Create a new integration group' })
  createGroup(@Body() createIntegrationGroupDto: CreateIntegrationGroupDto) {
    return this.integrationsService.createIntegrationGroups(createIntegrationGroupDto);
  }

  @Get('groups')
  @ApiOperation({ summary: 'Get all integration groups with pagination' })
  findAllGroups(@Query() paginationDto: PaginationDto) {
    return this.integrationsService.findAllIntegrationGroups(paginationDto);
  }

  @Get('groups/:id')
  @ApiOperation({ summary: 'Get an integration group by ID' })
  findOneGroup(@Param('id') id: number) {
    return this.integrationsService.getIntegrationGroupsById(+id);
  }

  @Put('groups/:id')
  @ApiOperation({ summary: 'Update an integration group' })
  updateGroup(@Param('id') id: number, @Body() updateIntegrationGroupDto: UpdateIntegrationGroupDto) {
    return this.integrationsService.updateIntegrationGroups(+id, updateIntegrationGroupDto);
  }

  @Delete('groups/:id')
  @ApiOperation({ summary: 'Remove an integration group' })
  removeGroup(@Param('id') id: number) {
    return this.integrationsService.removeIntegrationGroups(+id);
  }

  // --- Integrations ---
  @Post()
  @ApiOperation({ summary: 'Create a new integration' })
  create(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationsService.createIntegration(createIntegrationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all integrations with pagination' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.integrationsService.findAllIntegrations(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an integration by ID' })
  findOne(@Param('id') id: number) {
    return this.integrationsService.getIntegrationById(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an integration' })
  update(@Param('id') id: number, @Body() updateIntegrationDto: UpdateIntegrationDto) {
    return this.integrationsService.updateIntegration(+id, updateIntegrationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an integration' })
  remove(@Param('id') id: number) {
    return this.integrationsService.removeIntegration(+id);
  }

  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadIntegrationImageDto })
  @ApiOperation({ summary: 'Upload logo image for an integration' })
  uploadLogo(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.integrationsService.uploadIntegrationImage(+id, file);
  }

  @Delete(':id/logo')
  @ApiOperation({ summary: 'Delete logo image of an integration' })
  deleteLogo(@Param('id') id: number) {
    return this.integrationsService.deleteIntegrationImage(+id);
  }

  // --- Plan Integrations (Relationships) ---
  @Post('plan-integrations')
  @ApiOperation({ summary: 'Link a plan with an integration' })
  createPlanIntegration(@Body() createPlanIntegrationDto: CreatePlanIntegrationDto) {
    return this.integrationsService.createPlanIntegration(createPlanIntegrationDto);
  }

  @Get('plan-integrations')
  @ApiOperation({ summary: 'Get all plan-integration links' })
  findAllPlanIntegrations(@Query() paginationDto: PaginationDto) {
    return this.integrationsService.findAllPlanIntegrations(paginationDto);
  }

  @Get('plan-integrations/:id')
  @ApiOperation({ summary: 'Get a plan-integration link by ID' })
  findOnePlanIntegration(@Param('id') id: number) {
    return this.integrationsService.getPlanIntegrationById(+id);
  }

  @Put('plan-integrations/:id')
  @ApiOperation({ summary: 'Update a plan-integration link' })
  updatePlanIntegration(@Param('id') id: number, @Body() updatePlanIntegrationDto: UpdatePlanIntegrationDto) {
    return this.integrationsService.updatePlanIntegration(+id, updatePlanIntegrationDto);
  }

  @Delete('plan-integrations/:id')
  @ApiOperation({ summary: 'Remove a plan-integration link' })
  removePlanIntegration(@Param('id') id: number) {
    return this.integrationsService.removePlanIntegration(+id);
  }
}
