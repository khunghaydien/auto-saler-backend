import { ApiProperty } from '@nestjs/swagger';

export class OpenAiResponseDto {
  @ApiProperty({
    example: 'Hello! I am doing well, thank you for asking. How can I help you today?',
    description: 'OpenAI response message',
  })
  response: string;

  @ApiProperty({
    example: { address: false, phone: '0961134327', name: 'John' },
    description: 'Updated chat state after extracting information from messages',
  })
  state: Record<string, unknown>;
}
