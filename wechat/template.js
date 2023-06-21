
//加工处理用户信息的模板
module.exports = options => {
    console.log(options)
    let resMessage = `<xml>
                            <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
                            <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
                            <CreateTime>${options.createTime}</CreateTime>
                            <MsgType><![CDATA[${options.msgType}]]></MsgType>`;
    if (options.msgType == 'text'){
        resMessage += `<Content><![CDATA[${options.content}]]></Content>`
    } else if (options.msgType == 'image'){
        resMessage += `<Image><MediaId><![CDATA[options.mediaId]]></MediaId></Image>`
    } else if (options.msgType == 'voice'){
        resMessage += `<Voice><MediaId><![CDATA[options.mediaId]]></MediaId></Voice>`
    } else if (options.msgType == 'news'){
        resMessage += `<ArticleCount>${options.content.length}</ArticleCount>
                      <Articles>`
            options.content.forEach(item => {
                resMessage +=  `<item>
                          <Title><![CDATA[${item.title}]]></Title>
                          <Description><![CDATA[${item.description}]]></Description>
                          <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
                          <Url><![CDATA[${item.url}]]></Url>
                        </item>`
            })
        resMessage += `</Articles>`
    }
    resMessage += '</xml>';
    //最终回复给用户的xml数据
    return resMessage;
}