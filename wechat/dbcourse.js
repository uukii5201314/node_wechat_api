const db = require('../db/index');

function dbcourse(courseInfo, openid, day) {
    //定义sql语句
    const str = 'insert into schedule (openid, course, teacher, weeks, day_of_week, weekend, time, room) values(?, ?, ?, ?, ?, ?, ?, ?)'
    //执行sql语句
    db.query(str, [openid, courseInfo.name, courseInfo.teacher, courseInfo.weeks.toString(), day, courseInfo.weekInfo, courseInfo.timeInfo, courseInfo.room], (err, res) => {
        if(err) return console.log(err.message);
        if(res.affectedRows === 1){
            console.log('插入成功');
        }
    })

};

module.exports = dbcourse;