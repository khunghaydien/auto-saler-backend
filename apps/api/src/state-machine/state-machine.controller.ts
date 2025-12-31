import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { StateMachineService } from '@app/state-machine';
import { StateMachineRequestDto, StateMachineResponseDto } from '@app/state-machine/dto';
import { Public } from '@app/common';

@ApiTags('state-machine')
@Controller('state-machine')
export class StateMachineController {
  constructor(private readonly stateMachineService: StateMachineService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process message with state machine using AI intent detection' })
  @ApiResponse({
    status: 200,
    description: 'State machine response',
    type: StateMachineResponseDto,
  })
  async handleStateMachine(
    @Body() stateMachineRequestDto: StateMachineRequestDto,
  ): Promise<StateMachineResponseDto> {
    // Xử lý message qua state machine (context sẽ được cập nhật tự động trong handleMessage)
    const result = await this.stateMachineService.handleMessage(
      stateMachineRequestDto.userMessage,
      stateMachineRequestDto.currentState,
      stateMachineRequestDto.context || {},
    );

    return {
      text: result.text,
      state: result.state,
      nextState: result.nextState,
      context: result.context,
    };
  }
}
