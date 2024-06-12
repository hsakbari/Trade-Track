import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStockDto {
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }) => parseFloat(value))
  price: number;
}
