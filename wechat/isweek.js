
const dbcourse = require('./dbcourse');
function isweek(courseInfo, openid, day) {
        //周
        const Zreg = /\(周\)/;
        const Zmatch = Zreg.exec(courseInfo.weekInfo);
        //单周
        const Dreg = /\(单周\)/;
        const Dmatch = Dreg.exec(courseInfo.weekInfo);
        if (Zmatch) {
                courseInfo.weeks = courseInfo.weeks.slice(0, -2);
                dbcourse(courseInfo, openid, day);
        } else if (Dmatch) {
                courseInfo.weeks = courseInfo.weeks.slice(0, -2);
                courseInfo.weeks = courseInfo.weeks.filter(function(week) {
                        return week % 2 !== 0;
                      });
                      console.log(courseInfo.weeks); // [5, 7, 9, 13, 15]
                      dbcourse(courseInfo, openid, day)

        } else {
                courseInfo.weeks = courseInfo.weeks.slice(0, -2);
                courseInfo.weeks = courseInfo.weeks.filter(function(week) {
                        return week % 2 == 0;
                      });
                      console.log(courseInfo.weeks); 
                      dbcourse(courseInfo, openid, day)
        }
};

module.exports = isweek;