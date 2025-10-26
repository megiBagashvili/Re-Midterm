#!/usr/bin/env node

import { Command } from 'commander';
import { readFile } from './utils.js';

const program = new Command();

program
    .name('expense-cli')
    .description('simple expense management CLI tool')
    .version('1.0.0');

program
    .command('show')
    .option('-s, --sort <sort>', 'return sorted expenses by price', '')
    .description('Show all expenses from expenses.json')
    .action(async (opts) => {
        const readData = await readFile('./expenses.json', true);
        if(opts.sort === 'asc'){
            readData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        else if(opts.sort === 'desc'){
            readData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        console.log(readData);
    })

program.parse();