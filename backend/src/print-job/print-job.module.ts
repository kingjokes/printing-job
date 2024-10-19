import { Module } from '@nestjs/common';
import { PrintJobService } from './print-job.service';
import { PrintJobController } from './print-job.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [PrintJobController],
  providers: [
    PrintJobService,
    PrismaService,
    CloudinaryProvider,
    CloudinaryService,
  ],
})
export class PrintJobModule {}
