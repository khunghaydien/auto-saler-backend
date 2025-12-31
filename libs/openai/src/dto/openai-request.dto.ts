import { IsArray, IsString, IsObject, ArrayMinSize, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OpenAiRequestDto {
  @ApiProperty({
    example: ['Hello', 'I want to buy something'],
    description: 'Array of user messages that have not been responded to',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  messages: string[];

  @ApiProperty({
    example: { address: false, phone: '0961134327' },
    description: 'Previous chat state',
    required: false,
  })
  @IsOptional()
  @IsObject()
  state?: Record<string, unknown>;
}
