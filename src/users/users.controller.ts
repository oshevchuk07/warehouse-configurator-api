import { Body, Controller, Delete, Get, Param, Put, Req, BadRequestException, UseGuards, UseInterceptors, ClassSerializerInterceptor, UploadedFile, Post } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./users.dto";
import { ChangePasswordDto } from "./users.dto";
import { AssignPlanDto } from "./users.dto";
import { UpdateSelfDto } from "./users.dto";

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService
  ) { }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.getUserById(+req.user.id);
  }

  @Put('me')
  @UseInterceptors(FileInterceptor('avatar'))
  updateSelf(
    @Req() req: any, 
    @Body() updateSelfDto: UpdateSelfDto,
    @UploadedFile() avatar?: Express.Multer.File
  ) {
    return this.usersService.updateSelf(+req.user.id, updateSelfDto, avatar);
  }

  @Post('me/change-password')
  changeSelfPassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(+req.user.id, changePasswordDto);
  }

  @Delete('me/avatar')
  removeAvatar(@Req() req: any) {
    return this.usersService.removeAvatar(+req.user.id);
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(+id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string | number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.usersService.removeUser(+id);
  }

  @Post(':id/change-password')
  changePassword(@Param('id') id: number, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(+id, changePasswordDto);
  }

  @Put(':id/plan')
  assignPlan(@Param('id') id: number, @Body() assignPlanDto: AssignPlanDto) {
    return this.usersService.assignPlan(+id, assignPlanDto);
  }

  @Delete(':id/plan')
  removePlan(@Param('id') id: number) {
    return this.usersService.removePlan(+id);
  }
}
