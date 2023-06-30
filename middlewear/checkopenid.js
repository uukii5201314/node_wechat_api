module.exports = (req, res, next) => {
    //判断用户是否登录
    if(!req.session.infoUser) {
        return res.redirect('/getCode');
    }
    next();
}