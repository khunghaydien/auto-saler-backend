import { ApiProperty } from '@nestjs/swagger';
import { StateType, StateContext } from '../services/state-machine.service';

export class StateMachineResponseDto {
  @ApiProperty({
    example: ['Dạ chào anh/chị ạ 🌿', 'Bên em có dầu gội 250ml...'],
    description: 'Response message(s) to send to user',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  text: string | string[];

  @ApiProperty({
    example: 'QUALIFY',
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
    description: 'Current state after processing',
  })
  state: StateType;

  @ApiProperty({
    example: 'INTRO_PRODUCT',
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
    description: 'Next suggested state (optional)',
    required: false,
  })
  nextState?: StateType;

  @ApiProperty({
    example: {
      scalp_type: 'oily',
      dandruff_level: 'medium',
      sensitive: true,
      quantity: null,
      address: null,
      phone: null,
    },
    description: 'Updated conversation context',
  })
  context: StateContext;
}
