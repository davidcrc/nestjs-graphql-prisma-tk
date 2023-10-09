import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LikeCreateInput } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  private async getUser(uuid) {
    return await this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });
  }

  async likePost(data: LikeCreateInput) {
    const user = await this.getUser(data.userUUID);

    return this.prisma.like.create({
      data: {
        postId: data.postId,
        userId: user.id,
      },
    });
  }

  async unlikePost(postId: number, userUUID: string) {
    const user = await this.getUser(userUUID);

    return this.prisma.like.delete({
      where: { userId_postId: { postId, userId: user.id } },
    });
  }
}
