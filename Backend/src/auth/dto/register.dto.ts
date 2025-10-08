import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty() @IsString() @MinLength(3) username!: string;
  @ApiProperty() @IsString() @MinLength(6) password!: string;
}
