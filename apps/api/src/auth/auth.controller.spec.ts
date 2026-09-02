import type { Server } from 'node:http';

import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

describe('AuthController', () => {
  const authService = {
    verifyAccessToken: jest.fn(),
  };

  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AppController, AuthController],
      providers: [
        AppService,
        SupabaseAuthGuard,
        {
          provide: APP_GUARD,
          useExisting: SupabaseAuthGuard,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Server;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows access to a public route without a token', async () => {
    await request(server).get('/').expect(200).expect('Hello World!');

    expect(authService.verifyAccessToken).not.toHaveBeenCalled();
  });

  it('returns the authenticated user', async () => {
    authService.verifyAccessToken.mockResolvedValue({
      sub: 'supabase-user-id',
      email: 'sean@example.com',
      role: 'authenticated',
    });

    await request(server)
      .get('/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect({
        id: 'supabase-user-id',
        email: 'sean@example.com',
        role: 'authenticated',
      });

    expect(authService.verifyAccessToken).toHaveBeenCalledWith('valid-token');
  });

  it('returns only the required identity fields', async () => {
    authService.verifyAccessToken.mockResolvedValue({
      sub: 'supabase-user-id',
    });

    await request(server)
      .get('/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect({
        id: 'supabase-user-id',
      });
  });

  it('rejects a request without a bearer token', async () => {
    await request(server).get('/auth/me').expect(401).expect({
      message: 'Bearer token is required',
      error: 'Unauthorized',
      statusCode: 401,
    });

    expect(authService.verifyAccessToken).not.toHaveBeenCalled();
  });

  it('rejects a malformed bearer token', async () => {
    await request(server)
      .get('/auth/me')
      .set('Authorization', 'Bearer token extra-value')
      .expect(401);

    expect(authService.verifyAccessToken).not.toHaveBeenCalled();
  });

  it('rejects a token that fails verification', async () => {
    authService.verifyAccessToken.mockRejectedValue(
      new Error('signature verification failed'),
    );

    await request(server)
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401)
      .expect({
        message: 'Invalid or expired access token',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });
});
