import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async findById(id: string) {
    return this.userRepository.getById(id);
  }

  async createUser(newUser: CreateUserDto) {
    return this.userRepository.createUser(newUser);
  }
}
