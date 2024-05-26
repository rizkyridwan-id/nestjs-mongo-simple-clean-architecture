import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Encryptor } from '../service/encryptor.service';

@Injectable()
export class DecryptBodyInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.body && req.headers.enc != 0) {
      req.body = Encryptor.doDecrypt(req.body, []);
    }

    return next.handle();
  }
}
