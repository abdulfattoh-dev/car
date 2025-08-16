import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarEntity } from './entities/car.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly repository: Repository<CarEntity>,
  ) {}

  create(createCarDto: CreateCarDto) {
    const car = this.repository.create(createCarDto);
    return this.repository.save(car);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    const car = await this.repository.findOne({ where: { id } });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    const car = await this.repository.findOne({ where: { id } });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    await this.repository.update(id, updateCarDto);

    return this.repository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const car = await this.repository.findOne({ where: { id } });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    await this.repository.delete(id);

    return {
      message: 'Car successfully deleted',
    };
  }
}
