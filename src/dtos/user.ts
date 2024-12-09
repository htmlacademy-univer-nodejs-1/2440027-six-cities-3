export interface CreateUserDTO {
    name: string;
    email: string;
    avatarUrl?: string;
    password: string;
    userType: 'regular' | 'pro';
  }
