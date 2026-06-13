import { Provider } from '@prisma/client';

export interface CreateUserDto {
  email: string;
  name: string;
  avatarUrl?: string;
  provider: Provider;
  providerUserId: string;
}
