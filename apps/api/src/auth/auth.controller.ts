import { Controller, Get } from '@nestjs/common';

import type { AuthenticatedUser } from './auth.service';
import { CurrentUser } from './current-user.decorator';

export type AuthenticatedUserResponse = {
  id: string;
  email?: string;
  role?: string;
};

@Controller('auth')
export class AuthController {
  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUserResponse {
    return {
      id: user.sub,
      ...(typeof user.email === 'string' ? { email: user.email } : {}),
      ...(typeof user.role === 'string' ? { role: user.role } : {}),
    };
  }
}
