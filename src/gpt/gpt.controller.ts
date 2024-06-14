import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { GptService } from './gpt.service';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthograpyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthograpyCheck(@Body() orthograpyDto: OrthograpyDto) {
    return this.gptService.orthograpyCheck(orthograpyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);
    // se utiliza el for await porque son varias emisiones
    // cuando trabajamos con las promesas se utiliza await
    for await (const chunck of stream) {
      const piece = chunck.choices[0].delta.content || '';
      // console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translateText(@Body() translateDto: TranslateDto) {
    return this.gptService.translateText(translateDto);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(@Res() res: Response, @Param() fileId: string) {
    console.log(fileId);
    const filePath = await this.gptService.textToAudioGetter(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }
  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: function (req, file, callback) {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message: 'File is bigger than 5 mb',
          }),
          new FileTypeValidator({
            fileType: 'audio/*',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:filename')
  async getGeneratedImage(@Res() res: Response, @Param() filename: string) {
    const filePath = await this.gptService.getGeneratedImage(filename);
    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.gptService.generateImageVariation(imageVariationDto);
  }
}
