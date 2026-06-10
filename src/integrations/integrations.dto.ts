import { IsString, IsOptional, IsNumber, IsNotEmpty, IsBoolean, IsUrl } from "class-validator";

// IntegrationGroup DTOs
export class CreateIntegrationGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateIntegrationGroupDto {
  @IsString()
  @IsOptional()
  name?: string;
}

// Integration DTOs
export class CreateIntegrationDto {
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
  groupId: number;
}

export class UpdateIntegrationDto {
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
  groupId?: number;
}

// PlanIntegration DTOs
export class CreatePlanIntegrationDto {
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @IsNumber()
  @IsNotEmpty()
  integrationId: number;
}

export class UpdatePlanIntegrationDto {
  @IsNumber()
  @IsOptional()
  planId?: number;

  @IsNumber()
  @IsOptional()
  integrationId?: number;
}

// Image upload DTO
export class UploadIntegrationImageDto {
  // This DTO is used for validation but doesn't have any fields
  // since we're handling file uploads differently
}
