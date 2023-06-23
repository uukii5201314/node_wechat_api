const puppeteer = require('puppeteer');

// const account = '21161140140';
// const password = 'Xhy18790141291';
// const openid = '125'
async function score(account, password){
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
        // await page.waitForNavigation({
        //     waitUntil: 'load'
        // });//等待页面加载出来，等同于window.onload
        await new Promise(resolve => setTimeout(resolve, 1500));
        await page.waitForSelector('.Nsb_pw > #dataList > tbody > tr:nth-child(2) > td > a');
        await page.click('.Nsb_pw > #dataList > tbody > tr:nth-child(2) > td > a');
        // 获取iframe元素标签
        // await page.waitForNavigation(); // 等待页面加载完成
        await page.waitForSelector('iframe');
        const iframeElement = await page.$('iframe');
        const frame = await iframeElement.contentFrame();
        await new Promise(resolve => setTimeout(resolve, 1500));
        await frame.click('body > div > div.middlewaprightpart.r > div.middlewaprightup > div.usuafunmenu > div > div > div:nth-child(2)');
        // //设置等待时长为3秒，等待页面加载出来
        // await new Promise(resolve => setTimeout(resolve, 500));
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 获取父级iframe元素标签
        await page.waitForSelector('#Frame1');
        const fatherFrameElement = await page.$('#Frame1');
        const fatherFrame = await fatherFrameElement.contentFrame();
        // 获取子级iframe元素标签
        const iframeElement1 = await fatherFrame.$('#cjcx_query_frm');
        console.log('daozhel1111111111111111');
        const frame1 = await iframeElement1.contentFrame();
        console.log('daozhel222222222222222222');
        // #btn_query
        await frame1.waitForSelector('#btn_query')
        await frame1.click('#btn_query');
        await new Promise(resolve => setTimeout(resolve, 500));
        // 获取子级iframe元素标签
        const iframeElement2 = await fatherFrame.$('#cjcx_list_frm');
        const frame2 = await iframeElement2.contentFrame();
        const score = await frame2.$$eval('#dataList > tbody > tr', n => n
            .map(a => a.innerText));
        //console.log(score);
    
    // 获取表头索引
        const [idx, semesterIdx, , , nameIdx, , , creditIdx, , , scoreIdx] = score[0].split('\t');
    
    // 提取课程名称、开课学期、学分、成绩
        const result = [];
        score.slice(1).map((row) => {
            const [, semester, , name, , score, , credit] = row.split('\t');
            result.push({
                semester,
                name,
                credit,
                score,
            });
        });

        await browser.close();//关掉浏览器
        return result;
    } catch (error) {
        console.error(error);
        if (browser) {
            await browser.close();
        }
        return error;
    }
};
// score(account, password, openid);
module.exports = score;