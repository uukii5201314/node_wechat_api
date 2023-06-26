
// //加工处理用户信息的模板
// module.exports = options => {
//     console.log(options)
//     let resMessage = `<xml>
//                             <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
//                             <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
//                             <CreateTime>${options.createTime}</CreateTime>
//                             <MsgType><![CDATA[${options.msgType}]]></MsgType>`;
//     if (options.msgType == 'text'){
//         resMessage += `<Content><![CDATA[${options.content}]]></Content>`
//     } else if (options.msgType == 'image'){
//         resMessage += `<Image><MediaId><![CDATA[options.mediaId]]></MediaId></Image>`
//     } else if (options.msgType == 'voice'){
//         resMessage += `<Voice><MediaId><![CDATA[options.mediaId]]></MediaId></Voice>`
//     } else if (options.msgType == 'news'){
//         resMessage += `<ArticleCount>${options.content.length}</ArticleCount>
//                       <Articles>`
//             options.content.forEach(item => {
//                 resMessage +=  `<item>
//                           <Title><![CDATA[${item.title}]]></Title>
//                           <Description><![CDATA[${item.description}]]></Description>
//                           <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
//                           <Url><![CDATA[${item.url}]]></Url>
//                         </item>`
//             })
//         resMessage += `</Articles>`
//     } else if (options.msgType == 'click'){
//         resMessage += `<Content><![CDATA[${options.content}]]></Content>`;
//     }
//     resMessage += '</xml>';
//     //最终回复给用户的xml数据
//     return resMessage;
// }

const builder = require('xmlbuilder');

module.exports = options => {
    let xml = builder.create('xml');

    xml.ele('ToUserName').cdata(options.toUserName);
    console.log('ToUserName:', options.toUserName); // 添加此行进行日志输出
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
    }

    return xml.end({ pretty: false });
};