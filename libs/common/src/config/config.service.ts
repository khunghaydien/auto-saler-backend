import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'your-secret-key';
  }

  get jwtExpiresIn(): number {
    const expiresIn = process.env.JWT_EXPIRES_IN || '86400';
    const numValue = parseInt(expiresIn, 10);
    return isNaN(numValue) ? 86400 : numValue;
  }

  get port(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  get openaiApiKey(): string {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    return key;
  }
}
