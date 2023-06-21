const template_id = 'GsnyDrh8XmMedqRll8zBNI0PmViAqPxhuyu1fMefv94';
//引入wechat模块
const Wechat = require('./wechat');
const openid = 'ohz76509n52PUc-6apjr5q0Ms1ko';
const axios = require('axios');
//引入config模块
const {appID, appsecret, url, key, location} = require('../config/index');
const { json } = require('body-parser');
const template_data = {
    "first": {

        "value":"哈哈哈",

        "color":"#173177"

    },

    "name":{

        "value":"朱玉布同学",

        "color":"#173177"

    },

    "num": {

        "value":"21161140021",

        "color":"#173177"

    },

    "course":{

        "value":"还不滚去学习",

        "color":"#173177"

    }
}


//创建实例对象
const wechatApi = new Wechat();


async function sendMessage(access_token, openid, template_data) {
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
    const data = {
        touser: openid,
        template_id: template_id,
        data: template_data
    };
    const result = await axios.post(url, data, { json: true });
    // console.log(result);
}
async function main(){
//获取accesstoken
const { access_token } = await wechatApi.fetchAccessToken();
const mainfun = await sendMessage(access_token, openid, template_data);
console.log('mainfun', mainfun);
}
main();