import { Provider } from '@nestjs/common';
import { LoginUser } from './login.use-case';

export const authUseCaseProvider: Provider[] = [LoginUser];
