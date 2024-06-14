import { IsString, IsOptional } from 'class-validator';

export class ImageGenerationDto {
  @IsString()
  readonly prompt: string;

  @IsString()
  @IsOptional()
  readonly originalImage: string;

  @IsString()
  @IsOptional()
  readonly maskImage?: string;
}

/*
if (!navigator.gpu) {
    throw Error('WebGPU is not supported');
}
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
    throw Error('Couldn request WebGPU adapter'); //
}
const device = await adapter.requestDevice();
*/
