const puppeteer = require('puppeteer');
const db = require('../db/index');
const score = require('./score');
const main = require('./main');
//引入数据库模块
async function swiper(account, password, openid){
    let browser;
    try{
        browser = await puppeteer.launch({
            headless: false,
            args: [
                `--disable-web-security`,
                `--disable-features=IsolateOrigins,site-per-process`, // 很关键...
            ]
        });//打开浏览器
        const page = await browser.newPage();//打开一个空白页
        await page.setViewport({width: 1080, height: 1024});
        await page.goto('https://jw.wfu.edu.cn/jsxsd/');//打开教务系统网站
        await page.type('#userAccount', account);  //输入账号
        await page.type('#userPassword', password);//输入密码
        await page.click('.btn');//点击登录
        await page.waitForNavigation({
            waitUntil: 'load'
        });//等待页面加载出来，等同于window.onload
        await page.waitForSelector('.Nsb_pw > #dataList > tbody > tr:nth-child(2) > td > a');
        await page.click('.Nsb_pw > #dataList > tbody > tr:nth-child(2) > td > a');
        // 获取iframe元素标签
        await page.waitForSelector('iframe');
        const iframeElement = await page.$('iframe');
        const frame = await iframeElement.contentFrame();
        const num = await frame.$$eval('.middletopdwxxcont', n => n
            .map(a => a.innerText));
        num.splice(0,1);
        //此处输出的内容  [ '熊海印', '21161140140', '体育学院', '体育教育', '体育本21(6)' ]
        console.log(num);
        const str1 = 'select * from student where openid = ?';
        db.query(str1, [openid], (err, result) =>{
            if (result.length > 0) {
                const str2 = 'delete from student where openid = ?';
                db.query(str2, [openid], (err, results) =>{
                    if (err) {
                        return err;
                    } else{
                        console.log('查询到有数据，删除成功');
                        //定义sql语句
                        const strstu = 'insert into student (openid, name, issend, studentnum, institute, major, class) values(?, ?, ?, ?, ?, ?, ?)'
                        //执行sql语句
                        db.query(strstu, [openid, num[0], 0, num[1], num[2], num[3], num[4]], (err, res) => {
                            if(err) return console.log(err.message);
                            if(res.affectedRows === 1){
                                console.log('插入成功',22222);
                            }
                        })
                    }
                })
            } else {
                //定义sql语句
                const strstu = 'insert into student (openid, name, issend, studentnum, institute, major, class) values(?, ?, ?, ?, ?, ?, ?)'
                //执行sql语句
                db.query(strstu, [openid, num[0], 0, num[1], num[2], num[3], num[4]], (err, res) => {
                    if(err) return console.log(err.message);
                    if(res.affectedRows === 1){
                        console.log('插入成功',22222);
                    }
                })
            }
        })




        //模拟点击获取全部课程表
        await frame.click('div.grid:nth-child(1)')
        //等待页面加载，默认时间为三秒
        await new Promise(resolve => setTimeout(resolve, 500));
        //跳转新页面新的iframe标签
        await page.waitForSelector('#Frame1');
        const iframeElement1 = await page.$('#Frame1');
        const frame1 = await iframeElement1.contentFrame();
        let courseArray = [];
        for (let joint = 2; joint <= 8; joint++){
            for (let wee = 2; wee <=6; wee++) {
                const a = `#kbtable > tbody:nth-child(1) > tr:nth-child(${wee}) > td:nth-child(${joint}) > div:nth-child(4)`;
                //获取本学期所有的课程表
                const allCourse = await frame1.$$eval(a, el => el
                    .map(n => n.innerText));
                courseArray.push(allCourse)
            }
        };
        //console.log('我是爬取所有课表的值', courseArray);
        let arr = [];
        //遍历二维数组，并判断不为空的情况
        courseArray.forEach(courseArrayItem =>{
            if (courseArrayItem !== [ ' ' ]){
                const delimiter = "---------------------\n";  // 指定分隔符
                const result = courseArrayItem.map(item => {
                    const str = item.split(delimiter);
                    return str;
                });
                //console.log(result);
                result.forEach(resultItem =>{
                    const newResult = resultItem.map(item =>{
                        const resultStr = item.split("\n");
                        return resultStr.flatMap(arr => arr).filter(arr => arr.length > 0);
                    });
                    //console.log(newResult)
                    arr.push(newResult);
                })
            }
        });
        //console.log(arr);
        const weeks = [];
        for (let i = 0; i < arr.length; i += 5) {
            weeks.push(arr.slice(i, i + 5));
        }

        let str = [];
        let Monday = [];
        let Tuesday = [];
        let Wednesday = [];
        let Thursday = [];
        let Friday = [];
        let Saturday = [];
        let Sunday = [];

        for (let i = 0; i <= 6; i ++){
            weeks[i].forEach((item) => {
                item = item.filter(subItem => subItem[0].trim() !== '');
                if (item.length !== 0) {
                    if (i === 0) {
                        Monday.push(item);
                    } else if (i === 1) {
                        Tuesday.push(item);
                    } else if (i === 2) {
                        Wednesday.push(item);
                    } else if (i === 3) {
                        Thursday.push(item);
                    } else if (i === 4) {
                        Friday.push(item);
                    } else if (i === 5) {
                        Saturday.push(item);
                    } else if (i === 6) {
                        Sunday.push(item);
                    }
                }
            });
        }


        // 创建一个空数组来存储所有数据
        const allData = [];

        Monday.forEach(strItem => {
            strItem.forEach(item => {
                const data = ['周一', ...item];
                allData.push(data);
            });
        });

        Tuesday.forEach(strItem => {
            strItem.forEach(item => {
                const data = ['周二', ...item];
                allData.push(data);
            });
        });

        Wednesday.forEach(strItem => {
            strItem.forEach(item => {
                const data = ['周三', ...item];
                allData.push(data);
            });
        });

        Thursday.forEach(strItem => {
            strItem.forEach(item => {
                const data = ['周四', ...item];
                allData.push(data);
            });
        });

        Friday.forEach(strItem => {
            strItem.forEach(item => {
                const data = ['周五', ...item];
                allData.push(data);
            });
        });

        Saturday.forEach(strItem => {
            strItem.forEach(item => {
                const data = ['周六', ...item];
                allData.push(data);
            });
        });

        Sunday.forEach(strItem => {
            strItem.forEach(item => {
                const data = ['周日', ...item];
                allData.push(data);
            });
        });

        console.log(allData);

        allData.forEach(item =>{
            main(item, openid)
        })


        await browser.close();//关掉浏览器
    } catch (error) {
        console.error(error);
        if (browser) {
            await browser.close();
        }
        return error;
    }

}

module.exports = swiper;