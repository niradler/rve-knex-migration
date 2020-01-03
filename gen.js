function onlyType(f) {
    const type = f.Type;
    let onlyType = type;
    
    if (type.indexOf("(") != -1) {
        onlyType = type.split("(")[0];
    }

    return onlyType;
}

function gen(name, table, fields) {
    return `
    exports.up = async (knex) => {
      return knex.schema.createTable('${table}', (table) => {
          table.increments()
          table.timestamps()
        ${fields
            .map(f => {
                if (
                    f.Field.toLowerCase() != "id" &&
                    f.Field.toLowerCase() != "created_at" &&
                    f.Field.toLowerCase() != "updated_at"
                ) {
                    return `table.specificType('${f.Field}', '${onlyType(f)}')`;
                } else {
                    return "";
                }
            })
            .join(" \n ")}
      })
    }
  
    exports.down = async (knex) => {
        knex.schema.dropTableIfExists('${table}');
    }
`;
}
module.exports = gen;
