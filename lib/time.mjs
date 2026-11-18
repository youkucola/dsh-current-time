export const CURRENT_TIME_DESCRIPTION = '获取当前北京时间（Asia/Shanghai），格式 YYYY-MM-DD HH:mm:ss 星期X，精确到秒；每次调用读取当前系统时间。';

const formatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  calendar: 'gregory',
  numberingSystem: 'latn',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  weekday: 'long',
  hourCycle: 'h23',
});

export function formatCurrentTime(date = new Date()) {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  const day = `${parts.year.padStart(4, '0')}-${parts.month}-${parts.day}`;
  const time = `${parts.hour}:${parts.minute}:${parts.second}`;
  return `${day} ${time} ${parts.weekday}`;
}

export function getCurrentTime() {
  return { ok: true, message: formatCurrentTime(new Date()) };
}
