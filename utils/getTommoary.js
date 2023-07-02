function getWeekNumber(startDate, currentDate) {
    const start = new Date(startDate); // 开学日期
    const current = new Date(currentDate); // 当前日期

    // 获取开学周的第一天（周一）
    const firstDay = start.getDate() - start.getDay() + 1;
    const firstWeekStart = new Date(start.setDate(firstDay));

    // 计算相差的天数
    const timeDiff = current.getTime() - firstWeekStart.getTime(); // 移除加上一天的时间差（86400000毫秒）
    const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

    // 计算当前日期是第几周
    const currentWeek = Math.ceil((diffDays + 1) / 7); // 使用 ceil 函数向上取整来确保不少于一周的天数算作一周

    // 获取当前日期是星期几
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const currentWeekday = current.getDay();

    return { week: currentWeek, weekday: weekdays[currentWeekday] };
}

module.exports = getWeekNumber;

// const startDate = "2023-02-13"; // 开学日期
// const currentDate = new Date().toISOString().split('T')[0]; // 当前日期
//
// const result = getWeekNumber(startDate, currentDate);
// console.log(`今天是第 ${result.week} 周，今天是${result.weekday}`); // 显示今天的周次和星期几信息