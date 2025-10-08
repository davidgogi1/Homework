import { ApiProperty } from '@nestjs/swagger';

export class RepoDto {
  @ApiProperty() id!: number;
  @ApiProperty() name!: string;
  @ApiProperty() full_name!: string;
  @ApiProperty() html_url!: string;
  @ApiProperty({ nullable: true }) description!: string | null;
  @ApiProperty() stargazers_count!: number;
  @ApiProperty({ nullable: true }) language!: string | null;
}
