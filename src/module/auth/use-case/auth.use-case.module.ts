import { Module } from '@nestjs/common';
import { EnvModule } from 'src/infra/config/env.module';
import { UserRepositoryModule } from 'src/module/user/repository/user.repository.module';
import { authUseCaseProvider } from './auth.use-case.provider';

@Module({
  imports: [EnvModule, UserRepositoryModule],
  providers: [...authUseCaseProvider],
  exports: [...authUseCaseProvider],
})
export class AuthUseCaseModule {}
