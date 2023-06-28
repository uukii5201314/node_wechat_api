//验证服务器有效性的模块

const config = require("../config/index");
const sha1 = require("sha1");
const { getUserDataAsync, parseXMLAsync, formatMessage } = require('../utils/tool');
//引入template模块
const template = require('./template')
const reply = require('./reply')
//验证服务器有效性的模块
module.exports = () => {
    return async (req, res, next) => {
        //微信服务器发送的参数
         console.log(req.query)
        const {signature, echostr, timestamp, nonce} = req.query;
        const {token} = config;
        const sha1Str = sha1([timestamp, nonce, token].sort().join(''));
        console.log(sha1Str);
        console.log(signature);
        //POST
        if (req.method === 'GET'){
            //判断消息是否来自微信服务器
            if (sha1Str === signature){
                //很重要的一句话
                res.set('Content-Type','text/plain')
                res.send(echostr);
               // next();
            }else {
                res.end('error');
            }
        } else if (req.method === 'POST'){
            //验证消息来自微信服务器
            if (sha1Str !== signature){
                //说明消息不是来自微信服务器
                res.end('error');
                // return ;
            }
            try {
            //接受请求体中的数据
                const xmlData = await getUserDataAsync(req);
                 //console.log(xmlData)
                //将xml数据解析为js数据
                await parseXMLAsync(xmlData)
                    .then(jsData => {
                    //数据格式化
                    const message = formatMessage(jsData);

                    const options = reply(message)

                    //最终回复的消息
                    const resMessage = template(options);


                    console.log(resMessage)
                    //返回响应给微信服务器
                    return  res.type('application/xml').send(resMessage)  //.type('application/xml')
                })
                    .catch(error => {
                    // 处理 Promise 拒绝的错误
                    console.error(error);
                    // 可以选择抛出错误或返回一个处理后的默认值
                    throw error; // 抛出错误终止
                });
                 // console.log(jsData)
               //  //数据格式化
               //  const message = formatMessage(jsData);
               //
               //  const options = reply(message)
               //
               //  //最终回复的消息
               //  const resMessage = template(options);
               //
               //
               //  console.log(resMessage)
               //  //返回响应给微信服务器
               // return  res.type('application/xml').send(resMessage)  //.type('application/xml')
                // //会发送三次请求
                // res.end('');
            } catch (e) {
                throw e;
            }

        } else {
            res.end('error')
        }

    }
}