//导入数据库模块
const mysql = require('mysql');


//连接数据库
const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'123321',
    database:'chat'
})
module.exports = db;