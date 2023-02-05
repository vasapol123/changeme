import fs from 'fs';
import path from 'path';
import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import PrismaService from '../prisma/prisma.service';

@Injectable()
export default class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public async generateAuthTokens(
    userId: number,
    email: string,
    displayName: string,
  ) {
    const jwtPayload = {
      sub: userId,
      displayName,
      email,
    };

    const accessTokenPrivateKey = fs.readFileSync(
      path.resolve(process.cwd(), 'certs/access-token-private.pem'),
    );
    const refreshTokenPrivateKey = fs.readFileSync(
      path.resolve(process.cwd(), 'certs/refresh-token-private.pem'),
    );

    const [jwtAccessToken, jwtRefreshToken] = await Promise.all([
      // sign access token
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '15m',
        algorithm: 'RS256',
        privateKey: accessTokenPrivateKey,
      }),

      // sign refresh token
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '7d',
        algorithm: 'RS256',
        privateKey: refreshTokenPrivateKey,
      }),
    ]);

    return { jwtAccessToken, jwtRefreshToken };
  }

  public async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }
}
