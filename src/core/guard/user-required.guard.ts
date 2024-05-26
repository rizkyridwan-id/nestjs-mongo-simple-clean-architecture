import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserRequiredGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;
    if (!authorization) throw new UnauthorizedException();

    const [type, token] = authorization.split(' ');
    let tokenParsed: { sub: string };
    try {
      const tokenUtf = Buffer.from(token, 'base64').toString('utf-8');
      tokenParsed = JSON.parse(tokenUtf);
    } catch (e) {
      throw new UnauthorizedException('Invalid Token.');
    }

    request['user'] =
      type.toLowerCase() === 'bearer' ? { user_id: tokenParsed.sub } : null;

    return true;
  }
}
