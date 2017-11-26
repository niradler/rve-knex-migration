function gen(name, table, fields) {
    return `
'use strict'

const Schema = use('Schema')

class ${name} extends Schema {
  up () {
    this.create('${table}', (table) => {
        table.increments()
        table.timestamps()

        //auto fields
      ${fields.map((f)=>{
          if(f.Field.toLowerCase() !='id'){
            return `table.string('${f.Field}')`
          }else{return ''}
        
      }).join(' \n ')}
    })
  }

  down () {
    this.table('${table}', (table) => {
        this.drop('${table}')
    })
  }
}

module.exports = ${name}
`
}
module.exports = gen