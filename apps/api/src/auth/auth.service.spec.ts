import { createRemoteJWKSet, jwtVerify } from 'jose';

import { AuthService } from './auth.service';

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

describe('AuthService', () => {
  const mockedCreateRemoteJWKSet = jest.mocked(createRemoteJWKSet);
  const mockedJwtVerify = jest.mocked(jwtVerify);
  const jwks = jest.fn();

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedCreateRemoteJWKSet.mockReturnValue(jwks as never);

    const configService = {
      getOrThrow: jest.fn().mockReturnValue('https://project-ref.supabase.co'),
    };

    service = new AuthService(configService as never);
  });

  it('verifies and returns an authenticated JWT payload', async () => {
    mockedJwtVerify.mockResolvedValue({
      payload: {
        sub: 'supabase-user-id',
        email: 'sean@example.com',
        role: 'authenticated',
      },
      protectedHeader: {
        alg: 'ES256',
      },
    });

    await expect(service.verifyAccessToken('valid-token')).resolves.toEqual({
      sub: 'supabase-user-id',
      email: 'sean@example.com',
      role: 'authenticated',
    });

    expect(mockedJwtVerify).toHaveBeenCalledWith('valid-token', jwks, {
      issuer: 'https://project-ref.supabase.co/auth/v1',
      audience: 'authenticated',
    });
  });

  it('rejects a payload without a subject', async () => {
    mockedJwtVerify.mockResolvedValue({
      payload: {
        role: 'authenticated',
      },
      protectedHeader: {
        alg: 'ES256',
      },
    });

    await expect(service.verifyAccessToken('invalid-token')).rejects.toThrow(
      'JWT subject claim is missing',
    );
  });

  it('propagates token verification failures', async () => {
    mockedJwtVerify.mockRejectedValue(
      new Error('signature verification failed'),
    );

    await expect(service.verifyAccessToken('invalid-token')).rejects.toThrow(
      'signature verification failed',
    );
  });
});
