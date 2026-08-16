import { UsersService } from './users.service';

describe('UsersService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(prisma as never);
  });

  it('returns an existing user when one exists', async () => {
    const existingUser = {
      id: 'user-id',
      supabaseUserId: 'supabase-user-id',
      displayName: 'Sean',
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValue(existingUser);

    await expect(
      service.findOrCreateUser({
        supabaseUserId: 'supabase-user-id',
      }),
    ).resolves.toEqual(existingUser);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('creates a user when one does not exist', async () => {
    const createdUser = {
      id: 'user-id',
      supabaseUserId: 'supabase-user-id',
      displayName: 'Sean',
      avatarUrl: 'https://example.com/avatar.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(createdUser);

    await expect(
      service.findOrCreateUser({
        supabaseUserId: 'supabase-user-id',
        displayName: 'Sean',
        avatarUrl: 'https://example.com/avatar.png',
      }),
    ).resolves.toEqual(createdUser);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        supabaseUserId: 'supabase-user-id',
        displayName: 'Sean',
        avatarUrl: 'https://example.com/avatar.png',
      },
    });
  });
});
