import { Body, Controller, Delete, Get, Param, Put, Req, BadRequestException, UseGuards, UseInterceptors, ClassSerializerInterceptor, UploadedFile } from "@nestjs/common";
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

  @Get('list')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
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

  @Put('me/change-password')
  changeSelfPassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(+req.user.id, changePasswordDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string | number, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id as string, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.usersService.removeUser(id);
  }

  @Put(':id/change-password')
  changePassword(@Param('id') id: number, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Put(':id/assign-plan')
  assignPlan(@Param('id') id: number, @Body() assignPlanDto: AssignPlanDto) {
    console.log('assignPlan called with id:', id);
    return this.usersService.assignPlan(+id, assignPlanDto);
  }

  @Delete(':id/plan')
  removePlan(@Param('id') id: number) {
    return this.usersService.removePlan(id);
  }

  @Delete('me/avatar')
  removeAvatar(@Req() req: any) {
    return this.usersService.removeAvatar(+req.user.id);
  }
}