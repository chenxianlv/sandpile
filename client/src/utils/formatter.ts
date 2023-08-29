/**
 * 解析传入时间，根据其最大时间单位概括时间，解析结果的含义为"3秒"、"3小时"、"5分钟"等
 * @param timeDuration 时间戳，持续时间
 */
export function timeDurationFormatter(timeDuration: number) {
    const result: {
        unit?: 'day' | 'hour' | 'minute' | 'second';
        value?: number;
    } = {};
    if (timeDuration < 0) return result;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const dayNum = timeDuration / day;
    const hourNum = timeDuration / hour;
    const minuteNum = timeDuration / minute;
    const secondNum = timeDuration / second;

    if (dayNum >= 1) {
        result.unit = 'day';
        result.value = Math.floor(dayNum);
    } else if (hourNum >= 1) {
        result.unit = 'hour';
        result.value = Math.floor(hourNum);
    } else if (minuteNum >= 1) {
        result.unit = 'minute';
        result.value = Math.floor(minuteNum);
    } else {
        result.unit = 'second';
        result.value = Math.floor(secondNum);
    }
    return result;
}
