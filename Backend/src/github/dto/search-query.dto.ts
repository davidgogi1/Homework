import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({
    description: 'Free-text search (supports GitHub qualifiers)',
    example: 'nestjs language:TypeScript stars:>500',
  })
  @IsString()
  @IsNotEmpty()
  query!: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Sort by repo name',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Ignore repos whose name contains this substring',
  })
  @IsOptional()
  @IsString()
  ignore?: string;
}
