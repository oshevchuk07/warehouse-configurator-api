import { Body, Controller, Delete, Get, Param, Put, Req, BadRequestException, UseGuards, UseInterceptors, ClassSerializerInterceptor, UploadedFile, Post, Query } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./users.dto";
import { ChangePasswordDto } from "./users.dto";
import { AssignPlanDto } from "./users.dto";
import { UpdateSelfDto } from "./users.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from "@nestjs/swagger";

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@Req() req: any) {
    return this.usersService.getUserById(+req.user.id);
  }

  @Put('me')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update current user profile' })
  updateSelf(
    @Req() req: any, 
    @Body() updateSelfDto: UpdateSelfDto,
    @UploadedFile() avatar?: Express.Multer.File
  ) {
    return this.usersService.updateSelf(+req.user.id, updateSelfDto, avatar);
  }

  @Post('me/change-password')
  @ApiOperation({ summary: 'Change current user password' })
  changeSelfPassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(+req.user.id, changePasswordDto);
  }

  @Delete('me/avatar')
  @ApiOperation({ summary: 'Remove current user avatar' })
  removeAvatar(@Req() req: any) {
    return this.usersService.removeAvatar(+req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user (Admin)' })
  updateUser(@Param('id') id: string | number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove user (Admin)' })
  removeUser(@Param('id') id: number) {
    return this.usersService.removeUser(+id);
  }

  @Post(':id/change-password')
  @ApiOperation({ summary: 'Change user password (Admin)' })
  changePassword(@Param('id') id: number, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(+id, changePasswordDto);
  }

  @Put(':id/plan')
  @ApiOperation({ summary: 'Assign a subscription plan to user' })
  assignPlan(@Param('id') id: number, @Body() assignPlanDto: AssignPlanDto) {
    return this.usersService.assignPlan(+id, assignPlanDto);
  }

  @Delete(':id/plan')
  @ApiOperation({ summary: 'Remove subscription plan from user' })
  removePlan(@Param('id') id: number) {
    return this.usersService.removePlan(+id);
  }
}
