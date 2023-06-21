function getWeekNumber(startDate, currentDate) {
    const start = new Date(startDate); // 开学日期
    const current = new Date(currentDate); // 当前日期

    // 获取开学周的第一天（周一）
    const firstDay = start.getDate() - start.getDay() + 1;
    const firstWeekStart = new Date(start.setDate(firstDay));

    // 计算相差的天数
    const timeDiff = current.getTime() - firstWeekStart.getTime();
    const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

    // 计算当前日期是第几周
    const currentWeek = Math.floor(diffDays / 7) + 1;

    return currentWeek;
}

module.exports = getWeekNumber;