# Tacto UI 贡献指南

感谢你愿意改进这套组件库。

## 提交前

```bash
npm run check
```

自检验证文件引用、CSS 基础规则、深色令牌覆盖、模块与测试页脚本语法。它不执行浏览器行为或布局断言；语法通过不等于交互通过。

改动 `behaviors/` 后，还要在浏览器里跑一遍行为断言：

```bash
npm run dev
# 分别打开 /test/behaviors.html、/test/components.html、/test/alerts.html，标题都变成 ALL_PASS 才算通过
```

## 改动约定

**新增颜色、间距、圆角时**，先加到 `tokens/tokens.css`，再在组件里引用。不要在组件里写 `#2368f5` 或 `margin: 13px`。

**新增组件时**：

1. 在 `components/` 下建一个独立文件，只依赖令牌层，不依赖其他组件
2. 在 `index.html` 加一个 `<section class="spec-section">`，包含说明、变体演示、状态演示
3. 在 `docs/COMPONENTS.md` 补类名表格
4. 在 `docs/DESIGN.md` 补相关规范（如果引入了新的设计决策）
5. 在 `CHANGELOG.md` 的「未发布」段落记一行

**深色模式**必须同步验证。每个组件在 `html[data-theme='dark']` 下都要能看清。

**命名边界：** `.ui-cluster` 是布局工具，`.ui-row` 是列表导航行，两者不能共用选择器。修改主题时同时验证强调文字与实色背景上的文字，勿用同一个颜色承担相反的对比度需求。

## 代码风格

- 类名 `ui-` 前缀，修饰符用 `--`，状态类用 `.is-`
- 缩进两个空格，CSS 属性顺序：定位 → 盒模型 → 排版 → 视觉 → 动效
- 注释用中文，说明「为什么」而不是「是什么」
- 不引入构建工具、不引入运行时依赖

## 无障碍

- 触控目标不小于 48×48px
- 图标按钮必须有 `aria-label`
- 颜色不能是唯一的状态表达方式
- 新增交互组件时，用键盘完整走一遍

## 提交信息

```
feat(button): 新增 --loading 变体
fix(sheet): 修正 iOS 安全区下的底部留白
docs(design): 补充动效时长规范
```

类型用 `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore`。

## 许可

提交的代码将以 MIT 许可发布。
