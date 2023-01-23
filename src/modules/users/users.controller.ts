import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(':id')
  async getById(@Param ('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findById(id);
  }

  @Post()
  async createUser(@Body() newUser: CreateUserDto) {
    return this.userService.createUser(newUser);
  }
}
