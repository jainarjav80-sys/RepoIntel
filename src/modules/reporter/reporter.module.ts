import { Module } from '@nitrostack/core';
import { ReporterTools } from './reporter.tools.js';
import { ReporterService } from './reporter.service.js';
import { ScannerModule } from '../scanner/scanner.module.js';

@Module({
  name: 'reporter',
  description: 'Git repository risk reporting and analysis',
  controllers: [ReporterTools],
  providers: [ReporterService],
  imports: [ScannerModule]
})
export class ReporterModule {}
