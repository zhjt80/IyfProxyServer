import { Injectable } from '@nestjs/common';
import { AppLoggerService } from './logger.service';

@Injectable()
export class UrlParserService {
  private readonly logger = new AppLoggerService();

  extractId(url: string): string {
    try {
      const parts = url.split('/').filter(Boolean);
      return parts[parts.length - 1] || '';
    } catch (error) {
      this.logger.error('Failed to extract ID from URL', error.stack, 'UrlParserService');
      return '';
    }
  }

  extractEpisodeKey(url: string): string {
    try {
      const parts = url.split('/').filter(Boolean);
      return parts[parts.length - 1] || '';
    } catch (error) {
      this.logger.error('Failed to extract episode key from URL', error.stack, 'UrlParserService');
      return '';
    }
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
