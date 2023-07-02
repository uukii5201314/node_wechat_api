//自定义菜单
module.exports = {
    "button":[
        {
            "type":"view",
            "name":"首页",
            "url":"http://www.myyaya.com.cn/getCode"
        },
        {
            "name":"功能大厅",
            "sub_button":[
                {
                    "type":"view",
                    "name":"功能大厅",
                    "url":"http://www.myyaya.com.cn/service"
                },
                {
                    "type":"click",
                    "name":"成绩查询",
                    "key":"SCORE"
                },
                {
                    "type":"view",
                    "name":"提问社区",
                    "url":"http://www.myyaya.com.cn/allquestion"
                },]
        },
        {
            "type":"view",
            "name":"接口文档",
            "url":"http://www.myyaya.com.cn/share"
        },
    ]
}