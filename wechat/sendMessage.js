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
console.log("今天是第 " + result.week + " 周" + "，明天是星期 " + result.weekday);

const template_data = {
    first: {
        value: '你好，以下课程将在15分钟后开始',
        color: '#173177'
    },
    keyword1: {
        value: '英语4级',
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

cron.schedule('0 23 * * *', function() {
    // 在这里编写触发推送课表的代码
    main();
    // 调用相应的函数或方法来发送课表消息
});
