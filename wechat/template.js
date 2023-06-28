

const builder = require('xmlbuilder');

module.exports = options => {
    let xml = builder.create('xml');

    xml.ele('ToUserName').cdata(options.toUserName);
    // console.log('ToUserName:', options.toUserName); // 添加此行进行日志输出
    xml.ele('FromUserName').cdata(options.fromUserName);
    xml.ele('CreateTime', options.createTime);
    xml.ele('MsgType').cdata(options.msgType);

    if (options.msgType === 'text') {
        xml.ele('Content').cdata(options.content);
    } else if (options.msgType === 'image') {
        xml.ele('Image').ele('MediaId').cdata(options.mediaId);
    } else if (options.msgType === 'voice') {
        xml.ele('Voice').ele('MediaId').cdata(options.mediaId);
    } else if (options.msgType === 'news') {
        const articles = xml.ele('Articles');
        options.content.forEach(item => {
            const article = articles.ele('item');
            article.ele('Title').cdata(item.title);
            article.ele('Description').cdata(item.description);
            article.ele('PicUrl').cdata(item.picUrl);
            article.ele('Url').cdata(item.url);
        });
    } else if (options.msgType === 'click') {
        xml.ele('Content').cdata(options.content);
    } else {
        xml.ele('Content').cdata(options.content);
    }

    return xml.end({ pretty: false });
};