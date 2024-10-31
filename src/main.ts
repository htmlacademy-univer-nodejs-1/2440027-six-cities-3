#!/usr/bin/env node
import 'reflect-metadata';
import container from './inversify.config.js';
import { Application } from './application.js';
import { CliService } from './cli/cli-service.js';

(async () => {
  const app = container.get<Application>(Application);
  await app.init();

  const args = process.argv.slice(2);

  const cliService = container.get<CliService>(CliService);
  await cliService.runCli(args);
})();
