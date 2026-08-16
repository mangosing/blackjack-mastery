import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

type FindOrCreateUserInput = {
  supabaseUserId: string;
  displayName?: string;
  avatarUrl?: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(input: FindOrCreateUserInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        supabaseUserId: input.supabaseUserId,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    return this.prisma.user.create({
      data: {
        supabaseUserId: input.supabaseUserId,
        displayName: input.displayName,
        avatarUrl: input.avatarUrl,
      },
    });
  }
}
