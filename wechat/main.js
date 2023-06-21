const isweek = require('./isweek')

// function main (item, openid, day){
//     const regex = /(\d+-\d+|\d+)/g;
//     const weekInfo = item.length === 4 ? item[2] : item[1];
//     const match = weekInfo.match(regex) || [];
//     const weeks = match.flatMap((str) => {
//       if (str.includes('-')) {
//         const [start, end] = str.split('-').map(Number);
//         return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//       } else {
//         return [Number(str)];
//       }
//     });
//     const bracketLeftIndex = weekInfo.indexOf('['); // 从左侧开始查找第一个 `[` 的下标
//     const bracketRightIndex = weekInfo.indexOf(']'); // 从左侧开始查找第一个 `]` 的下标
//     const timeInfo = weekInfo.slice(bracketLeftIndex, bracketRightIndex + 1);
//     let courseInfo = {
//       name: item[0],
//       teacher: item[1],
//       weeks,
//       weekInfo,
//       timeInfo,
//       room: item[item.length - 1]
//     }
//     //console.log("课程名称:", item[0], "任课教师:", item[1], "上课周次:", weeks, "周次信息:", weekInfo,"节次信息:",timeInfo, "地点:", item[item.length -1]);
//   //  console.log(courseInfo);
//   isweek(courseInfo, openid, day)
// };


function main (item, openid) {
    if (item[2].length > 4){

        const regex = /(\d+-\d+|\d+)/g;
        const weekInfo = item[4];
        const match = weekInfo.match(regex) || [];
        const weeks = match.flatMap((str) => {
            if (str.includes('-')) {
                const [start, end] = str.split('-').map(Number);
                return Array.from({length: end - start + 1}, (_, i) => start + i);
            } else {
                return [Number(str)];
            }
        });
        const bracketLeftIndex = item[4].indexOf('['); // Updated to use item[3]
        const bracketRightIndex = item[4].indexOf(']'); // Updated to use item[3]
        const timeInfo = item[4].slice(bracketLeftIndex, bracketRightIndex + 1); // Updated to use item[3]
        let courseInfo = {
            name: item[1], // Updated to use item[1]
            teacher: item[3], // Updated to use item[2]
            weeks,
            weekInfo,
            day_of_week: item[0],
            timeInfo,
            room: item[item.length -1] // Updated to use item[4]
        };
        // console.log(
        //     "课程名称:", item[1],
        //     "任课教师:", item[3],
        //     "上课周次:", weeks,
        //     "周次信息:", weekInfo,
        //     "节次信息:", timeInfo,
        //     "地点:", item[4]
        // );
        isweek(courseInfo, openid, item[0])


    } else {
        const regex = /(\d+-\d+|\d+)/g;
        const weekInfo = item[3];
        const match = weekInfo.match(regex) || [];
        const weeks = match.flatMap((str) => {
            if (str.includes('-')) {
                const [start, end] = str.split('-').map(Number);
                return Array.from({length: end - start + 1}, (_, i) => start + i);
            } else {
                return [Number(str)];
            }
        });
        const bracketLeftIndex = item[3].indexOf('['); // Updated to use item[3]
        const bracketRightIndex = item[3].indexOf(']'); // Updated to use item[3]
        const timeInfo = item[3].slice(bracketLeftIndex, bracketRightIndex + 1); // Updated to use item[3]
        let courseInfo = {
            name: item[1], // Updated to use item[1]
            teacher: item[2], // Updated to use item[2]
            weeks,
            weekInfo,
            timeInfo,
            room: item[4] // Updated to use item[4]
        };
        // console.log(
        //     "课程名称:", item[1],
        //     "任课教师:", item[2],
        //     "上课周次:", weeks,
        //     "周次信息:", weekInfo,
        //     "节次信息:", timeInfo,
        //     "地点:", item[4]
        // );
        isweek(courseInfo, openid, item[0])
    }
    // console.log(courseInfo);
};



module.exports = main;