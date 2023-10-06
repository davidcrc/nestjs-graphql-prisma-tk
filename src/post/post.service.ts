import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createWriteStream } from 'fs';
import { extname } from 'path';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '@prisma/client';
import { PostDetails } from './dto/post-details-type.dto';
import { PostType } from './dto/post-type.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async saveVideo(video: {
    createReadStream: () => any;
    filename: string;
    mimetype: string;
  }): Promise<string> {
    if (!video || !['video/mp4'].includes(video.mimetype)) {
      throw new BadRequestException(
        'Invalid video file format. Only MP4 is allowed.',
      );
    }

    const videoName = `${Date.now()}${extname(video.filename)}`;
    const videoPath = `/files/${videoName}`;

    const stream = video.createReadStream();
    const outputPath = `public${videoPath}`;
    const writeStream = createWriteStream(outputPath);
    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    return videoPath;
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    return await this.prisma.post.create({
      data: {
        user: {
          connect: {
            uuid: data.userUUID,
          },
        },
        text: data.text,
        video: data.video,
      },
    });
  }

  async getPostById(id: number): Promise<PostDetails> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: { user: true, likes: true, comments: true },
      });

      const postIds = await this.prisma.post.findMany({
        where: { userId: post.userId },
        select: { id: true },
      });

      return { ...post, otherPostIds: postIds.map((post) => post.id) };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getPosts(skip: number, take: number): Promise<PostType[]> {
    return await this.prisma.post.findMany({
      skip,
      take,
      include: { user: true, likes: true, comments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPostsByUserId(userUUID: string): Promise<PostType[]> {
    return await this.prisma.post.findMany({
      where: { user: { uuid: userUUID } },
      include: { user: true },
    });
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.getPostById(id);

    if (post.video) {
      // Delete the video file from /files/ directory
      try {
        const fs = await import('fs');
        fs.unlinkSync(`public/${post.video}`);
      } catch (err) {
        console.error(`Failed to delete video file: ${post.video}`, err);
      }
    }

    await this.prisma.post.delete({ where: { id } });
  }
}
