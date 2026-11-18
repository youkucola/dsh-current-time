import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import aurabot from '../index.mjs';

const root = new URL('../', import.meta.url);

test('package、Aurabot 单入口与 module 元数据一致', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  const module = JSON.parse(await readFile(new URL('module.json', root), 'utf8'));
  assert.equal(pkg.name, 'dsh-current-time');
  assert.equal(pkg.version, '1.0.0');
  assert.equal(pkg.description, '实时获取北京时间的 Aurabot 工具插件。');
  assert.equal(pkg.author, 'youkucola');
  assert.equal(pkg.license, 'MIT');
  assert.equal(pkg.type, 'module');
  assert.equal(pkg.engines.node, '>=22.13.0');
  assert.equal(pkg.main, './index.mjs');
  assert.deepEqual(pkg.exports, {
    '.': './index.mjs',
    './index.mjs': './index.mjs',
    './module.json': './module.json',
    './package.json': './package.json',
  });
  assert.equal(pkg.dsh?.bundle, undefined);
  assert.equal(pkg.scripts.test, 'node --test "test/*.test.mjs"');
  assert.deepEqual(pkg.dependencies ?? {}, {});
  assert.deepEqual(pkg.devDependencies ?? {}, {});
  assert.equal(module.id, pkg.name);
  assert.equal(module.version, pkg.version);
  assert.equal(module.author, pkg.author);
  assert.equal(module.license, pkg.license);
  assert.equal(module.category, 'tool');
  assert.equal(module.minPluginVersion, '1.2.1');
  assert.deepEqual(module.requires, []);
  assert.deepEqual(module.capabilities, []);
  assert.deepEqual(
    { id: aurabot.id, name: aurabot.name, version: aurabot.version, api: aurabot.api },
    { id: module.id, name: module.name, version: module.version, api: module.api },
  );
  assert.equal(aurabot.name, '当前时间');
  assert.equal(aurabot.api, 1);
  assert.equal(module.id, root.pathname.split('/').filter(Boolean).at(-1));
});

test('发布文件仅包含 Aurabot 运行文件，移除兼容入口和配置', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  const files = ['lib/time.mjs', 'index.mjs', 'module.json', 'LICENSE'];
  assert.deepEqual(pkg.files, files);
  for (const file of files) await access(new URL(file, root));
  await assert.rejects(access(new URL('src/index.js', root)), { code: 'ENOENT' });
  await assert.rejects(access(new URL('cordis.patch.yml', root)), { code: 'ENOENT' });
  const license = await readFile(new URL('LICENSE', root), 'utf8');
  assert.match(license, /^MIT License\n/);
  assert.match(license, /Copyright \(c\) 2026 youkucola/);
});
