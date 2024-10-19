import { PartialType } from '@nestjs/swagger';
import { CreatePrintJobDto } from './create-print-job.dto';

export class UpdatePrintJobDto extends PartialType(CreatePrintJobDto) {}
