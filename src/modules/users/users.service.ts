import { Injectable, NotFoundException } from '@nestjs/common';
// import { Transactional } from 'typeorm-transactional';
import { CreateUserDto } from './create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async findById(id: string) {
    const foundUser = await this.userRepository.getById(id);
    if (!foundUser) {
      throw new NotFoundException('User is not found');
    }

    return foundUser;
  }

  async findAll() {
    return this.userRepository.find();
  }

  // @Transactional()
  async createUser(newUser: CreateUserDto) {
    return this.userRepository.createUser(newUser);
  }
}
