const template_id = 'c5FmXvcxSQ1-VDgmpEpCwLb1mDF0oEJZK5VS9XCHxSE';
const getWeekNumber = require('../utils/getTommoary');
//引入wechat模块
const Wechat = require('./wechat');
const openid = 'oy-v96lvZ61_q8Ab5wvw5hX_7zuI';
const axios = require('axios');
const cron = require('node-cron');
const db = require('../db/index');

const startDate = "2023-02-13"; // 开学日期
const currentDate = new Date().toISOString().split('T')[0]; // 当前日期
const result = getWeekNumber(startDate, currentDate);
console.log(`今天是第 ${result.week} 周，今天是${result.weekday}`); // 显示今天的周次和星期几信息    今天是第 20 周，今天是周五
const todayWeek = result.week;
const weekday = result.weekday;


const courseNames = []; // 存储所有的 courseName
const studentName = [];
async function dbCourse() {
    return new Promise((resolve, reject) => {
      const str = 'SELECT openid, name FROM student WHERE issend = 1';
      db.query(str, (err, result) => {
        if (err) {
          reject(err);
        } else {
          result.forEach(item => {
            const openid = item.openid;
            const name = item.name;
            const strcourse = `SELECT course FROM schedule WHERE weeks = 1 AND day_of_week = '周一' AND openid = '${openid}'`;
  
            db.query(strcourse, (err, result) => {
              if (err) {
                reject(err);
              } else {
                if (result.length > 0) {
                  const courseName = result[0].course;
                  courseNames.push(courseName);
                  studentName.push(name);
                  console.log('stuname', studentName);
                //   console.log(courseNames);
                  resolve(courseNames);
                }
              }
            });
          });
  
        //   resolve(courseNames);
        }
      });
    });
  }

//   dbCourse();

async function must() {
    try {
      const courses = await dbCourse();
      console.log('courseNames', courseNames);
  
      const template_data = {
        first: {
            value: '你好，以下课程将在15分钟后开始',
            color: '#173177'
        },
        keyword1: {
            value: courseNames[0],
            color: '#173177'
        },
        keyword2: {
            value: '刘浩雯',
            color: '#173177'
        },
        remark: {
            value: '若因故无法参加，请及时联系老师',
            color: '#173177'
        }
      };
  console.log('template_data', template_data);
      // 继续执行其他逻辑
  
    } catch (error) {
      console.error(error);
    }
  }

  must();
// console.log('courseNames', courseNames[0]);
// const template_data = {
//     first: {
//         value: '你好，以下课程将在15分钟后开始',
//         color: '#173177'
//     },
//     keyword1: {
//         value: courseNames[0],
//         color: '#173177'
//     },
//     keyword2: {
//         value: '刘浩雯',
//         color: '#173177'
//     },
//     remark: {
//         value: '若因故无法参加，请及时联系老师',
//         color: '#173177'
//     }
// };

// console.log('template_data', template_data);

//创建实例对象
const wechatApi = new Wechat();


async function sendMessage(access_token, openid, template_data) {
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
    const data = {
        touser: openid,
        template_id: template_id,
        url: 'http://www.myyaya.com.cn/course',  // 设置点击进来的URL
        data: template_data
    };
    const result = await axios.post(url, data, { json: true });
     console.log(result.data);
}
async function main(){
    //获取accesstoken
    const { access_token } = await wechatApi.fetchAccessToken();
    await sendMessage(access_token, openid, template_data);
}

// cron.schedule('15 20 * * *', function() {
    // 在这里编写触发推送课表的代码
    // main();
    // 调用相应的函数或方法来发送课表消息
// });
