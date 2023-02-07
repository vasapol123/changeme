import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import PrismaService from '../prisma/prisma.service';

@Injectable()
export default class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async createUser(
    createUserInput: Prisma.UserCreateInput,
  ): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserInput,
        },
      });

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email',
          );
        }
      }
      throw e;
    }
  }

  public async findOneUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where });

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2001') {
          throw new ForbiddenException('Email does not exist');
        }
      }
    }
  }
}
