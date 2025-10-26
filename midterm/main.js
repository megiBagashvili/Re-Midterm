#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

program
    .name('expense-cli')
    .description('simple expense management CLI tool')
    .version('1.0.0');

program.parse();