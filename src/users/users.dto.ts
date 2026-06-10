import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, IsEnum } from "class-validator";

export enum PaymentType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsNumber()
  @IsOptional()
  planId?: number;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class AssignPlanDto {
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;
}

export class UpdateSelfDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}