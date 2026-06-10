/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import * as bcrypt from 'bcrypt';
import { ApiResponse } from "src/common/api-response.dto";
import { EmailService } from "src/email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) { }

  async register(registerDto: RegisterDto): Promise<ApiResponse<any>> {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already registered');
    }

    // Determine salt rounds from env or use default
    const saltRounds = Number(process.env.PASS_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate activation code
    const activationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // create inactive user with activation code
    const user = await this.prisma.user.create({
      data: {
        email,
        hash: hashedPassword,
        firstName,
        lastName,
        isActive: false,
        activationCode: activationCode as any
      }
    })

    // Send activation code via email
    try {
      await this.emailService.sendActivationCode(email, activationCode);
    } catch (error: any) {
      // Log error but don't fail registration
      console.error('Failed to send activation email:', error.message);
    }

    return new ApiResponse(true, 'User registered successfully. Please check your email for activation code.', {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  }

  async activateUser(email: string, code: string): Promise<ApiResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isActive) {
      throw new ConflictException('User is already activated');
    }

    if ((user as any).activationCode !== code) {
      throw new UnauthorizedException('Invalid activation code');
    }

    // Activate user
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        activationCode: null as any
      }
    });

    // get jwt token
    const payload = { sub: updatedUser.id, email: updatedUser.email, role: updatedUser.role };
    const access_token = this.jwtService.sign(payload);

    return new ApiResponse(true, 'User activated successfully', {
      access_token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        paymentType: updatedUser.paymentType,
        role: updatedUser.role
      }
    });
  }

  async login(loginDto: LoginDto): Promise<ApiResponse<any>> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is not active')
    }

    const isPasswordValid = await bcrypt.compare(password, user.hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid cerdentials')
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return new ApiResponse(true, 'User register success', {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        paymentType: user.paymentType,
        role: user.role,
      },
    });
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        paymentType: true,
        plan: true,
        planId: true,
        role: true,
        avatar: true,
      }
    })

    if (!user || !user.isActive) {
      return null;
    }
    return user;
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    // Generate 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Save code and expiration time (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetCode: code,
        passwordResetExpires: expiresAt
      }
    });

    // Send code via email
    try {
      await this.emailService.sendPasswordResetCode(email, code);
      return new ApiResponse(true, 'Password reset code sent to your email', { email });
    } catch (error: any) {
      throw new Error('Failed to send email: ' + error.message);
    }
  }
}