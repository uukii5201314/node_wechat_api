const db = require('../db/index');

function dbScore (openid, result){
    result.forEach(item => {
        //定义sql语句
        const str = 'insert into class_schedule (openid, semester, name, credit, score) values(?, ?, ?, ?, ?)'
        //执行sql语句
        db.query(str, [openid, item.semester, item.name, item.credit, item.score], (err, res) => {
            if(err) return console.log(err.message);
            if(res.affectedRows === 1){
                console.log('插入成功');
            }
        })
    })
};

module.exports = dbScore;