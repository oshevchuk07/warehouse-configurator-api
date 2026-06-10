import { IsString, IsOptional, IsNumber, IsNotEmpty, IsBoolean, IsUrl } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

// IntegrationGroup DTOs
export class CreateIntegrationGroupDto {
  @ApiProperty({ example: 'ERP' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateIntegrationGroupDto {
  @ApiPropertyOptional({ example: 'Marketplaces' })
  @IsString()
  @IsOptional()
  name?: string;
}

// Integration DTOs
export class CreateIntegrationDto {
  @ApiProperty({ example: 'Shopify' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'https://shopify.com' })
  @IsUrl()
  @IsOptional()
  url: string;

  @ApiPropertyOptional({ example: 'Best e-commerce platform' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  logoImage?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  groupId: number;
}

export class UpdateIntegrationDto {
  @ApiPropertyOptional({ example: 'Shopify Plus' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://shopify.com/plus' })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ example: 'Enterprise e-commerce platform' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoImage?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  groupId?: number;
}

// PlanIntegration DTOs
export class CreatePlanIntegrationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  integrationId: number;
}

export class UpdatePlanIntegrationDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  planId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @IsOptional()
  integrationId?: number;
}

// Image upload DTO
export class UploadIntegrationImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
