const db = require('../db/index');

const checkCourseExist = (req, res, next) => {
  const userKey = req.cookies.userKey;

  if (!userKey || !userKey.openid) {
    // 如果不存在 openid 或 userKey，则直接执行下一个中间件/路由处理程序
    return next();
  }

  const openid = userKey.openid;
  const selectStr = 'SELECT * FROM schedule WHERE openid = ?';

  db.query(selectStr, [openid], (err, result) => {
    if (err) {
      // 如果出现错误，则直接通过 next() 传递给下一个中间件/错误处理程序
      return next(err);
    }

    if (result.length > 0) {
        console.log('ai,如果查询到结果，则删除原来的课表', 520520520);
      // 如果查询到结果，则删除原来的课表
      const deleteStr = 'DELETE FROM schedule WHERE openid = ?';

      db.query(deleteStr, [openid], (error, results) => {
        if (error) {
          // 如果出现错误，则直接通过 next() 传递给下一个中间件/错误处理程序
          return next(error);
        }

        // 删除成功后，执行下一个中间件/路由处理程序
        next();
      });
    } else {
      // 如果没有查询到结果，则直接执行下一个中间件/路由处理程序
      next();
    }
  });
};

module.exports = checkCourseExist;