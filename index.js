#!/usr/bin/env node

// const program = require('commander');
// const { prompt } = require('inquirer');
const Knex = require('knex');
const gen = require('./gen');
const fs = require('fs');

var knex;
var tables;
async function getSchema(con) {
    knex = Knex({
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'shelfmint_v2_local'
        }
    });

    let r = await knex.raw('show tables');
    const tables = r[0].map((t)=>{
       const props = Object.getOwnPropertyNames(t);
       return t[props[0]]
    })
    //console.log(tables);
   const describes = [];
   for (const i in tables) {
    r = await knex.raw('describe '+ tables[i])
    describes.push({table:tables[i],cols:r[0]})
   }
  // console.log(describes);
  if (!fs.existsSync('./migrations')){
    fs.mkdirSync('./migrations');
}
  for (let i = 0; i < describes.length; i++) {
    const file = gen(describes[i].table, describes[i].table, describes[i].cols);
    
    fs.writeFile(`./migrations/${parseInt(Math.random() * Math.pow(10, 13) )}_${describes[i].table}.js`, file, function(err) {
        if(err) {
            return console.log(err);
        }
    });
      
  }
 //process.exit();
}
getSchema();
// const questions = [
//   {
//     type : 'input',
//     name : 'firstname',
//     message : 'Enter firstname ..'
//   },
//   {
//     type : 'input',
//     name : 'lastname',
//     message : 'Enter lastname ..'
//   },
//   {
//     type : 'input',
//     name : 'phone',
//     message : 'Enter phone number ..'
//   },
//   {
//     type : 'input',
//     name : 'email',
//     message : 'Enter email address ..'
//   }
// ];

// const questions = {
//     db_details:[
//          {
//     type : 'input',
//     name : 'host',
//     message : 'Enter db host: '
//   }, 
//   {
//     type : 'input',
//     name : 'user',
//     message : 'Enter db user: '
//   }, 
//   {
//     type : 'input',
//     name : 'password',
//     message : 'Enter db user: '
//   }, 
//   {
//     type : 'input',
//     name : 'password',
//     message : 'Enter db name: '
//   },
//     ]
// }

// program
//   .version('0.0.1')
//   .description('contact management system')

// program
//   .command('getSchema')
//   .alias('gs')
//   .description('print db schema')
//   .action(() => {
//     prompt(questions).then((answers) =>
//       addContact(answers));
//   });

// program
//   .command('getContact <name>')
//   .alias('r')
//   .description('Get contact')
//   .action(name => getContact(name));

// program
//   .command('updateContact <_id>')
//   .alias('u')
//   .description('Update contact')
//   .action(_id => {
//     prompt(questions).then((answers) =>
//       updateContact(_id, answers));
//   });

// program
//   .command('deleteContact <_id>')
//   .alias('d')
//   .description('Delete contact')
//   .action(_id => deleteContact(_id));

// program
//   .command('getContactList')
//   .alias('l')
//   .description('List contacts')
//   .action(() => getContactList());

// Assert that a VALID command is provided 
// if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
//   program.outputHelp();
//   process.exit();
// }
// program.parse(process.argv)