import fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const accessTokenPrivateKey = fs.readFileSync(
      path.resolve(process.cwd(), 'certs/access-token-public.pem'),
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessTokenPrivateKey,
      alorithms: ['RS256'],
    });
  }

  public async validate(payload: any) {
    return payload;
  }
}
