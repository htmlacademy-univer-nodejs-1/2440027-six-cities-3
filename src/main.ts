#!/usr/bin/env node

import { runCli } from './cli/cli.js';


const args = process.argv.slice(2);
runCli(args);
