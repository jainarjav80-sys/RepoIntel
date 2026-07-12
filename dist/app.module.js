var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let AppModule = class AppModule {
};
AppModule = __decorate([
    McpApp({
        module: AppModule,
        server: {
            name: 'git-risk-analyzer',
            version: '1.0.0'
        },
        logging: {
            level: 'info'
        }
    }),
    Module({
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map