var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { ReporterTools } from './reporter.tools.js';
import { ReporterService } from './reporter.service.js';
import { ScannerModule } from '../scanner/scanner.module.js';
let ReporterModule = class ReporterModule {
};
ReporterModule = __decorate([
    Module({
        name: 'reporter',
        description: 'Git repository risk reporting and analysis',
        controllers: [ReporterTools],
        providers: [ReporterService],
        imports: [ScannerModule]
    })
], ReporterModule);
export { ReporterModule };
//# sourceMappingURL=reporter.module.js.map