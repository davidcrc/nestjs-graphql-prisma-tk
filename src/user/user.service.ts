import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async updateProfile(
    userUUID: string,
    data: { fullname?: string; bio?: string; image?: string },
  ) {
    return this.prisma.user.update({
      where: { uuid: userUUID },
      data: {
        fullname: data.fullname,
        bio: data.bio,
        image: data.image,
      },
    });
  }
}
