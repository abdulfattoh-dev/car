import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './car/entities/car.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:ebQuajuIFzjEytMJiCQCWAGQAdzOFbVR@postgres.railway.internal:5432/railway',
      entities: [CarEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CarModule,
  ],
})
export class AppModule { }
