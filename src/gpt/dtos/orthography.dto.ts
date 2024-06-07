import { IsInt, IsOptional, IsString } from 'class-validator';

export class OrthograpyDto {
  @IsString()
  readonly prompt: string;

  @IsInt()
  @IsOptional()
  readonly maxToken?: number;
}
