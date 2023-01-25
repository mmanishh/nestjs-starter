import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { CustomConfigService } from 'common/config/custom-config.service';
// import { Transactional } from 'typeorm-transactional';
import { CreateUserDto } from './create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: CustomConfigService,
    private readonly userRepository: UsersRepository,
  ) {}

  async findById(id: string) {
    const foundUser = await this.userRepository.getById(id);
    if (!foundUser) {
      throw new NotFoundException('User is not found');
    }

    return foundUser;
  }

  async findAll(type: string) {
    try {
      const response = await axios(
        `${this.configService.USER_SERVICE_URL}/users?type=${type}`,
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status) {
        throw new HttpException(
          error?.response?.data || 'Getting users failed',
          error.response.status,
        );
      }

      throw new InternalServerErrorException();
    }
  }

  // @Transactional()
  async createUser(newUser: CreateUserDto) {
    return this.userRepository.createUser(newUser);
  }
}
