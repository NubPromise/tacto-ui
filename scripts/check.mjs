// 轻量自检：不引入任何依赖。
// 1) index.html 引用的 CSS 文件与 JS 模块是否存在
// 2) 组件层是否出现裸十六进制色值（设计规范：组件只引用语义令牌）
// 3) CSS 花括号是否配对
// 4) behaviors 下的模块语法是否合法
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const problems = [];

const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const htmlFiles = ['index.html', ...readdirSync(path.join(root, 'test')).filter((name) => name.endsWith('.html')).map((name) => `test/${name}`)];

// —— 1. 样式文件齐全 ——
for (const [, href] of html.matchAll(/<link[^>]+href="\.\/([^"]+\.css)"/g)) {
  if (!existsSync(path.join(root, href))) problems.push(`缺少样式文件：${href}`);
}

// —— 2. 模块引用可解析 ——
for (const [, spec] of html.matchAll(/from\s+'(\.[^']+\.js)'/g)) {
  const target = path.resolve(root, spec);
  if (!existsSync(target)) problems.push(`index.html 引用了不存在的模块：${spec}`);
}

// 测试页也属于交付：检查相对引用和内联脚本语法，运行时断言仍需在浏览器执行。
for (const file of htmlFiles) {
  const source = readFileSync(path.join(root, file), 'utf8');
  for (const [, relative] of source.matchAll(/(?:href|src)="(\.[^"]+\.(?:css|js))"/g)) {
    if (relative && !existsSync(path.resolve(root, path.dirname(file), relative))) problems.push(`${file} 缺少引用：${relative}`);
  }
  for (const match of source.matchAll(/from\s+'(\.[^']+\.js)'/g)) {
    if (!existsSync(path.resolve(root, path.dirname(file), match[1]))) problems.push(`${file} 缺少模块：${match[1]}`);
  }
  for (const [, script] of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      execFileSync(process.execPath, ['--check', '--input-type=module'], { input: script, stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (error) {
      problems.push(`${file} 内联脚本语法错误：${String(error.stderr || error.message).trim()}`);
    }
  }
}

// —— 3/4. 组件层规则 + 语法 ——
const styleDirs = ['components', 'pages'];
for (const dir of styleDirs) {
 const componentDir = path.join(root, dir);
 for (const name of readdirSync(componentDir).filter((f) => f.endsWith('.css'))) {
  const css = readFileSync(path.join(componentDir, name), 'utf8');

  const open = (css.match(/{/g) || []).length;
  const close = (css.match(/}/g) || []).length;
  if (open !== close) problems.push(`${dir}/${name}：花括号不配对（{ ${open} / } ${close}）`);

  // 允许纯白与纯黑，其余色值必须走令牌
  const hex = css.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const disallowed = hex.filter((v) => !['#fff', '#ffffff', '#000', '#000000'].includes(v.toLowerCase()));
  if (disallowed.length) problems.push(`${dir}/${name}：出现裸色值 ${[...new Set(disallowed)].join(', ')}`);
 }
}

const behaviorDir = path.join(root, 'behaviors');
for (const name of readdirSync(behaviorDir).filter((f) => f.endsWith('.js'))) {
  try {
    execFileSync(process.execPath, ['--check', path.join(behaviorDir, name)], { stdio: 'pipe' });
  } catch (error) {
    problems.push(`behaviors/${name}：语法错误\n${String(error.stderr || error.message).trim()}`);
  }
}


// —— 5. 深色模式覆盖：字面色值令牌必须有对应的深色值 ——
// 别名（var(--x)）不需要，因为被指向的令牌会自己覆盖。
// 有意在两个主题下保持不变的常量列在 ALLOW 里。
const ALLOW_SHARED = new Set(['--text-on-accent', '--on-dark-success', '--on-dark-error', '--glass-blur']);
const tokensCss = readFileSync(path.join(root, 'tokens/tokens.css'), 'utf8');

const blockOf = (startMarker) => {
  const start = tokensCss.indexOf(startMarker);
  if (start === -1) return '';
  const end = tokensCss.indexOf('\n}', start);
  return tokensCss.slice(start, end);
};

const tokenEntries = (block) => {
  const map = new Map();
  for (const [, name, value] of block.matchAll(/^\s+(--[a-z0-9-]+):\s*([^;]+);/gm)) {
    map.set(name, value.trim());
  }
  return map;
};

const lightTokens = tokenEntries(blockOf(':root {'));
const darkTokens = tokenEntries(blockOf("html[data-theme='dark']"));
// 含 var() 的值是派生值，会跟随被指向的令牌自动切换主题
const isLiteralColor = (value) => !value.includes('var(') && /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|linear-gradient\()/i.test(value);

for (const [name, value] of lightTokens) {
  if (!isLiteralColor(value)) continue;      // 别名或非颜色值，跳过
  if (ALLOW_SHARED.has(name)) continue;      // 有意共用
  if (!darkTokens.has(name)) {
    problems.push(`tokens：${name} 是字面色值但缺少深色覆盖（浅色 ${value}）`);
  }
}

if (problems.length) {
  console.error('自检未通过：\n  - ' + problems.join('\n  - '));
  process.exit(1);
}
console.log('自检通过：样式与模块齐全、CSS 基础规则及深色覆盖通过、模块与测试页语法合法。浏览器断言请另行运行。');
