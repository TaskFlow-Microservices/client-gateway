import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AUTH_SERVICE } from 'src/config';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('register')
  async signUp(@Body() args: RegisterDto, @Res() response: Response) {
    try {
      const result = await lastValueFrom(this.authClient.send('sign-up', args));

      console.log('result', result);

      if (result.token) {
        response.cookie('Authentication', result.token, {
          httpOnly: true,
          secure: true,
          maxAge: 3600000, // 1 hour
        });

        return response
          .status(HttpStatus.OK)
          .json({ status: 'ok', user: result.user });
      } else {
        throw new RpcException('Registration failed. Please try again');
      }
    } catch (error) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'An error occurred ', error: error.message });
    }
  }

  @Post('login')
  async login(@Body() args: LoginDto, @Res() response: Response) {
    try {
      const result = await lastValueFrom(this.authClient.send('login', args));

      console.log('result', result);

      if (result.token) {
        response.cookie('Authentication', result.token, {
          httpOnly: true,
          secure: true,
          maxAge: 3600000, // 1 hour
        });

        return response
          .status(HttpStatus.OK)
          .json({ status: 'ok', user: result.user });
      } else {
        throw new RpcException('Login failed. Please try again');
      }
    } catch (error) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'An error occurred', error: error.message });
    }
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    return response
      .status(HttpStatus.OK)
      .clearCookie('Authentication', {
        httpOnly: true,
        secure: true,
      })
      .json({ status: 'ok' });
  }
}
