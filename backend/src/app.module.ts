import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrintJobModule } from './print-job/print-job.module';

@Module({
  imports: [PrintJobModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
