import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './car/entities/car.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:ebQuajuIFzjEytMJiCQCWAGQAdzOFbVR@postgres.railway.internal:5432/railway',
      entities: [CarEntity, UserEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 120
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'abdulfattoh.dev@gmail.com',
          pass: 'jrmkojehulnnifky',
        },
      },
    }),
    JwtModule.register({ global: true }),
    CarModule,
    UserModule,
  ],
})
export class AppModule { }
