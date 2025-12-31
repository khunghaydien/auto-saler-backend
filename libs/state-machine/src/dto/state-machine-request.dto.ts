import { IsString, IsObject, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StateType, StateContext } from '../services/state-machine.service';

export class StateMachineRequestDto {
  @ApiProperty({
    example: 'Giá bao nhiêu vậy?',
    description: 'User message to process',
  })
  @IsString()
  userMessage: string;

  @ApiProperty({
    example: 'START',
    enum: [
      'START',
      'QUALIFY',
      'INTRO_PRODUCT',
      'PRICE',
      'HANDLE_OBJECTION',
      'DELIVERY',
      'COLLECT_INFO',
      'CONFIRM_ORDER',
      'END',
    ],
    description: 'Current state of the conversation',
  })
  @IsEnum([
    'START',
    'QUALIFY',
    'INTRO_PRODUCT',
    'PRICE',
    'HANDLE_OBJECTION',
    'DELIVERY',
    'COLLECT_INFO',
    'CONFIRM_ORDER',
    'END',
  ])
  currentState: StateType;

  @ApiProperty({
    example: {
      scalp_type: null,
      dandruff_level: null,
      sensitive: null,
      quantity: null,
      address: null,
      phone: null,
    },
    description: 'Current conversation context',
    required: false,
  })
  @IsOptional()
  @IsObject()
  context?: StateContext;
}
