function getWeekNumber(startDate, currentDate) {
    const start = new Date(startDate); // 开学日期
    const current = new Date(currentDate); // 当前日期

    // 获取开学周的第一天（周一）
    const firstDay = start.getDate() - start.getDay() + 1;
    const firstWeekStart = new Date(start.setDate(firstDay));

    // 计算相差的天数
    const timeDiff = current.getTime() - firstWeekStart.getTime() + 86400000; // 加上一天的时间差（86400000毫秒）
    const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

    // 计算当前日期是第几周
    const currentWeek = Math.floor(diffDays / 7) + 1;

    // 计算明天的日期
    const tomorrowDate = new Date(current.getTime() + 86400000);
    const tomorrowWeekday = tomorrowDate.getDay(); // 0 表示星期日，1 表示星期一，以此类推

    return { week: currentWeek, weekday: tomorrowWeekday };
}

module.exports = getWeekNumber;

// const startDate = "2023-02-13"; // 开学日期
// const currentDate = new Date().toISOString().split('T')[0]; // 当前日期
//
// const result = getWeekNumber(startDate, currentDate);
// console.log("今天是第 " + result.week + " 周" + "，明天是星期 " + result.weekday);