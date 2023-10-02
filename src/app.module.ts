import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [],
  controllers: [PrismaModule],
  providers: [AppService],
})
export class AppModule {}
