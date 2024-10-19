import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePriceDto {
  @ApiProperty({ required: true })
  @IsNumber()
  bwPageCost: number;

  @ApiProperty({ required: true })
  @IsNumber()
  colorPageCost: number;

  @ApiProperty({ required: true })
  @IsNumber()
  pixelCost: number;
}
