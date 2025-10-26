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
    .option('-c, --category <category>', 'shows expenses that match given category', '')
    .description('Show all expenses from expenses.json')
    .action(async (opts) => {
        const expenseData = await readFile('./expenses.json', true);
        if (opts.sort) {
            if (opts.sort === 'asc') {
                expenseData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                console.log(expenseData);
                return;
            }
            else if (opts.sort === 'desc') {
                expenseData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                console.log(expenseData);
                return;
            }
        }

        if(opts.category){
            const filteredData = expenseData.filter(expenseCategory => expenseCategory.category === opts.category);
            console.log(filteredData);
            return;
        }
        console.log(expenseData);
    })

program.parse();