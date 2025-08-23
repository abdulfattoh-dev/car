import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import otpGenerator from 'otp-generator';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const { email } = createUserDto
    const exist_email = await this.repository.findOne({ where: { email } })

    if (exist_email) {
      throw new ConflictException('Email already exist')
    }

    const user = this.repository.create(createUserDto);
    await this.repository.save(user)

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    await this.cacheManager.set(email, otp);

    await this.mailerService.sendMail({
      to: email,
      text: `${otp}`,
    });

    return {
      message: 'A verification code has been sent to your email.'
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    const user = await this.repository.findOne({ where: { email } })

    if (!user) {
      throw new NotFoundException('Email not found')
    }

    const cachedOtp = await this.cacheManager.get(email);

    if (!cachedOtp) {
      throw new BadRequestException('OTP expired or not found');
    }

    if (cachedOtp != otp) {
      throw new BadRequestException('Invalid OTP');
    }

    user.is_active = true;
    await this.repository.save(user);

    await this.cacheManager.del(email);

    return {
      message: 'OTP verified successfully'
    };
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    const { email, password } = loginUserDto
    const user = await this.repository.findOne({ where: { email } })

    if (!user) {
      throw new NotFoundException('Email not found')
    }

    if (password != user.password) {
      throw new BadRequestException('Invalid password')
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Confirm your email');
    }

    const payload = { id: user.id, is_active: user.is_active };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: 'ACCESS_SECRET',
      expiresIn: '2m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'REFRESH_SECRET',
      expiresIn: '30d',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return accessToken
  }

  findAll() {
    return this.repository.find({ order: { createdAt: 'ASC' } });
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

    if (updateUserDto?.email) {
      const exist_email = await this.repository.findOne({ where: { email: updateUserDto.email } })

      if (exist_email) {
        throw new ConflictException('Email already exist')
      }
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
