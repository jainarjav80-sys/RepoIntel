import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { ScannerModule } from './modules/scanner/scanner.module.js';
import { ReporterModule } from './modules/reporter/reporter.module.js';
import { RepositoryModule } from './modules/repository/repository.module.js';
import { ContributorsModule } from './modules/contributors/contributors.module.js';
import { SystemHealthCheck } from './health/system.health.js';

/**
 * Root Application Module
 * 
 * This is the main module that bootstraps the MCP server.
 * It registers all feature modules and health checks.
 */
@McpApp({
  module: AppModule,
  server: {
    name: 'git-risk-analyzer',
    version: '1.0.0'
  },
  logging: {
    level: 'info'
  }
})
@Module({
  name: 'app',
  description: 'Root application module',
  imports: [
    ConfigModule.forRoot(),
    ScannerModule,
    ReporterModule,
    RepositoryModule,
    ContributorsModule
  ],
  providers: [
    // Health Checks
    SystemHealthCheck,
  ]
})
export class AppModule {}

