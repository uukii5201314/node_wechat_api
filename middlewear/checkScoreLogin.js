//检测登录的中间件
module.exports = (req, res, next) => {
    //判断用户是否登录
    if(!req.session.userscoreInfo) {
        return res.redirect('/loginscore');
    }
    next();
}