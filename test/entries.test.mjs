import test from 'node:test';
import assert from 'node:assert/strict';
import aurabot from '../index.mjs';
import { CURRENT_TIME_DESCRIPTION } from '../lib/time.mjs';

test('Aurabot 通过 defineTool 与 tool 注册空参数工具，默认 renderer 可读取实时 message', async (t) => {
  const defined = [];
  const registered = [];
  aurabot.setup({
    defineTool(definition) {
      const wrapped = { definition };
      defined.push(wrapped);
      return wrapped;
    },
    tool(wrapped) {
      registered.push(wrapped);
    },
  });
  assert.equal(defined.length, 1);
  assert.equal(registered.length, 1);
  assert.strictEqual(registered[0], defined[0]);
  const tool = defined[0].definition;
  assert.equal(tool.name, 'get_current_time');
  assert.equal(tool.description, CURRENT_TIME_DESCRIPTION);
  assert.deepEqual(tool.properties, {});
  assert.deepEqual(tool.required, []);
  assert.deepEqual(Object.keys(tool).sort(), ['description', 'execute', 'name', 'properties', 'required']);
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-11-17T16:47:12Z') });
  assert.deepEqual(await tool.execute({}), {
    ok: true, message: '2026-11-18 00:47:12 星期三',
  });
  t.mock.timers.setTime(Date.parse('2026-11-17T16:47:13Z'));
  assert.deepEqual(await tool.execute({}), {
    ok: true, message: '2026-11-18 00:47:13 星期三',
  });
});
