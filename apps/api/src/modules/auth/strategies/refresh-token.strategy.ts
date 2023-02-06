import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    const accessTokenPrivateKey = fs.readFileSync(
      path.resolve(process.cwd(), 'certs/refresh-token-public.pem'),
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessTokenPrivateKey,
      alorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  public async validate(req: Request, payload: any) {
    const refreshToken = req
      ?.get('Authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token malformed');
    }

    return { ...payload, refreshToken };
  }
}
