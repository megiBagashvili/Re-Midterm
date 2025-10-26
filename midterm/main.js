#!/usr/bin/env node

import { Command } from 'commander';
import { readFile, writeFile } from './utils.js';

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
        const expenseData = await readFile('expenses.json', true);

        if (opts.category) {
            const filteredData = expenseData.filter(expenseCategory => expenseCategory.category === opts.category);
            if(filteredData.length === 0){
                console.log(`No expenses found for category ${opts.category}`);
                return;
            }
            console.log(filteredData);
            return;
        }

        if (opts.sort) {
            if (opts.sort === 'asc') {
                expenseData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            }
            else if (opts.sort === 'desc') {
                expenseData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
        }
        
        console.log(expenseData);
    });

program
    .command('create')
    .description('creates a new expense and adds it to the expenses file')
    .argument('<category>', 'expense type')
    .argument('<price>', 'expense total cost')
    .action(async (category, price) => {
        const currentExpenses = await readFile('expenses.json', true);
        const lastId = currentExpenses[currentExpenses.length - 1]?.id || 0;
        price = Number(price);

        if (price < 10) {
            console.log('cannot add expense. Amount must be 10 minimum.');
            return;
        }

        const newExpense = {
            category,
            price,
            id: lastId + 1,
            createdAt: new Date().toISOString()

        }
        currentExpenses.push(newExpense);
        await writeFile('expenses.json', currentExpenses);

    })

program
    .command('delete')
    .description('deletes an expense by id from the expenses file')
    .argument('<id>', 'id of expense to be deleted')
    .action(async (id) => {
        const currentExpenses = await readFile('expenses.json', true);
        const expenseToBeDeleted = currentExpenses.find(exp => exp.id === Number(id));
        if (!expenseToBeDeleted) {
            console.log(`Eexpense with id ${id} not found.`);
            return;
        }
        const updatedExpenses = currentExpenses.filter(el => el !== expenseToBeDeleted);
        await writeFile('expenses.json', updatedExpenses);
    })

program
    .command('getById')
    .description('retrieves element matching the given id')
    .argument('<id>', 'id of expense')
    .action(async (id) => {
        const currentExpenses = await readFile('expenses.json', true);
        const targetExpense = currentExpenses.find(exp => exp.id === Number(id));
        if (!targetExpense) {
            console.log(`Expense with id ${id} not found.`);
            return;
        }
        console.log(targetExpense);

    })

program
    .command('search')
    .description('searches expenses by date created')
    .argument('<date>', 'date to search expenses by (YYYY-MM-DD)')
    .action(async (date) => {
        const currentExpenses = await readFile('expenses.json', true);
        const targetExpenses = currentExpenses.filter(exp => exp.createdAt.startsWith(date));
        if (targetExpenses.length === 0) {
            console.log(`No expenses found for date ${date}.`);
            return;
        }
        console.log(targetExpenses);
    })


program
    .command('update')
    .description('updates expense specified by id')
    .argument('<id>', 'id of expense to be updated')
    .option('-c, --category <category>', 'new category')
    .option('-p, --price <price>', 'new price')
    .action(async (id, opts) => {
        const currentExpenses = await readFile('expenses.json', true);
        const indexToUpdate = currentExpenses.findIndex(exp => exp.id === Number(id));
        if (indexToUpdate === -1) {
            console.log(`Expense with id ${id} not found.`);
            return;
        }
        const updateReq = {}
        if(opts.category){
            updateReq['category'] = opts.category
        }
        if(opts.price){
            updateReq['price'] = Number(opts.price)
        }
        currentExpenses[indexToUpdate] = {
            ...currentExpenses[indexToUpdate],
            ...updateReq
        }
        await writeFile('expenses.json', currentExpenses);
        console.log(`Expense with id ${id} has been updated.`);

    })

program.parse();