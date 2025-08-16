import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './car/entities/car.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://postgres:2508@localhost:5432/car',
      entities: [CarEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CarModule,
  ],
})
export class AppModule { }
