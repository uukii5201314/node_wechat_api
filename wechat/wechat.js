// 请求地址 GET  https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

//引入config模块
const {appID, appsecret} = require('../config');
const rp = require('request-promise-native');
// 引入fs模块
const {writeFile, readFile} = require('fs')
//引入菜单模块
const menu = require('./menu');
 class Wechat {
    constructor() {
    }

    //获取access_token
    getAccessToken(){
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;

        return new Promise((resolve, reject) => {
            //发送请求
            rp({method: 'GET', url, json:true})
                .then(res =>{
                   // console.log(res);
                    //res = JSON.parse(res);
                    //console.log(res)
                    //{"access_token":"67_kdO6TfPg5ZfRhmhiPA-a_8Fir6qxMo3n1mLpHRVNGIyoyRH4mhXIskHHZEFaZg3q8OIAQKP2rXQwUwTSo4YVMfiS5ft8kHf0-VPFSIH7zaVEH1y0yhPd3bEGWrIVKRbAJAYNU",
                    // "expires_in":7200}
                    //设置access_token的过期时间
                    res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
                    //将promise 状态设置为成功
                    resolve(res)
                })
                .catch(err => {
                    console.log(err);
                    //将状态设置为失败
                    reject('getAccessToken方法出了问题' + err)
                })
        })


    }

    //用来保存access_token
    saveAccessToken(accessToken){
        accessToken = JSON.stringify(accessToken);
        //异步处理
        return new  Promise((resolve, reject) =>{
            writeFile( __dirname + '/accessToken.txt', accessToken, err => {
                if(!err){
                    //console.log('文件保存成功！')
                    resolve('文件保存成功！')
                } else {
                    reject('saveAccessToken方法出了问题' + err);
                }

            })
        })

    }

    //读取accessToken
    readAccessToken(){
        //异步处理
        return new  Promise((resolve, reject) =>{
            readFile(__dirname + '/accessToken.txt', 'utf8', (err, data) => {
                if(!err){
                   data = JSON.parse(data);
                    //console.log('文件读取成功！')
                    resolve(data)
                } else {
                    reject('readAccessToken方法出了问题' + err);
                }

            })
        })

    }

    // 验证accessToken的有效性
    isValidAccessToken(data){
        //检查是否有效
        if (!data && !data.access_token && !data.expires_in){
            //无效
            return false;
        }

        //检测是否在有效期
        // if (data.expires_in < Date.now()){
        //     //过期了
        //     return false;
        // } else {
        //     return true;
        // }
        //console.log('现在的时间',Date.now())
        return data.expires_in > Date.now();


    }

    //获取没有过期的
    fetchAccessToken(){
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)){
            return Promise.resolve({
                access_token: this.access_token,
                expires_in: this.expires_in
            })
        }
        return this.readAccessToken()
                    .then(async res => {
                        //本地有
                        if (this.isValidAccessToken(res)) {
                            // resolve(res);
                            console.log('没有过期的accesstoken',res)
                            //有效的
                            return Promise.resolve(res);
                        } else {
                            //过期啦，发送请求
                            const res = await this.getAccessToken();
                            await this.saveAccessToken(res);
                            console.log('过期之后的请求',res)
                            // resolve(res)
                            return Promise.resolve(res);
                        }
                    })
                    .catch(async err => {
                        if (err) return Promise.reject(err);
                        //本地么有
                        const res = await this.getAccessToken()
                        await this.saveAccessToken(res);
                        // resolve(res)
                        return Promise.resolve(res);
                    })
                    .then(res => {
                        this.access_token = res.access_token;
                        this.expires_in = res.expires_in;
                        return Promise.resolve(res)
                    })

    }


    //获取jsapi_Ticket
     getTicket(){
         return new Promise(async (resolve, reject) => {
             const data = await this.fetchAccessToken();
             console.log('getTicket中的data为', data);
             const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${data.access_token}&type=jsapi`;
             //发送请求
             rp({method: 'GET', url, json:true})
                 .then(res =>{
                      console.log('请求的值', res);
                     //res = JSON.parse(res);
                     //console.log(res)
                     //{"access_token":"67_kdO6TfPg5ZfRhmhiPA-a_8Fir6qxMo3n1mLpHRVNGIyoyRH4mhXIskHHZEFaZg3q8OIAQKP2rXQwUwTSo4YVMfiS5ft8kHf0-VPFSIH7zaVEH1y0yhPd3bEGWrIVKRbAJAYNU",
                     // "expires_in":7200}
                     //设置access_token的过期时间
                     res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
                     //将promise 状态设置为成功
                     resolve(res)
                 })
                 .catch(err => {
                     console.log(err);
                     //将状态设置为失败
                     reject('getTicket方法出了问题' + err)
                 })
         })


     }

     //用来保存ticket
     saveTicket(ticket){
         ticket = JSON.stringify(ticket);
         //异步处理
         return new  Promise((resolve, reject) =>{
             writeFile(__dirname +'/ticket.txt', ticket, err => {
                 if(!err){
                     //console.log('文件保存成功！')
                     resolve('文件保存成功！')
                 } else {
                     reject('saveTicket方法出了问题' + err);
                 }

             })
         })

     }

     //读取accessToken
     readTicket(){
            //异步处理
            return new  Promise((resolve, reject) =>{
                readFile(__dirname +'/ticket.txt', "utf8", (err, data) => {
                    if (err) {
                        return reject(`readTicket方法出了问题 ${err}`);
                    }
                    data = JSON.parse(data);
                    console.log('文件读取成功！', data);
                    resolve(data);

                })
            })

     }

     // 验证accessToken的有效性
     isValidTicket(data){
         //console.log('data中的数据', data);
         //检查是否有效
         if (!data && !data.ticket && !data.expires_in){
             //无效
             return false;
         }

        // 检测是否在有效期
       //  console.log('时间戳', Date.now())
         if (data.expires_in < Date.now()){
             //过期了
             console.log('过期')
             return false;
         } else {
             console.log('没过期')
             return true;
         }
       //  return data.expires_in > Date.now();


     }

     //获取没有过期的
     fetchTicket(){
         if (this.ticket && this.expires_in && this.isValidTicket(this)){
             return Promise.resolve({
                 ticket: this.ticket,
                 expires_in: this.expires_in
             })
         }
         return this.readTicket()
             .then(async res => {
                 //本地有
                 if (this.isValidTicket(res)) {
                     console.log(222)
                     // resolve(res);
                     //有效的
                     return Promise.resolve(res);
                 } else {
                     console.log(111)
                     //过期啦，发送请求
                     const res = await this.getTicket();
                     await this.saveTicket(res);
                     // resolve(res)
                     return Promise.resolve(res);
                 }
             })
             .catch(async err => {
                 if (err) return Promise.reject(err);
                 //本地么有
                 const res = await this.getTicket()
                 await this.saveTicket(res);
                 // resolve(res)
                 return Promise.resolve(res);
             })
             .then(res => {
                 this.ticket = res.ticket;
                 this.expires_in = res.expires_in;
                 return Promise.resolve(res)
             })

     }




    //创建菜单
    creatMenu(menu){
        return new Promise( async (resolve, reject) => {
            try{
                //console.log(111)
                //获取accessToken
                const data = await this.fetchAccessToken();
                //const data = {"access_token":"68_650yMnq4r0vcGKbEp8PuSvlIjU6TyYafHdmImtmpiLYbKfAmztWMiZ8VekYl4RrpMcYbboOQy4teA8iHux-zjIWXyBN9h0v33R19jGZDhYSm5aKzasQyFubNRJMTWKgAEAZCQ","expires_in":1683716197165}
                //console.log('通过fetchAccessToken()方法获取的值', data);
                //定义请求地址
                const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
                const result = await rp({method: 'POST', url, json: true, body: menu});
                resolve(result)
            } catch (e){
                reject('creatMenu方法出了问题', e)
            }
        })
    }

    //删除菜单
    deleteMenu(){
        return new Promise( async (resolve, reject) => {
                const data = await this.fetchAccessToken()
              //  const data = {"access_token":"68_650yMnq4r0vcGKbEp8PuSvlIjU6TyYafHdmImtmpiLYbKfAmztWMiZ8VekYl4RrpMcYbboOQy4teA8iHux-zjIWXyBN9h0v33R19jGZDhYSm5aKzasQyFubNRJMTWKgAEAZCQ","expires_in":1683716197165}
               // console.log('删除接口中的data数据',data);
                //请求地址
                const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`
                //发送请求
                const result = rp({method: 'GET', url, json: true})
                resolve(result)
        }).catch (err => {
                reject('deleteMenu方法出了问题', err);
        })
    }

    //用户授权
     authorizedLogin(){
         return new Promise(async (resolve, reject) => {
             //发送请求
             rp({method: 'GET', url, json:true})
                 .then(res =>{
                     console.log('请求的值', res);
                     //res = JSON.parse(res);
                     //console.log(res)
                     //{"access_token":"67_kdO6TfPg5ZfRhmhiPA-a_8Fir6qxMo3n1mLpHRVNGIyoyRH4mhXIskHHZEFaZg3q8OIAQKP2rXQwUwTSo4YVMfiS5ft8kHf0-VPFSIH7zaVEH1y0yhPd3bEGWrIVKRbAJAYNU",
                     // "expires_in":7200}
                     //设置access_token的过期时间
                     res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
                     //将promise 状态设置为成功
                     resolve(res)
                 })
                 .catch(err => {
                     console.log(err);
                     //将状态设置为失败
                     reject('getTicket方法出了问题' + err)
                 })
         })
     }

};


// (async () =>{
//    const w = new Wechat();
//    let result = await w.deleteMenu();
//     console.log(result);
//    let results = await w.creatMenu(menu)
//     console.log(results)
//    //  const result = await w.fetchAccessToken();
//    //  console.log('accesstoken为',result);
//    // const data = await w.getTicket();
//    //  console.log('getTicket的值为', data);
//    //  const eee = await w.saveTicket(data);
//    //  console.log('baocun',eee);
//    //  const aaa = await w.readTicket();
//    //  console.log('读取',aaa);
// })()



// (async function(){
//     const w = new Wechat();
//     await w.deleteMenu();
//     await w.creatMenu(menu);
// }());
module.exports = Wechat;












