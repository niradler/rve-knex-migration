#!/usr/bin/env node

const program = require('commander');
const {
    prompt
} = require('inquirer');
const Knex = require('knex');
const gen = require('./gen');
const fs = require('fs');

var knex;
var tables;

async function createMigration(con) {

    knex = Knex({
        client: 'mysql',
        connection: {
            host: con.host,
            user: con.user,
            password: con.password ? con.password : '',
            database: con.db
        }
    });
 
    try{
        var is_con = await knex.raw('select 1+1 as result');
    }catch(e){
        console.log('connection error!')
        process.exit(1)
    }
    

    let r = await knex.raw('show tables');
    const tables = r[0].map((t) => {
        const props = Object.getOwnPropertyNames(t);
        return t[props[0]]
    })
    //console.log(tables);
    const describes = [];
    for (const i in tables) {
        try{
            r = await knex.raw('describe ' + tables[i])
            describes.push({
                table: tables[i],
                cols: r[0]
            })
        }catch(e){
            console.log('err',e)
        }
     
    }
    // console.log(describes);
    if (!fs.existsSync('./migrations')) {
        fs.mkdirSync('./migrations');
    }
    for (let i = 0; i < describes.length; i++) {
        const file = gen(describes[i].table, describes[i].table, describes[i].cols);

        fs.writeFile(`./migrations/${parseInt(Math.random() * Math.pow(10, 13) )}_${describes[i].table}.js`, file, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
}

const questions = {
    db_details: [{
            type: 'input',
            name: 'host',
            message: 'Enter host: '
        },
        {
            type: 'input',
            name: 'user',
            message: 'Enter user: '
        },
        {
            type: 'input',
            name: 'password',
            message: 'Enter password: '
        },
        {
            type: 'input',
            name: 'db',
            message: 'Enter db name: '
        },
    ]
}

program
    .version('0.0.1')
    .description('Create migration files from db (adonis), for demonstration only!')

program
    .command('createMigration')
    .alias('c')
    .description('create migration files from given db details')
    .action(() => {
        prompt(questions.db_details).then((con) =>
            createMigration(con)
        );
    });


// Assert that a VALID command is provided 
if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
    program.outputHelp();
    process.exit();
}
program.parse(process.argv)