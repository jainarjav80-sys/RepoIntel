import { Module } from '@nitrostack/core';
import { ScannerTools } from './scanner.tools.js';
import { ScannerService } from './scanner.service.js';

@Module({
  name: 'scanner',
  description: 'Git repository scanner for identifying risky commits',
  controllers: [ScannerTools],
  providers: [ScannerService]
})
export class ScannerModule {}
