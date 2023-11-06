import { Injectable } from '@nestjs/common';
import { createUserDTO } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDTO: createUserDTO): Promise<UserEntity> {
    const crypt = 10;
    const passwordHashed = await hash(createUserDTO.password, crypt);

    return this.userRepository.save({
      ...createUserDTO,
      typeUser: 1,
      password: passwordHashed,
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
