import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto, ActivateDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ApiResponse } from "src/common/api-response.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body(ValidationPipe) body: LoginDto
  ) {
    return this.authService.login(body);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body(ValidationPipe) registerDto: RegisterDto
  ) {
    return this.authService.register(registerDto);
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  async activateUser(
    @Body(ValidationPipe) activateDto: ActivateDto
  ) {
    return await this.authService.activateUser(activateDto.email, activateDto.code);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return new ApiResponse(true, '', req.user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() body: { email: string }
  ) {
    return await this.authService.forgotPassword(body.email);
  }
}