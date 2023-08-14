/**
 * 从先前某个时间点到当前时间的语义化表达，返回值会是"3秒前"、"3小时前"、"5分钟前"等
 * @param time 时间戳
 */
export function timeToNowFormatter(time: number) {
    const offset = Date.now() - time;
    if (offset < 0) return '';

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const dayNum = offset / day;
    const hourNum = offset / hour;
    const minuteNum = offset / minute;
    const secondNum = offset / second;

    if (dayNum >= 1) {
        return Math.floor(dayNum) + '天前';
    } else if (hourNum >= 1) {
        return Math.floor(hourNum) + '小时前';
    } else if (minuteNum >= 1) {
        return Math.floor(minuteNum) + '分钟前';
    } else {
        return Math.floor(secondNum) + '秒前';
    }
}
