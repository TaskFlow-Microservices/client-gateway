import { catchError } from 'rxjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UpdateUserDto } from '../dto/update-user.dto';
import { USER_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersClient.send('find_all', paginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersClient
      .send('update_user', { uuid, ...updateUserDto })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Delete(':uuid')
  delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersClient.send('delete_user', uuid).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
