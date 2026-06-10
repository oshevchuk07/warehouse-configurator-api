import { IsString, IsOptional, IsNumber, IsNotEmpty, IsBoolean, IsUrl } from "class-validator";

// ServiceCategory DTOs
export class CreateServiceCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateServiceCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;
}

// Service DTOs
export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logoImage?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logoImage?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}

// PlanService DTOs
export class CreatePlanServiceDto {
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @IsNumber()
  @IsNotEmpty()
  serviceId: number;
}

export class UpdatePlanServiceDto {
  @IsNumber()
  @IsOptional()
  planId?: number;

  @IsNumber()
  @IsOptional()
  serviceId?: number;
}

// Image upload DTO
export class UploadServiceImageDto {
  // This DTO is used for validation but doesn't have any fields
  // since we're handling file uploads differently
}