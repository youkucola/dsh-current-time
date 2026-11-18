import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { formatCurrentTime } from '../lib/time.mjs';

const outputPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} 星期[日一二三四五六]$/;

test('固定时刻、补零、北京午夜、跨年和闰日均严格格式化', () => {
  const cases = [
    ['2026-11-18T00:47:12+08:00', '2026-11-18 00:47:12 星期三'],
    ['2026-01-02T03:04:05+08:00', '2026-01-02 03:04:05 星期五'],
    ['2026-11-17T15:59:59Z', '2026-11-17 23:59:59 星期二'],
    ['2026-11-17T16:00:00Z', '2026-11-18 00:00:00 星期三'],
    ['2026-12-31T15:59:59Z', '2026-12-31 23:59:59 星期四'],
    ['2026-12-31T16:00:00Z', '2027-01-01 00:00:00 星期五'],
    ['2024-02-28T16:00:00Z', '2024-02-29 00:00:00 星期四'],
    ['2024-02-29T16:00:00Z', '2024-03-01 00:00:00 星期五'],
  ];
  for (const [input, expected] of cases) {
    const result = formatCurrentTime(new Date(input));
    assert.equal(result, expected, input);
    assert.match(result, outputPattern);
  }
});

test('七个星期均来自同一北京时间，星期天输出为星期日', () => {
  for (const [index, weekday] of ['日', '一', '二', '三', '四', '五', '六'].entries()) {
    const date = `2026-11-${15 + index}`;
    assert.equal(
      formatCurrentTime(new Date(`${date}T00:00:00+08:00`)),
      `${date} 00:00:00 星期${weekday}`,
    );
  }
});

test('纯格式化函数的默认日期在每次调用时读取', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-11-17T15:59:59Z') });
  assert.equal(formatCurrentTime(), '2026-11-17 23:59:59 星期二');
  t.mock.timers.setTime(Date.parse('2026-11-17T16:00:00Z'));
  assert.equal(formatCurrentTime(), '2026-11-18 00:00:00 星期三');
});

test('不同宿主 TZ 仍使用北京时间', () => {
  const moduleUrl = new URL('../lib/time.mjs', import.meta.url).href;
  const source = `import { formatCurrentTime } from ${JSON.stringify(moduleUrl)};
    process.stdout.write(formatCurrentTime(new Date('2026-11-17T16:00:00Z')));`;
  for (const timeZone of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo']) {
    const child = spawnSync(process.execPath, ['--input-type=module', '-e', source], {
      env: { ...process.env, TZ: timeZone },
      encoding: 'utf8',
      timeout: 10000,
    });
    assert.ifError(child.error);
    assert.equal(child.status, 0, child.stderr);
    assert.equal(child.stdout, '2026-11-18 00:00:00 星期三', timeZone);
  }
});
