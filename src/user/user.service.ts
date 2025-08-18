import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.repository.create(createUserDto);
    return this.repository.save(user);
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.repository.update(id, updateUserDto);

    return this.repository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.repository.delete(id);

    return {
      message: 'User successfully deleted',
    };
  }
}
