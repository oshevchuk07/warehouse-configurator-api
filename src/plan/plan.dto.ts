import { IsString, IsOptional, IsNumber, IsJSON, IsNotEmpty, IsBoolean } from "class-validator";

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsNumber()
  @IsOptional()
  monthlyPrice?: number;

  @IsNumber()
  @IsOptional()
  yearlyPrice?: number;

  @IsNumber()
  @IsOptional()
  prevMonthlyPrice?: number;

  @IsNumber()
  @IsOptional()
  prevYearlyPrice?: number;

  @IsJSON()
  @IsOptional()
  advantages?: any;
}

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsNumber()
  @IsOptional()
  monthlyPrice?: number;

  @IsNumber()
  @IsOptional()
  yearlyPrice?: number;

  @IsNumber()
  @IsOptional()
  prevMonthlyPrice?: number;

  @IsNumber()
  @IsOptional()
  prevYearlyPrice?: number;

  @IsJSON()
  @IsOptional()
  advantages?: any;
}

export class AddServicesToPlanDto {
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  serviceIds: number[];
}