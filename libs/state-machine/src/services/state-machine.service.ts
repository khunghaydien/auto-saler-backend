import { Injectable } from '@nestjs/common';
import { OpenAiService } from '@app/openai';

// Định nghĩa các state
export type StateType =
  | 'START'
  | 'QUALIFY'
  | 'INTRO_PRODUCT'
  | 'PRICE'
  | 'HANDLE_OBJECTION'
  | 'DELIVERY'
  | 'COLLECT_INFO'
  | 'CONFIRM_ORDER'
  | 'END';

// Định nghĩa context
export interface StateContext {
  scalp_type?: string | null;
  dandruff_level?: string | null;
  sensitive?: boolean | null;
  quantity?: number | null;
  address?: string | null;
  phone?: string | null;
  name?: string | null;
  email?: string | null;
  [key: string]: unknown;
}

// Định nghĩa intent
export type IntentType =
  | 'ask_price'
  | 'ask_delivery'
  | 'worry_irritation'
  | 'too_expensive'
  | 'hesitate'
  | 'order'
  | 'unknown';

// Response từ state machine
export interface StateMachineResponse {
  text: string | string[];
  nextState?: StateType;
  context: StateContext;
  state: StateType;
}

// State definition
interface StateDefinition {
  message?: string | string[] | ((ctx: StateContext) => string);
  questions?: Array<{ key: string; question: string }> | Record<string, string>;
  required?: string[];
  next?: StateType | StateType[];
  cases?: Record<string, string[]>;
}

// States configuration
const STATES: Record<StateType, StateDefinition> = {
  START: {
    message: [
      'Dạ chào anh/chị ạ 🌿',
      'Bên em có dầu gội 250ml hỗ trợ giảm gầu, không kích ứng da đầu.',
      'Mình đang gặp tình trạng gầu hay ngứa da đầu không ạ?',
    ],
    next: 'QUALIFY',
  },

  QUALIFY: {
    questions: [
      {
        key: 'scalp_type',
        question: 'Da đầu mình là da dầu hay da khô ạ?',
      },
      {
        key: 'dandruff_level',
        question: 'Mình bị gầu nhiều hay ít ạ?',
      },
      {
        key: 'sensitive',
        question: 'Trước giờ mình có từng bị kích ứng với dầu gội nào chưa ạ?',
      },
    ],
    next: 'INTRO_PRODUCT',
  },

  INTRO_PRODUCT: {
    message: [
      'Dạ dầu gội bên em là dạng dịu nhẹ, không sulfate mạnh nên không cay hay rát da đầu.',
      'Nhiều khách da đầu nhạy cảm dùng ổn và giảm gầu sau 1–2 tuần sử dụng.',
    ],
    next: 'PRICE',
  },

  PRICE: {
    message: [
      'Giá sản phẩm bên em như sau ạ:',
      '• 180k / 1 chai 250ml + ship 30k',
      '• 350k / 2 chai (freeship toàn quốc)',
      'Combo 2 chai dùng tiết kiệm và tiện hơn ạ.',
    ],
    next: ['HANDLE_OBJECTION', 'COLLECT_INFO'],
  },

  DELIVERY: {
    message: [
      'Bên em giao hàng toàn quốc trong 2–3 ngày ạ.',
      'Hàng được kiểm tra trước khi thanh toán.',
    ],
    next: 'COLLECT_INFO',
  },

  HANDLE_OBJECTION: {
    cases: {
      expensive: [
        'Dạ em hiểu ạ, dầu gội bên em dùng nguyên liệu dịu nhẹ nên chi phí cao hơn dầu gội thường.',
        'Tính ra mỗi chai dùng được khoảng 1–1,5 tháng nên khá kinh tế ạ.',
      ],
      irritation: [
        'Dạ sản phẩm không cay, không nóng da đầu.',
        'Bên em có nhiều khách da đầu nhạy cảm dùng ổn ạ.',
      ],
      hesitate: [
        'Dạ mình cứ tham khảo thêm ạ.',
        'Khi nào cần em hỗ trợ thêm thông tin thì nhắn em nhé.',
      ],
    },
    next: ['PRICE', 'END'],
  },

  COLLECT_INFO: {
    required: ['quantity', 'address', 'phone'],
    questions: {
      quantity: 'Mình muốn lấy 1 chai hay combo 2 chai ạ?',
      address: 'Anh/chị cho em xin địa chỉ nhận hàng nhé?',
      phone: 'Em xin số điện thoại để bên vận chuyển liên hệ ạ?',
    },
    next: 'CONFIRM_ORDER',
  },

  CONFIRM_ORDER: {
    message: (ctx: StateContext) =>
      `Dạ em xác nhận đơn ${ctx.quantity} chai, giao trong 2–3 ngày. Em lên đơn cho mình ngay ạ.`,
    next: 'END',
  },

  END: {
    message: [
      'Cảm ơn anh/chị đã tin tưởng sản phẩm 🌱',
      'Nếu cần hỗ trợ trong quá trình sử dụng, mình nhắn shop bất cứ lúc nào ạ.',
    ],
  },
};

// Intent mapping
const INTENT_MAP: Record<string, { state: StateType; case?: string } | StateType> = {
  ask_price: 'PRICE',
  ask_delivery: 'DELIVERY',
  worry_irritation: { state: 'HANDLE_OBJECTION', case: 'irritation' },
  too_expensive: { state: 'HANDLE_OBJECTION', case: 'expensive' },
  hesitate: { state: 'HANDLE_OBJECTION', case: 'hesitate' },
  order: 'COLLECT_INFO',
};

@Injectable()
export class StateMachineService {
  constructor(private readonly openAiService: OpenAiService) {}

  /**
   * Detect intent từ user message sử dụng AI
   */
  private async detectIntent(userMessage: string, currentState: StateType): Promise<IntentType> {
    const intentPrompt = `Bạn là một hệ thống phân loại intent cho chatbot bán hàng.

Các intent có sẵn:
- ask_price: Khách hỏi về giá, giá cả, bao nhiêu tiền
- ask_delivery: Khách hỏi về giao hàng, vận chuyển, thời gian giao
- worry_irritation: Khách lo lắng về kích ứng, dị ứng, da nhạy cảm
- too_expensive: Khách phàn nàn giá cao, đắt, không đủ tiền
- hesitate: Khách do dự, cần suy nghĩ, chưa quyết định
- order: Khách muốn đặt hàng, mua, order

Trả lời CHỈ bằng tên intent (ví dụ: ask_price), không giải thích thêm.
Nếu không khớp với intent nào, trả lời "unknown".

Tin nhắn khách: "${userMessage}"
State hiện tại: ${currentState}

Intent:`;

    const { response } = await this.openAiService.chat(intentPrompt, [userMessage], {});
    const intent = (response?.trim().toLowerCase() || 'unknown') as IntentType;

    // Validate intent
    if (intent in INTENT_MAP || intent === 'unknown') {
      return intent;
    }
    return 'unknown';
  }

  /**
   * Lấy thông tin còn thiếu trong context
   */
  private getMissingInfo(state: StateType, context: StateContext): string[] {
    const stateDef = STATES[state];
    if (!stateDef?.required) {
      return [];
    }

    return stateDef.required.filter((key) => {
      const value = context[key];
      return value === null || value === undefined || value === '';
    });
  }

  /**
   * Tạo câu hỏi cho thông tin còn thiếu
   */
  private ask(missingKey: string, state: StateType, context: StateContext): string {
    const stateDef = STATES[state];

    if (Array.isArray(stateDef.questions)) {
      const question = stateDef.questions.find((q) => q.key === missingKey);
      return question?.question || `Vui lòng cung cấp ${missingKey}`;
    }

    if (typeof stateDef.questions === 'object' && stateDef.questions[missingKey]) {
      return stateDef.questions[missingKey];
    }

    return `Vui lòng cung cấp ${missingKey}`;
  }

  /**
   * Chuyển sang state mới
   */
  private transition(
    targetState: StateType,
    context: StateContext,
    caseKey?: string,
  ): StateMachineResponse {
    const stateDef = STATES[targetState];
    let message: string | string[] = '';

    // Xử lý message
    if (stateDef.message) {
      if (typeof stateDef.message === 'function') {
        message = stateDef.message(context);
      } else {
        message = stateDef.message;
      }
    }

    // Xử lý cases (cho HANDLE_OBJECTION)
    if (caseKey && stateDef.cases && stateDef.cases[caseKey]) {
      message = stateDef.cases[caseKey];
    }

    return {
      text: message,
      context,
      state: targetState,
      nextState: Array.isArray(stateDef.next) ? stateDef.next[0] : stateDef.next,
    };
  }

  /**
   * Fallback khi không hiểu intent
   */
  private async fallback(
    currentState: StateType,
    userMessage: string,
    context: StateContext,
  ): Promise<StateMachineResponse> {
    const fallbackPrompt = `Bạn là nhân viên bán hàng thân thiện. Khách hàng nói: "${userMessage}"

State hiện tại: ${currentState}
Context: ${JSON.stringify(context)}

Hãy trả lời một cách tự nhiên, thân thiện, ngắn gọn (tối đa 60 từ). Nếu không hiểu, hãy hỏi lại hoặc đề xuất hướng tiếp theo.`;

    const { response } = await this.openAiService.chat(fallbackPrompt, [userMessage], context);
    return {
      text: response || 'Xin lỗi, em chưa hiểu rõ. Anh/chị có thể nói rõ hơn được không ạ?',
      context,
      state: currentState,
    };
  }

  /**
   * Xử lý message chính - entry point của state machine
   */
  async handleMessage(
    userMessage: string,
    currentState: StateType,
    context: StateContext = {},
  ): Promise<StateMachineResponse> {
    // Cập nhật context từ user message trước khi xử lý
    const updatedContext = await this.updateContextFromMessage(userMessage, context);

    // 1. Nếu có intent rõ ràng → nhảy state
    const intent = await this.detectIntent(userMessage, currentState);

    if (intent && intent !== 'unknown' && INTENT_MAP[intent]) {
      const intentMapping = INTENT_MAP[intent];

      if (typeof intentMapping === 'string') {
        return this.transition(intentMapping, updatedContext);
      } else {
        return this.transition(intentMapping.state, updatedContext, intentMapping.case);
      }
    }

    // 2. Nếu state cần info mà thiếu → hỏi tiếp
    const missing = this.getMissingInfo(currentState, updatedContext);
    if (missing.length > 0) {
      const question = this.ask(missing[0], currentState, updatedContext);
      return {
        text: question,
        context: updatedContext,
        state: currentState,
      };
    }

    // 3. Nếu không hiểu → fallback thông minh
    return this.fallback(currentState, userMessage, updatedContext);
  }

  /**
   * Cập nhật context từ user message (extract info)
   */
  async updateContextFromMessage(
    userMessage: string,
    currentContext: StateContext = {},
  ): Promise<StateContext> {
    // Sử dụng OpenAI service để extract thông tin
    // Merge context hiện tại với context mới được extract
    const { state } = await this.openAiService.chat('', [userMessage], currentContext);
    const extractedContext = state as StateContext;

    // Merge: giữ lại giá trị cũ nếu có, cập nhật giá trị mới nếu được extract
    const mergedContext: StateContext = { ...currentContext };

    // Chỉ cập nhật các field mới nếu chúng có giá trị (không null/undefined/empty)
    Object.keys(extractedContext).forEach((key) => {
      const value = extractedContext[key];
      if (value !== null && value !== undefined && value !== '') {
        mergedContext[key] = value;
      }
    });

    return mergedContext;
  }
}
