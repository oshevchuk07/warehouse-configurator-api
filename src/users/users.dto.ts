import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum PaymentType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  planId?: number;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newpassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class AssignPlanDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @ApiPropertyOptional({ enum: PaymentType, default: PaymentType.MONTHLY })
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;
}

export class UpdateSelfDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'User avatar image file' })
  @IsOptional()
  avatar?: any;
}
