import { Module } from '@nestjs/common';
import { KioskService } from './kiosk.service';
import { KioskController } from './kiosk.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [KioskController],
  providers: [KioskService, PrismaService],
})
export class KioskModule {}
