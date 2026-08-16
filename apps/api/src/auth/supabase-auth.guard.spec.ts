import type { ExecutionContext } from '@nestjs/common';

import type { AuthenticatedUser } from './auth.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

describe('SupabaseAuthGuard', () => {
  const authService = {
    verifyAccessToken: jest.fn(),
  };

  let guard: SupabaseAuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new SupabaseAuthGuard(authService as never);
  });

  function createContext(authorization?: string) {
    const request: {
      headers: {
        authorization?: string;
      };
      user?: AuthenticatedUser;
    } = {
      headers: {},
    };

    if (authorization) {
      request.headers.authorization = authorization;
    }

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    return {
      context,
      request,
    };
  }

  it('rejects a request without an authorization header', async () => {
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Bearer token is required',
    );

    expect(authService.verifyAccessToken).not.toHaveBeenCalled();
  });

  it('rejects a malformed bearer header', async () => {
    const { context } = createContext('Bearer token extra-value');

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Bearer token is required',
    );

    expect(authService.verifyAccessToken).not.toHaveBeenCalled();
  });

  it('rejects a token that fails verification', async () => {
    const { context } = createContext('Bearer invalid-token');

    authService.verifyAccessToken.mockRejectedValue(
      new Error('signature verification failed'),
    );

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Invalid or expired access token',
    );
  });

  it('attaches verified claims to the request', async () => {
    const { context, request } = createContext('Bearer valid-token');

    const authenticatedUser = {
      sub: 'supabase-user-id',
      role: 'authenticated',
    };

    authService.verifyAccessToken.mockResolvedValue(authenticatedUser);

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(authService.verifyAccessToken).toHaveBeenCalledWith('valid-token');
    expect(request.user).toEqual(authenticatedUser);
  });
});
