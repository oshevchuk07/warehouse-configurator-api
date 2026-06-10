import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto, ActivateDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and return JWT token' })
  login(
    @Body(ValidationPipe) body: LoginDto
  ) {
    return this.authService.login(body);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  register(
    @Body(ValidationPipe) registerDto: RegisterDto
  ) {
    return this.authService.register(registerDto);
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate user account with code' })
  async activateUser(
    @Body(ValidationPipe) activateDto: ActivateDto
  ) {
    return await this.authService.activateUser(activateDto.email, activateDto.code);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile (JWT check)' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset code' })
  async forgotPassword(
    @Body() body: { email: string }
  ) {
    return await this.authService.forgotPassword(body.email);
  }
}
