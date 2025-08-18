import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './car/entities/car.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:ebQuajuIFzjEytMJiCQCWAGQAdzOFbVR@postgres.railway.internal:5432/railway',
      entities: [CarEntity, UserEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CarModule,
    UserModule,
  ],
})
export class AppModule {}
