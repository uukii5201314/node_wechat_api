//自定义菜单
module.exports = {
    "button":[
        {
            "type":"view",
            "name":"首页",
            "url":"http://www.myyaya.com.cn/getCode"
        },
        {
            "name":"信息查询",
            "sub_button": [
                {
                    "type": 'click',
                    "name": '查寻成绩',
                    "key": 'SCORE_QUERY',
                },
                {
                    "type": 'click',
                    "name": '查寻课表',
                    "key": 'COURSE_SCHEDULE',
                },
            ],
        },
        {
            "name": "发图",
            "sub_button": [
                {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图",
                    "key": "系统拍照发图"
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "拍照或者相册发图"
                },
                {
                    "type": "pic_weixin",
                    "name": "微信相册发图",
                    "key": "微信相册发图"
                },
                {
                    "name": "发送位置",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                }]
        },
    ]
}