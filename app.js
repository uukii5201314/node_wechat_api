const express = require('express')
var path = require('path');
const auth = require('./wechat/auth');
const sha1 = require('sha1');
//引入wechat模块
const Wechat = require('./wechat/wechat');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const formidable = require('formidable');
//导入数据库模块
const db = require('./db/index');
//导入日期格式化的包
const moment = require('moment')
//导入shortid
const shortid = require('shortid')
//引入config模块
const {appID, appsecret, url, key, location} = require('./config/index');
//导入天气模块
const getWeather = require('./utils/getWeather');
//导入swiper
const swiper = require('./wechat/swiper');
//导入express-session
const session = require('express-session');
//导入中间件
let checkLogin = require('./middlewear/checklogin');
let checkScoreLogin = require('./middlewear/checkScoreLogin');
const checkCourseExist = require('./middlewear/checkCourseExist');
const last = require('./utils/last');
const score = require('./wechat/score');
const getWeekNum = require('./utils/getWeek');


const app = express();

//设置中间件
app.use(session({
    secret:'18790141291',
    saveUninitialized: true,
    resave:false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }))

//配置模板资源
app.set('views', path.join(__dirname, 'views'));
//配置模板引擎
app.set('view engine', 'ejs');

const upload = multer({
    limits: { 
        fileSize: 5 * 1024 * 1024 // 限制上传文件大小为 5MB
    } 
  });
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//创建实例对象
const wechatApi = new Wechat();

//页面路由
app.get('/search', async (req, res) => {
    // const userKey = req.cookies.userKey;
    // console.log('得到的数据用户', userKey);
    // const openid = userKey.openid;
    //随机字符串
    const noncestr = Math.random().toString().split('.')[1];
    const { ticket } = await wechatApi.fetchTicket();
    //获取accesstoken
    const { access_token } = await wechatApi.fetchAccessToken();
    console.log('access_token', access_token);
    const timestamp = Date.now();
    const arr = [
        `jsapi_ticket=${ticket}`,
        `noncestr=${noncestr}`,
        `timestamp=${timestamp}`,
        `url=${url}/search`
    ]
    const str = arr.sort().join('&');
    console.log(str);
    const signature = sha1(str);
    //生成jsapisdk使用签名
    res.render('search', {
        signature,
        noncestr,
        timestamp,
        appId:appID,
        access_token
    });
});

app.get('/user', (req, res) =>{
    try {
    //读取用户信息
    const userKey = req.cookies.userKey;
    console.log('得到的数据用户', userKey);
        //定义sql语句
        const regStr = 'select name, institute, studentnum from student where openid=?'
        //执行sql语句
        db.query(regStr, userKey.openid, (err, result) => {
            if (result && result.length > 0) { // 判断查询结果是否存在
                const user = result[0];
                res.render('user', { name: user.name, headimgurl: userKey.headimgurl, user, nickname: userKey.nickname });
            } else {
                res.send('未找到指定的用户信息！');
            }
        });
    } catch (error) {
        throw error;
    }
})
// app.get('/getAccessToken', (req, res) =>{
//     res.render('user')
// })
app.get('/service', (req, res) =>{
    res.render('service')
})
app.get('/login', async(req, res) => {
    res.render('login');
})
app.get('/allpublic', (req, res) =>{
    //在数据库中获取所有的记录，定义sql语句
    const strAll = 'select * from ldleitems order by time desc'
    db.query(strAll, (err, result) => {
        if(err) return console.log(err.message);
        //console.log(result..reverse());
        res.render('allpublic', {ldleitems: result})
    })
})

//网页授权
app.get('/getCode', (req, res) => {
    // 注意这里必须使用encodeURIComponent对redirect_uri进行编码
   // const redirectUri = encodeURIComponent(`${host}/getAccessToken`);
   //  const redirectUri = 'http://127.0.0.1:3000/getAccessToken'
    const redirectUri = 'http://www.myyaya.com.cn/index'
    const scoped = 'snsapi_userinfo';
    const state = '123';
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=${redirectUri}&response_type=code&scope=${scoped}&state=${state}#wechat_redirect`;
    console.log(url)
    res.redirect(url);
})

// 微信授权回调
app.get('/index', async (req, res) => {
    const result = await getWeather(key, location);
    const weather = result.now;
    console.log('weather', weather)
    const temp = weather.temp;
    const icon = weather.icon;
    const text = weather.text;
    const { code } = req.query;
    console.log('授权码为',code);
    if (!code) {
        res.status(401).send('授权失败');
        return;
    }
    
    // 通过 code 换取网页授权 access_token 和 openid
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appID}&secret=${appsecret}&code=${code}&grant_type=authorization_code`;
    const { data } = await axios.get(url);
    console.log('发送请求之后的data',data);
    const openid = data.openid;
    //授权之后的数据处理
    const access_token = data.access_token;
    const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    const userInfo = await axios.get(userInfoUrl);
    console.log(userInfo.data)
    //定义用户信息创建对象
    let infoUser = {
        openid: userInfo.data.openid,
        nickname: userInfo.data.nickname,
        headimgurl: userInfo.data.headimgurl
    };
    res.cookie('userKey', infoUser,{maxAge:900000,httpOnly:true});
    res.render('index', {temp, icon, text})
});

// 获取静态资源文件
app.get('/upload/:filename', function(req, res) {
    const filename = req.params.filename;  // 从请求参数中获取文件名
    const filePath = path.join(__dirname, '/uploads', filename);
    res.sendFile(filePath);
});

// 处理上传接口
app.post('/upload', upload.single('imgFile'), (req, res) => {   // upload.array('imgFile', 10),
    //生成一个id
    let id = shortid.generate();
    const goodsName = req.body.goodsName;
    const detial = req.body.detial;
    const price = req.body.price;
    const number = req.body.number;
    const userKey = req.cookies.userKey;
    console.log('得到的数据用户', userKey);
    const openid = userKey.openid;
   // console.log('获取上传的文件信息', req.file); // 获取上传的文件信息
    //判断图片是否超出限制
    var imgData = req.body.imgFile.replace(/^data:image\/\w+;base64,/, '');
    var imgBuffer = Buffer.from(imgData, 'base64')
    var timestamp = (new Date()).getTime();
    let imgUrlName = `${__dirname}/uploads/${timestamp}.png`
    fs.writeFile(imgUrlName, imgBuffer, function(err) {
        if (err) {
          res.send({ code: -1, message: '上传图片失败', session: err });
        } else {
            let goodsInfo = {
                goodsName,
                detial,
                id,
                openid,
                price,
                goodsImgUrl: `http://www.myyaya.com.cn/upload/${timestamp}.png`,
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                number,
            };
            //定义一个sql语句
            const str = 'insert into ldleitems (id, openid, goodsName, goodsDetial, goodsPrice, goodsImgUrl, time, number) values(?, ?, ?, ?, ?, ?, ?, ?)'
            //执行sql语句
            db.query(str, [goodsInfo.id, goodsInfo.openid, goodsInfo.goodsName, goodsInfo.detial, goodsInfo.price, goodsInfo.goodsImgUrl, goodsInfo.time, goodsInfo.number], (err, result) => {
                if(err) return console.log(err.message);
                if(result.affectedRows === 1){
                    //console.log('插入成功');
                    //成功提醒
                    res.send({ code: 0, message: '上传图片成功', url: `http://www.myyaya.com.cn:3000/upload/${timestamp}.png` });
                }
            })
        }
      });
    //console.log(req);http://www.myyaya.com.cn:3000/uploads/1685582047459.png
    //res.send('ok')
})

//获取自己的资源信息
app.get('/mypublic', (req, res) => {
    try {
        //得到用户的openid
        //读取用户信息
        const userKey = req.cookies.userKey;
        console.log('得到的数据用户', userKey);
        const openid = userKey.openid;
        //在数据库中获取所有的聊天记录，定义sql语句
        const strAll = 'SELECT * FROM ldleitems WHERE openid = ? ORDER BY time DESC';
        const values = [openid];
        db.query(strAll, values, function(error, results) {
            if (error) throw error;
            //console.log(results);
            res.render('mypublic', {mypublic:results})
        });
    } catch (e) {
        throw e;
    }
})

//下架商品信息
app.get('/delete/:id', (req, res) =>{
    //获取参数
    let id = req.params.id;
    console.log('唯一标识', id);
    const str = `delete from ldleitems where id = ?`;
    const values = [id];
    db.query(str, values, (error, results) => {
        if (error) {
            return error
        } else {
            res.render('success', {title: '删除成功', msg: '删除成功！', url: '/mypublic'})
        }
    })

})

//课表推送
app.get('/coursesend', (req, res) => {
    res.render('coursesend');
})
// 处理更新状态的请求
app.post("/updateStatus", (req, res) => {
    const newStatus = req.body.status;
    //读取用户信息
    const userKey = req.cookies.userKey;
    let openid = userKey.openid;
    const str = "UPDATE student SET issend = ? WHERE openid = ?";
    db.query(str, [newStatus, openid], (err, result) => {
        if (err) throw err;
        res.send({ code: 'ok', msg: newStatus });
    });
});
// 处理获取状态的请求
app.get("/getStatus", (req, res) => {
    //读取用户信息
    const userKey = req.cookies.userKey;
    let openid = userKey.openid;
    const str = 'select * from student where openid = ?';
    db.query(str, [openid], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
             //console.log(result);
             const status = result[0].issend;
            res.send({ code:'ok', msg: status});
        } else {
            res.render('success', {title: '未登录', msg: '您还未登录，点击跳转进入登录页面！', url: 'login'})
        }
    })
});
//课程表
app.get('/course', (req, res) =>{
    try {
    //读取用户信息
    const userKey = req.cookies.userKey;
    console.log('得到的数据用户', userKey);
    const openid = userKey.openid;
    const startDate = "2023-02-13"; // 开学日期
    const currentDate = new Date().toISOString().split('T')[0]; // 当前日期

    const currentWeek = getWeekNum(startDate, currentDate);
    console.log("今天是第 " + currentWeek + " 周");

    // 定义 SQL 语句，使用所选周数值作为查询条件
    const strAll = "SELECT * FROM schedule WHERE FIND_IN_SET(?, weeks) > 0 AND openid = ?";
    const values = [currentWeek, openid];
    db.query(strAll, values, function(error, results) {
        if (error) throw error;
        console.log(results)
        console.log(results.length);
        let week11 = []; let week12 = []; let week13 = []; let week14 = []; let week15 = [];
        let week21 = []; let week22 = []; let week23 = []; let week24 = []; let week25 = [];
        let week31 = []; let week32 = []; let week33 = []; let week34 = []; let week35 = [];
        let week41 = []; let week42 = []; let week43 = []; let week44 = []; let week45 = [];
        let week51 = []; let week52 = []; let week53 = []; let week54 = []; let week55 = [];
        let week61 = []; let week62 = []; let week63 = []; let week64 = []; let week65 = [];
        let week71 = []; let week72 = []; let week73 = []; let week74 = []; let week75 = [];
        results.forEach(element => {
            if (element.day_of_week == '周一' && element.time == '[01-02节]') {
                week11.push(element);
            } else if (element.day_of_week == '周一' && element.time == '[03-04节]') {
                week12.push(element);
            } else if (element.day_of_week == '周一' && element.time == '[05-06节]') {
                week13.push(element);
            } else if (element.day_of_week == '周一' && element.time == '[07-08节]') {
                week14.push(element);
            } else if (element.day_of_week == '周一' && element.time == '[09-10节]') {
                week15.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[01-02节]') {          
                week21.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[03-04节]') {
                week22.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[05-06节]') {
                week23.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[07-08节]') {
                week24.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[09-10节]') {
                week25.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[01-02节]') {
                week31.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[03-04节]') {
                week32.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[05-06节]') {
                week33.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[07-08节]') {
                week34.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[09-10节]') {
                week35.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[01-02节]') {
                week41.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[03-04节]') {
                week42.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[05-06节]') {
                week43.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[07-08节]') {
                week44.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[09-10节]') {
                week45.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[01-02节]') {
                week51.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[03-04节]') {
                week52.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[05-06节]') {
                week53.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[07-08节]') {
                week54.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[09-10节]') {
                week55.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[01-02节]') {
                week61.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[03-04节]') {
                week62.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[05-06节]') {
                week63.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[07-08节]') {
                week64.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[09-10节]') {
                week65.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[01-02节]') {
                week71.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[03-04节]') {
                week72.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[05-06节]') {
                week73.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[07-08节]') {
                week74.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[09-10节]') {
                week75.push(element);
            } 
        });
        res.render('course', { currentWeek, week11,  week12, week13, week14, week15, week21, week22, week23, week24, week25, week31, week32, week33, week34, week35, week41, week42, week43, week44, week45, week51, week52, week53, week54, week55, week61, week62, week63, week64, week65, week71, week72, week73, week74, week75})
    });
    } catch (e) {
        throw e;
    }
})
//选择周次
app.get('/course/:id', (req, res) =>{
    try {
    //读取用户信息
    const userKey = req.cookies.userKey;
    console.log('得到的数据用户', userKey);
    const openid = userKey.openid;
    // 获取传递的周数值
    const selectedWeek = req.query.week || 6;
    const id = req.params.id || 6;

    // 定义 SQL 语句，使用所选周数值作为查询条件
    const strAll = "SELECT * FROM schedule WHERE FIND_IN_SET(?, weeks) > 0 AND openid = ?";
    const values = [id, openid];
    db.query(strAll, values, function(error, results) {
        if (error) throw error;
        console.log(results)
        console.log('1111',results.length);
        let week11 = []; let week12 = []; let week13 = []; let week14 = []; let week15 = [];
        let week21 = []; let week22 = []; let week23 = []; let week24 = []; let week25 = [];
        let week31 = []; let week32 = []; let week33 = []; let week34 = []; let week35 = [];
        let week41 = []; let week42 = []; let week43 = []; let week44 = []; let week45 = [];
        let week51 = []; let week52 = []; let week53 = []; let week54 = []; let week55 = [];
        let week61 = []; let week62 = []; let week63 = []; let week64 = []; let week65 = [];
        let week71 = []; let week72 = []; let week73 = []; let week74 = []; let week75 = [];
        results.forEach(element => {
            if (element.day_of_week == '周一' && element.time == '[01-02节]') {
                week11.push(element);
            } else if (element.day_of_week == '周一' && element.time == '[03-04节]') {
                week12.push(element);
            } else if (element.day_of_week == '周一' && element.time == '[05-06节]') {
                week13.push(element);
            } else if (element.day_of_week == '周一' && element.time == '[07-08节]') {
                week14.push(element);
            } else if (element.day_of_week == '周一' && element.time == '[09-10节]') {
                week15.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[01-02节]') {
                week21.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[03-04节]') {
                week22.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[05-06节]') {
                week23.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[07-08节]') {
                week24.push(element);
            } else if (element.day_of_week == '周二' && element.time == '[09-10节]') {
                week25.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[01-02节]') {
                week31.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[03-04节]') {
                week32.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[05-06节]') {
                week33.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[07-08节]') {
                week34.push(element);
            } else if (element.day_of_week == '周三' && element.time == '[09-10节]') {
                week35.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[01-02节]') {
                week41.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[03-04节]') {
                week42.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[05-06节]') {
                week43.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[07-08节]') {
                week44.push(element);
            } else if (element.day_of_week == '周四' && element.time == '[09-10节]') {
                week45.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[01-02节]') {
                week51.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[03-04节]') {
                week52.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[05-06节]') {
                week53.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[07-08节]') {
                week54.push(element);
            } else if (element.day_of_week == '周五' && element.time == '[09-10节]') {
                week55.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[01-02节]') {
                week61.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[03-04节]') {
                week62.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[05-06节]') {
                week63.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[07-08节]') {
                week64.push(element);
            } else if (element.day_of_week == '周六' && element.time == '[09-10节]') {
                week65.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[01-02节]') {
                week71.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[03-04节]') {
                week72.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[05-06节]') {
                week73.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[07-08节]') {
                week74.push(element);
            } else if (element.day_of_week == '周日' && element.time == '[09-10节]') {
                week75.push(element);
            }
        });
        res.render('courseweek', { id, week11,  week12, week13, week14, week15, week21, week22, week23, week24, week25, week31, week32, week33, week34, week35, week41, week42, week43, week44, week45, week51, week52, week53, week54, week55, week61, week62, week63, week64, week65, week71, week72, week73, week74, week75})
    });
    } catch (e) {
            throw e;
    }
})
//商品详情页面
app.get('/goodsdetial/:id', (req, res) =>{
    //获取参数
    let id = req.params.id;
    let vualue = id.slice(1);
    const str = `SELECT * FROM ldleitems WHERE id = "${vualue}"`;
    // console.log(str);
    db.query(str, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            const goodsInfo = results[0];
            //获取openid 
            const openid = goodsInfo.openid;
            const strAll = 'SELECT * FROM ldleitems WHERE openid = ? ORDER BY time DESC';
            const values = [openid];
            db.query(strAll, values, function(error, result) {
                if (error) throw error;
                //console.log(results);
                res.render('goodsdetial', {goodsInfo, result})
            });
        }
    })
})

//成绩
app.get('/score', (req, res)=>{
    try {
        //读取用户信息
        const userKey = req.cookies.userKey;
        console.log('得到的数据用户', userKey);
        const openid = userKey.openid;
        const str = 'select * from student where openid =?';
        db.query(str, [openid], (err, result) => {
            console.log('参选的数据', result);
            //定义sql语句
            const strAll = 'SELECT * FROM class_schedule WHERE openid = ? ORDER BY semester DESC';
            const values = [openid];
            db.query(strAll, values, function(error, results) {
                if (error) throw error;
                if (results.length > 0) {
                    // console.log(results);
                    res.render('score', {result, results});
                } else {
                    res.render('success', {title: '未登录', msg: '您还未登录，点击跳转进入登录页面！', url: 'loginscore'})
                }
            })
        })
    } catch (error) {
        console.log(error);
    }
})

//失物招领
app.get('/found', checkLogin, (req, res) =>{
    res.render('found');
})

//个人信息
app.get('/myInfo', (req, res) => {
    try {
    //读取用户信息
        const userKey = req.cookies.userKey;
        console.log('得到的数据用户', userKey);
        const openid = userKey.openid;
        const str = 'select * from student where openid =?';
        db.query(str, [openid], (err, result) => {
            //console.log('参选的数据', result);
            res.render('myInfo', { result });
        })
    } catch (e) {
        throw e;
    }
})

//爬取课表
app.post('/course', checkCourseExist, async(req, res) =>{
    try {
        const username = req.body.username;
        const password = req.body.password;
        const userInfo = {
            username,
            password
        }
        //读取用户信息
        const userKey = req.cookies.userKey;
        console.log('得到的数据用户', userKey);
        const openid = userKey.openid;
        // 将 username 和 password 写入 session
        req.session.userInfo = userInfo;
        await swiper(username, password, openid);
        res.send({ code: 0, message: '登录成功！' });
        //res.render('success', {title: '登录成功', msg: '登录成功！', url: '/course'});
    } catch (error) {
    console.error(error.stack);
    res.send({ code: -1, message: '登录失败，请重试！' });
}
})

//爬取成绩
app.post('/score', async(req, res) => {
    try {
        console.log('爬取成')
        const username = req.body.username;
        const password = req.body.password;
        const userscoreInfo = {
            username,
            password
        }
        //读取用户信息
        const userKey = req.cookies.userKey;
        console.log('得到的数据用户', userKey);
        const openid = userKey.openid;
        await score(username, password, openid);
        res.send({ code: 0, message: '登录成功！' });
        // res.render('score');
        // 将 username 和 password 写入 session
        req.session.userscoreInfo = userscoreInfo;
    } catch (error) {
        res.send({ code: -1, message: '登录失败，请重试！' });
    }
})

//登录成绩
app.get('/loginscore', (req, res) =>{
    res.render('loginscore');
})

//问题社区
app.get('/allquestion', (req, res) => {
    try {
        //读取用户信息
        const userKey = req.cookies.userKey;
        let nickname = userKey.nickname;
        const str = 'select * from question ORDER BY time DESC';
        db.query(str, (err, result) => {
            console.log('参选的数据', result);
            res.render('allquestion', { result, nickname });
        });
    } catch (e) {
        throw e;
    }
})
//接受问题
app.post('/allquestion', (req, res) => {
    try {
        //读取用户信息
        const userKey = req.cookies.userKey;
        let openid = userKey.openid;
        let nickname = userKey.nickname;
        let headimgurl = userKey.headimgurl;
        let id = shortid.generate();
        let question = req.body.question;
        let time = moment().format('YYYY-MM-DD HH:mm:ss');
        //定义一个sql语句
        const str = 'insert into question (id, openid, nickname, headimgUrl, question, time) values(?, ?, ?, ?, ?, ?)'
        //执行sql语句
        db.query(str, [id, openid, nickname, headimgurl, question, time], (err, result) => {
            if(err) return console.log(err.message);
            if(result.affectedRows === 1){
                console.log('插入成功');
                //成功提醒
                res.render('success', {title: '发布成功', msg: '发布成功！', url: 'allquestion'})
            }
        });
    } catch (e) {
        throw e;
    }

})
//获取个人信息
app.get('/myquestion', (req, res) => {
    try {
        //读取用户信息
        const userKey = req.cookies.userKey;
        console.log('得到的数据用户', userKey);
        const openid = userKey.openid;
        const str = 'select * from question where openid =? ORDER BY time DESC';
        db.query(str, [openid], (err, result) => {
            //console.log('参选的数据', result);
            if (result.length > 0) {
                res.render('myquestion', { result })
            } else {
                res.render('success', {title: '未查询到数据', msg: '来发布问题吧！', url: 'allquestion'})
            }
        });
    } catch (e) {
        throw e;
    }
})
//删除接口
app.post('/question/:id', (req, res) => {
    //获取参数
    let id = req.params.id;
    console.log('唯一标识', id);
    const str = `delete from question where id = ?`;
    const values = [id];
    db.query(str, values, (error, results) => {
        if (error) {
            return error
        } else {
            res.send({ code:'0', msg:'删除成功!'})
        }
    })
})
//接口
app.get('/share', (req, res) => {
    res.render('share')
});
app.get('/about', (req, res) => {
    res.render('about')
})

//接受处理所有的消息
app.use(auth());

app.listen(80, ()=>{
    console.log('服务器启动成功啦！')
})

