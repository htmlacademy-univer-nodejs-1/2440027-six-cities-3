#!/usr/bin/env node
import 'reflect-metadata';
import container from './inversify.config.js';
import { Application } from './application.js';
import { CliService } from './cli/cli-service.js';


const app = container.get<Application>(Application);
app.init();

const args = process.argv.slice(2);

const cliService = container.get<CliService>(CliService);
cliService.runCli(args);
