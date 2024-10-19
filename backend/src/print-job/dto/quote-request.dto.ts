import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class QuoteRequestDto {
  @ApiProperty({ required: true })
  @IsNumber()
  bwPages: number;

  @ApiProperty({ required: true })
  @IsNumber()
  colorPages: number;

  @ApiProperty({ required: true })
  @IsNumber()
  totalPixels: number;


  @ApiProperty({ required: true })
  @IsString()
  id: string;
}
