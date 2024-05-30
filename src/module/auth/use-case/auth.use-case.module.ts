import { Module } from '@nestjs/common';
import { EnvModule } from 'src/infra/config/env.module';
import { UserRepositoryModule } from 'src/module/user/repository/user.repository.module';
import { authUseCaseProvider } from './auth.use-case.provider';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from 'src/infra/config/env.service';
import { JwtStrategy } from 'src/infra/auth/jwt.strategy';

@Module({
  imports: [
    EnvModule,
    UserRepositoryModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      useFactory: (envService: EnvService) => ({
        secret: envService.variables.jwtSecretKey,
        signOptions: { expiresIn: 6000 },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [...authUseCaseProvider, JwtStrategy],
  exports: [...authUseCaseProvider],
})
export class AuthUseCaseModule {}
