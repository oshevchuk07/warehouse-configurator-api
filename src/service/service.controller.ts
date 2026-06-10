import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ServiceService } from "./service.service";
import {
  CreateServiceCategoryDto,
  UpdateServiceCategoryDto,
  CreateServiceDto,
  UpdateServiceDto,
  CreatePlanServiceDto,
  UpdatePlanServiceDto
} from "./service.dto";

@Controller('service')
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(
    private serviceService: ServiceService
  ) { }

  // ServiceCategory endpoints
  @Post('category')
  createCategory(@Body() createServiceCategoryDto: CreateServiceCategoryDto) {
    return this.serviceService.createServiceCategory(createServiceCategoryDto);
  }

  @Get('category/list')
  findAllCategories() {
    return this.serviceService.findAllServiceCategories();
  }

  @Get('category/:id')
  findOneCategory(@Param('id') id: number) {
    return this.serviceService.getServiceCategoryById(+id);
  }

  @Put('category/:id')
  updateCategory(@Param('id') id: number, @Body() updateServiceCategoryDto: UpdateServiceCategoryDto) {
    return this.serviceService.updateServiceCategory(+id, updateServiceCategoryDto);
  }

  @Delete('category/:id')
  removeCategory(@Param('id') id: number) {
    return this.serviceService.removeServiceCategory(+id);
  }

  // Service endpoints
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.createService(createServiceDto);
  }

  @Get('list')
  findAll() {
    return this.serviceService.findAllServices();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serviceService.getServiceById(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.updateService(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.serviceService.removeService(+id);
  }

  // PlanService endpoints
  @Post('plan-service')
  createPlanService(@Body() createPlanServiceDto: CreatePlanServiceDto) {
    return this.serviceService.createPlanService(createPlanServiceDto);
  }

  @Get('plan-service/list')
  findAllPlanServices() {
    return this.serviceService.findAllPlanServices();
  }

  @Get('plan-service/:id')
  findOnePlanService(@Param('id') id: number) {
    return this.serviceService.getPlanServiceById(+id);
  }

  @Put('plan-service/:id')
  updatePlanService(@Param('id') id: number, @Body() updatePlanServiceDto: UpdatePlanServiceDto) {
    return this.serviceService.updatePlanService(+id, updatePlanServiceDto);
  }

  @Delete('plan-service/:id')
  removePlanService(@Param('id') id: number) {
    return this.serviceService.removePlanService(+id);
  }

  @Post('upload-image/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadServiceImage(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.serviceService.uploadServiceImage(+id, file);
  }

  @Delete('delete-image/:id')
  deleteServiceImage(@Param('id') id: number) {
    return this.serviceService.deleteServiceImage(+id);
  }
}