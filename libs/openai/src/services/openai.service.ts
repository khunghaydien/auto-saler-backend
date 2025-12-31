import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@app/common';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.openaiApiKey,
    });
  }

  /**
   * Chat với OpenAI và extract context từ messages
   */
  async chat(
    systemPrompt: string,
    messages: string[],
    currentContext: Record<string, unknown> = {},
  ): Promise<{ response: string | null; state: Record<string, unknown> }> {
    const formattedMessages: any[] = [];

    // Chỉ thêm system prompt nếu có
    if (systemPrompt) {
      formattedMessages.push({ role: 'system', content: systemPrompt });
    }

    // Thêm user messages
    messages.forEach((message) => {
      formattedMessages.push({ role: 'user', content: message });
    });

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
      });

      const response = completion.choices[0]?.message?.content || null;

      // Extract context từ messages bằng AI nếu có system prompt rỗng (dùng cho context extraction)
      let extractedContext = currentContext;
      if (!systemPrompt && messages.length > 0) {
        extractedContext = await this.extractContext(messages[0], currentContext);
      }

      return {
        response,
        state: extractedContext,
      };
    } catch (error: any) {
      if (error?.status === 429) {
        const quotaError = new Error(
          error?.message ||
            'You exceeded your current quota, please check your plan and billing details.',
        );
        (quotaError as any).status = 429;
        throw quotaError;
      }
      throw error;
    }
  }

  /**
   * Extract context từ user message bằng AI
   */
  private async extractContext(
    userMessage: string,
    currentContext: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const extractPrompt = `Bạn là hệ thống extract thông tin từ tin nhắn khách hàng.

Nhiệm vụ: Extract các thông tin sau từ tin nhắn và trả về dưới dạng JSON:
- scalp_type: "oily" | "dry" | null
- dandruff_level: "high" | "low" | "medium" | null
- sensitive: true | false | null
- quantity: number | null
- address: string | null
- phone: string | null (format: 0xxxxxxxxx)
- name: string | null
- email: string | null

Context hiện tại: ${JSON.stringify(currentContext)}
Tin nhắn khách: "${userMessage}"

Trả lời CHỈ bằng JSON object, không giải thích thêm. Ví dụ: {"phone": "0912345678", "quantity": 2}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: extractPrompt },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0]?.message?.content || '{}';
      const extracted = JSON.parse(response) as Record<string, unknown>;

      // Merge với context hiện tại
      const merged = { ...currentContext };
      Object.keys(extracted).forEach((key) => {
        const value = extracted[key];
        if (value !== null && value !== undefined && value !== '') {
          merged[key] = value;
        }
      });

      return merged;
    } catch (error) {
      // Nếu extract fail, trả về context hiện tại
      console.error('Error extracting context:', error);
      return currentContext;
    }
  }
}
