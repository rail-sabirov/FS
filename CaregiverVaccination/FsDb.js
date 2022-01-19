class FsDb {
    constructor() {
        this.dbName = "fsdb";
        this.tableName = null;
        this.db = null;
        this.id = null;
        this.mainField = null; // Main field for search with WHERE in read() and update()
        this.rules = null;

        this.#initDb();
    }

    #initDb() {
        this.db = openDatabase(this.dbName, "1.0", "FiveStar DB", 2 * 1024 * 1024);
    }

    transaction(callback) {
        this.#initDb();
        this.db.transaction((tx) => {
        callback(tx);
        });
    }

    // Create table for implement class
    createTable() {
        this.transaction((tx) => {
            let arr = [];

            for (let key in this.rules) {
                const val = this.rules[key] ? " " + this.rules[key] : "";
                arr.push(`${key}${val}`);
            }

            const fields = arr.join(", ");
            const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${fields})`;

            tx.executeSql(query, [], null, (tx, err) => {
                console.error(`FsDB > createTable(): ${err}`);
            });
        });
    }

    createIndex(fields = []) {
        this.transaction(tx => {
            fields.forEach(field => {
                const query = `CREATE INDEX IF NOT EXISTS idx_${field} ON ${this.tableName} (${field})`;
                clog('-- createIndex > query: ', query);
                tx.executeSql(query, [], 
                    (tx, result) => {
                        clog('-- createIndex: Index created!');
                    },
                    (tx, err) => {
                        console.error('-- createIndex: ', err);
                    }
                );
            });
            
        });

    }

    insert() {
        this.transaction((tx) => {
        const fieldVal = this.values();
        const fields = [];
        const values = [];

        for (let field in fieldVal) {
            if (field !== "id") {
            fields.push(field);
            values.push(fieldVal[field]);
            }
        }

        const fieldsStr = "'" + fields.join("', '") + "'";
        const valuesStr = "'" + values.join("', '") + "'";
        const query = `INSERT INTO ${this.tableName} (${fieldsStr}) VALUES (${valuesStr})`;

        clog("-- insert query: " + query);

        tx.executeSql(
            query,
            [],
            (tx, result) => {
            this.id = result.insertId;
            console.log(
                `New entry in ${this.dbName}/${this.tableName}, id: `,
                result.insertId
            );
            },
            (tx, errors) => {
            if (errors.code === 6) {
            } else {
                console.error("insert: ", errors);
            }
            }
        );
        });
    }

    update(object = null) {
        this.transaction((tx) => {
        const values = this.values();
        const where = `${this.mainField} = '${values[this.mainField]}'`;
        const setArr = [];
        const excludeFields = ['id', this.mainField];

        for (let field in values) {
            if (!excludeFields.includes(field)) {
                clog('-- update > field: ', field);
                let val = values[field] ?? "";

                if (object && object[field] !== undefined) {
                    val = object[field];
                }

                setArr.push(`${field} = '${val}'`);
            }
        }

        const fieldValStr = setArr.join(", "); // vaccination = 'miderna', dose1 = 'dose1'
        const query = `UPDATE ${this.tableName} SET ${fieldValStr} WHERE ${where}`;

        clog("-- update query: " + query);

        tx.executeSql(
            query,
            [],
            (tx, result) => {
            console.log("updated", result);
            },
            (tx, errors) => {
            console.error("update: ", errors);
            }
        );
        });
    }

    
    /**
     * Read from DB
     * @param {function} callback=null
     * @param {Array} fieldsArr=[] - Needed fields from table
     * @param {Object} whereObj={} - Conditions WHERE , 'all' -> all entries
     * @return Permission Callback
     */               
    read(callback = null, fieldsArr = [], whereObj = {}) {
        const val = this.values();
        const fields = fieldsArr.length > 0 ? fieldsArr.join(', ') : '*';
        const whereArr = [];
        let where = '';

        if(whereObj) {
            if(Object.keys(whereObj).length > 0) {
                for(let key in whereObj) {
                    whereArr.push(`${key} = '${whereObj[key]}'`);
                }
            }

            if(whereArr.length > 0) {
                where = 'WHERE ' + whereArr.join(', ')
            } else {
                where = `WHERE ${this.mainField} = '${val[this.mainField]}'`;
            }
        }
        
        const query = `SELECT ${fields} FROM ${this.tableName} ${where}`;
        clog('-- read > query: ', query);

        this.transaction(tx => {
            tx.executeSql(query, [], 
                (tx, result) => {
                    const arr = [];
                    if(result.rows.length > 0) {
                        for(let i=0; i < result.rows.length; i++) {
                            arr.push(result.rows.item(i));
                        }
                    }

                    if(callback) {
                        callback(arr);
                    }
                },
                (tx, err) => {
                    console.error('read: ', err);
                }
            );
        });
    }

    /**
     * Read all entries from DB
     * @param {function} callback=null
     * @return Permission Callback
     */    
    readAll(callback) {
        const query = `SELECT * FROM ${this.tableName}`;
        const out = [];
        this.transaction(tx => {
            tx.executeSql(query, [], 
                (tx, result) => {
                    for(let i=0; i < result.rows.length; i++) {
                        out.push(result.rows.item(i));
                    }

                    callback(out);
                },
                (tx, err) => {
                    console.error('readAll: ', err);
                }
            );
        });
    }

    /**
     * Conver string from snake_case to camelCase
     * @param {sting} str
     * @return string                
     */
    #convertSnakeCaseToCamelCase(str) {
        let arr = str.split("_");
        let out = arr[0];
        arr.shift();

        arr.map((item) => {
        out += item.charAt(0).toUpperCase() + item.slice(1);
        });

        return out;
    }

    /**
     * Return object values with keys from table column names
     * @return Object
     */
    values() {
        let out = {};

        for (let key in this.rules) {
        const classProperty = this.#convertSnakeCaseToCamelCase(key);
        out = { ...out, [key]: this[classProperty] };
        }

        return out;
    }
}