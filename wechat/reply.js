

module.exports = message => {
    let options = {
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now(),
        msgType: 'text'
    }
    let content = '';
    //判断是否为文本消息
    if (message.MsgType === 'text'){
        //判断内容是什么
        if (message.Content === '在我伞下'){
            content = '今天我最帅';
        } else if (message.Content === '2'){
            content = '一个人在图书馆敲代码';
        } else if (message.Content.match('熊')){ //半匹配
            content = '不愧是熊的好朋友!';
        } else {
            content = '换个问法试试吧，如果还不能回答我就要更加努力学习了~'
        }
    } else if (message.MsgType === 'image'){
        //用户发送图片
        options.msgType = 'image';
        options.mediaId = message.MediaId;
        console.log(message.PicUrl)
    } else if (message.MsgType === 'voice'){
        //用户发送语音
        options.msgType = 'voice';
        options.mediaId = message.MediaId;
        console.log(message.Recognition)
    } else if (message.MsgType === 'event'){
        if (message.Event === 'subscribe'){
            content = '欢迎你的关注'
        } else if (message.EventKey === 'SCORE'){ // 使用 message.EventKey 来判断点击事件的 key 值
            options.msgType = 'text'; // 将消息类型设置为 "text"，代表文本消息
            content = '开发中......'
        } else {
            console.log('无情取关')
        }
    } else {
        options.msgType = 'text'; // 将消息类型设置为 "text"，代表文本消息
        content = '暂不支持此类型消息回复'
    }

    options.content = content;
    console.log(options)
    return options
}