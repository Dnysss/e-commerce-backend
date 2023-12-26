import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createUserDTO } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './enum/user-type.enum';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { createPasswordHashed, vaildatePassword } from '../utils/password';

@Injectable()
export class UserService {
  // Injeção de dependência do repositório do TypeORM
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  
  // Método para criar um novo usuário
  async createUser(
    createUserDTO: createUserDTO,
    userType?: number,
  ): Promise<UserEntity> {
    const user = await this.findUserByEmail(createUserDTO.email).catch(
      () => undefined,
    );

    if (user) {
      throw new BadGatewayException(
        'Este email já está cadastrado no sistema. Tente cadastrar outro email.',
      );
    }
    // Criar hash da senha e salvar o novo usuário no banco de dados
    const passwordHashed = await createPasswordHashed(createUserDTO.password);

    return this.userRepository.save({
      ...createUserDTO,
      typeUser: userType ? userType : UserType.User,
      password: passwordHashed,
    });
  }
  // Método para obter um usuário com informações detalhadas usando relações
  async getUserByUsingRelations(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        address: {
          city: {
            state: true,
          },
        },
      },
    });
  }
// Método para obter todos os usuários
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`UserId: ${userId} not found.`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException(`Email: ${email} Not Found`);
    }

    return user;
  }
// Método para atualizar a senha do usuário
  async updatePasswordUser(
    updatePasswordDTO: UpdatePasswordDTO,
    userId: number,
  ): Promise<UserEntity> {
    // Encontrar o usuário pelo ID
    const user = await this.findUserById(userId);
// Criar hash da nova senha
    const passwordHashed = await createPasswordHashed(
      updatePasswordDTO.newPassword,
    );
// Validar a senha antiga
    const isMatch = await vaildatePassword(
      updatePasswordDTO.lastPassword,
      user.password || '',
    );
// Se a senha antiga não for válida, lançar uma exceção
    if (!isMatch) {
      throw new BadRequestException('Senha inválida');
    }
// Atualizar a senha do usuário no banco de dados
    return this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
  }
}
