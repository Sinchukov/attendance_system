import { IsNotEmpty, IsString } from 'class-validator';

export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  cardNo!: string;

  @IsString()
  @IsNotEmpty()
  deviceSerialNumber!: string;
}
