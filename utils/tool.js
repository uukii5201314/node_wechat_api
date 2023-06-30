//工具包函数
const { parseString } = require('xml2js');

module.exports = {
    getUserDataAsync(req){
        return new Promise((resolve, reject) => {
            let xmlData = '';
            req
                .on('data', data => {
                    try {
                        // 读取 buffer，转换为字符串
                        xmlData += data.toString();
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('end', () => {
                    //数据接受完毕
                    resolve(xmlData)
                })
        })
    },
    parseXMLAsync(xmlData){
        return new Promise((resolve, reject) => {
            try {
                parseString(xmlData, {trim: true}, (err, data) =>{
                    if (err) {
                        reject('parseXMLAsync方法出了问题' + err);
                    } else {
                        resolve(data);
                    }
                })
            } catch (e) {
                console.log('parseXMLAsync方法出了问题', e)
                throw e;
            }
        })

    },
    formatMessage(jsData){
        let message = {};
        //获取xml对象
        jsData = jsData.xml;
        //判断数据是否是一个对象
        if (typeof jsData === 'object'){
            //遍历对象
            for (let key in jsData) {
                let value = jsData[key];
                //过滤掉空的数据
                if (Array.isArray(value) && value.length > 0){
                    message[key] = value[0];
                }
            }
        }
        return message;
    }
}