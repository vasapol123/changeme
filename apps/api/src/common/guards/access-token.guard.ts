import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class GqlAccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    _context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const context = GqlExecutionContext.create(_context);

    const isPublic = this.reflector.getAllAndOverride<boolean>('IS_PUBLIC', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const { req } = context.getContext();
    return super.canActivate(new ExecutionContextHost([req]));
  }
}
