import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Module({
  providers: [
    AuthService,
    SupabaseAuthGuard,
    {
      provide: APP_GUARD,
      useExisting: SupabaseAuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, SupabaseAuthGuard],
})
export class AuthModule {}
