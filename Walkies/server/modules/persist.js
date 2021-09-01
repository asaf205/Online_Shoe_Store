const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

module.exports = {
    open: async function () {
        return new sqlite3.Database('./walkies_db.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                throw new Error("Cannot establish connection to the database.")
            }
        });
    },

    close: function (db){
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    },

    getUserCart: function(userId){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql = `SELECT  products.product_id as  product_id , quantity, product_picture, product_name, size as product_size, ` +
                    `product_price FROM cart_${userId}  JOIN products ` +
                    `WHERE products.product_id = cart_${userId}.product_id;`;
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows)
                });
            }).catch(err => reject(err))
        })
    },

    insertIntoUserCart: function(userId, product_id, newQuantity, product_size){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql = `INSERT INTO cart_${userId} (product_id , quantity , size ) VALUES(?,?,?)`;
                db.run(sql, [product_id, newQuantity, product_size], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    deleteFromUserCart: function(userId, product_id, product_size){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql = `DELETE FROM cart_${userId} WHERE product_id = ? AND size = ?;`
                db.run(sql, [product_id,product_size], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    emptyUserCart: function(userId){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql = `DELETE FROM cart_${userId};`
                db.run(sql, [], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    insertIntoUserOrderHistory: function(userId, order){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql = `INSERT INTO order_history ('user_id', 'date', 'order') VALUES (?,?,?)`
                db.run(sql, [userId, Date.now(), order], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    getUserOrderHistory: function(userId, page){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let offset = 50 * (page-1)
                let sql = `SELECT * FROM order_history WHERE user_id = ?`;

                db.all(sql, [userId], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows.slice(offset, offset + 50))
                });
            }).catch(err => reject(err))
        })
    },

    logEvent: function (userId, username, type ,product_id){
        this.open().then((db) => {
            let dateJSON = JSON.stringify(Date.now())
            let message;
            switch(type){
                case 'addToCart':
                    message = `User ${username} inserted product ${product_id} to cart`
                    break;
                case 'removeFromCart':
                    message = `User ${username} removed product ${product_id} from cart`
                    break;
                case 'login':
                    message = `User ${username} logged in`
                    break;
                    case 'logout':
                    message = `User ${username} logged out`
                    break;
                case 'register' :
                    message = `User ${username} registered and cart${userId} created`
                    break;
                case 'checkout' :
                    message = `User ${username} with user id ${userId} checked out his order`
                    break;
                case 'addToWishlist':
                    message = `User ${username} inserted product ${product_id} to wishlist`
                    break;
                case 'removeFromWishlist':
                    message = `User ${username} removed product ${product_id} from wishlist`
                    break;
            }
            let sql = `INSERT INTO events (user_id,username,event_date,event_type,event_message) VALUES 
                    (?,?,?,?,?)`
            db.run(sql, [userId,username,dateJSON,type,message], (err) => {
                if (err) {
                    console.log(err)
                }
                this.close(db)
            });
        }).catch(err => reject(err))
    },

    getUserWishlist: function(userId){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql = `SELECT  products.product_id as  product_id, product_picture,product_name, product_size, ` +
                    `product_price FROM wishlist_${userId}  JOIN products ` +
                    `WHERE products.product_id = wishlist_${userId}.product_id;`;
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows)
                });
            }).catch(err => reject(err))
        })
    },

    insertIntoUserWishlist: function(userId, product_id, product_size){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql = `INSERT INTO wishlist_${userId} (product_id, product_size) VALUES(?,?)`;
                db.run(sql, [product_id, product_size], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    deleteFromUserWishlist: function(userId, product_id, product_size){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql = `DELETE FROM wishlist_${userId} WHERE product_id = ? AND product_size = ?;`
                db.run(sql, [product_id,product_size], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    searchEvents: function (search, page) {
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let offset = 50 * (page - 1)
                let sql=`SELECT * FROM events WHERE username LIKE ? ORDER BY event_id DESC`
                db.all(sql, [search], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows.slice(offset, offset + 50))
                });
            }).catch(err => reject(err))
        })
    },

    countEvents: function (search) {
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql=`SELECT COUNT(*) as count FROM events WHERE username LIKE ?`
                db.all(sql, [search], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows)
                });
            }).catch(err => reject(err))
        })
    },


    searchProducts: function (search, page) {
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let offset = 50 * (page-1)
                let sql=`SELECT * FROM products WHERE product_name LIKE ? ORDER BY product_name`
                db.all(sql, [search], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows.slice(offset, offset + 50))
                });
            }).catch(err => reject(err))
        })
    },

    searchProductById: function (id) {
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql=`SELECT * FROM products WHERE product_id = ?`
                db.all(sql, [id], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows)
                });
            }).catch(err => reject(err))
        })
    },

    countProducts: function (search) {
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql=`SELECT COUNT(*) as count FROM products WHERE product_name LIKE ?`
                db.all(sql, [search], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows)
                });
            }).catch(err => reject(err))
        })
    },


    insertProduct: function(productName, productPrice, productPicture, productSizes){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                sql=`INSERT INTO products("product_name","product_price","product_picture","product_sizes") VALUES (?,?,?,?)`;
                db.run(sql, [productName, productPrice, productPicture, productSizes], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    updateProduct: function(productName, productPrice, productPicture, productSizes, productId){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                sql=`UPDATE products SET product_name = ? , product_price= ?, product_picture=?, product_sizes=? WHERE product_id = ?`;
                db.run(sql, [productName, productPrice, productPicture, productSizes, productId], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    deleteProduct: function(product_id){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                sql= `DELETE FROM products WHERE product_id = ?`
                db.run(sql, [product_id], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    insertNewUser: function(username, password){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let sql = `INSERT INTO users (username , password) VALUES(?,?)`;
                db.run(sql, [username , password], function (err){
                    if (err) {
                        console.log(err)
                        return reject(new Error("Username is taken"))
                    }
                    resolve(this.lastID)
                });
                this.close(db)
            }).catch(err => reject(err))
        })
    },

    createUserCart: function(userId){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                sql = `CREATE TABLE \"cart_${userId}\" (\n` +
                    "\t\"product_id\"\tINTEGER NOT NULL,\n" +
                    "\t\"quantity\"\tINTEGER DEFAULT 1,\n" +
                    "\t\"size\"\tINTEGER,\n" +
                    "\tUNIQUE(\"product_id\",\"size\") ON CONFLICT REPLACE,\n" +
                    "\tFOREIGN KEY(\"product_id\") REFERENCES \"products\"(\"product_id\")\n" +
                    ")"
                db.run(sql, [], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    createUserWishlist: function(userId){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                sql = `CREATE TABLE \"wishlist_${userId}\" (\n` +
                    "\t\"product_id\"\tINTEGER NOT NULL,\n" +
                    "\t\"product_size\"\tINTEGER,\n" +
                    "\tUNIQUE(\"product_id\",\"product_size\") ON CONFLICT REPLACE,\n" +
                    "\tFOREIGN KEY(\"product_id\") REFERENCES \"products\"(\"product_id\")\n" +
                    ")"
                db.run(sql, [], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    getUser: function(username, password){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                sql=`SELECT * FROM users WHERE username = ? AND password = ? `
                db.all(sql, [username, password], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows)
                });
            }).catch(err => reject(err))
        })
    },

    insertNewUserSession: function(user_id, username, rememberMe, token){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                let dateJSON = JSON.stringify(Date.now())
                let sql = `INSERT INTO sessions (user_id, username, token, creation_time , remember_me) VALUES(?,?,?,?,?)`;
                db.run(sql, [user_id, username, token, dateJSON, rememberMe], function(err) {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Username is taken"))
                    }
                    return resolve(this.lastID)
                });
                this.close(db)
            }).catch(err => reject(err))
        })
    },

    deleteUserSession: function(user_id){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                sql= `DELETE FROM sessions WHERE user_id = ?`
                db.run(sql, [user_id], (err) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve("Done")
                });
            }).catch(err => reject(err))
        })
    },

    getUserSession: function(token){
        return new Promise(async (resolve,reject) => {
            this.open().then((db) => {
                sql=`SELECT * FROM sessions WHERE token = ?`
                db.all(sql, [token], (err, rows) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error("Cannot establish connection to the database."))
                    }
                    this.close(db)
                    return resolve(rows)
                });
            }).catch(err => reject(err))
        })
    },



}
