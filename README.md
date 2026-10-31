# Tacto UI

轻量、原生的移动 Web UI 工具箱。

从 minizone、palmini 的移动产品实践中提炼的轻量 Web UI 工具箱，以原生 CSS 和 ES Modules 提供统一的视觉、交互与页面模式。

适合移动网页、WebView 应用、社区与内容产品：从按钮、表单到动态、评论、聊天气泡，按需组合出自己的界面。

**v1.0.0 · 零构建 · 零运行时依赖 · CSS 变量主题 · 可选交互模块 · MIT**

[快速开始](#快速开始) · [组件总览源码](index.html) · [组件文档](docs/COMPONENTS.md) · [行为 API](docs/BEHAVIORS.md) · [贡献指南](CONTRIBUTING.md)

## 项目特色

- **来自真实产品场景。** 提供资料头、动态与评论、会话行、语音条等常见移动界面模式，沿用一致的排版、间距和交互规则。
- **直接引入，按需组合。** 共享设计令牌与基础样式，每个组件独立成文件。无需打包器、CSS 预处理器或前端框架，静态服务器即可运行。
- **统一的视觉语言。** 实色内容区、轻量控制层、克制的动效；主题角色与通用尺度集中定义，局部几何尺寸留在组件中，方便理解和修改。
- **深浅色分别设计。** 独立定义表面、文字、强调色与操作背景；响应高对比度、减少透明度和减少动画偏好，玻璃效果提供实色降级。
- **交互按需接入。** 全局警告与确认弹窗一行调用，无需预写 HTML；对话框、底部面板、提示、分段控件、下拉和下拉刷新提供原生 JavaScript 模块，处理相应的焦点、键盘或手势行为。
- **移动端细节有据可循。** 提供安全区适配、键盘焦点环、原生控件语义与触控区域规范；主要操作采用 48px 目标，紧凑按钮 `--sm` 为 40px。

## 适用场景

- **独立开发者与小团队的移动网页：** 快速搭建表单、设置、个人中心等界面，并保持统一风格。
- **社区、内容与轻量聊天产品：** 复用动态、评论、用户行和对话等场景组合，减少重复编写界面样式。
- **WebView 应用与可交互原型：** 通过静态资源接入，在真实浏览器环境中验证页面与交互。
- **希望掌控界面实现的项目：** 直接使用 HTML、CSS 和 JavaScript，也可在现有框架中复用样式与 DOM 行为。

本项目提供界面和交互层。路由、数据请求、账号认证、业务表单校验，以及语音录制与播放等能力由接入项目实现。框架项目中，应在 DOM 挂载后初始化行为，并在卸载时调用对应的 `destroy()`；Toaster 使用 `clear()` 清理当前提示。

## 提供哪些内容

| 层级 | 代表内容 | 使用方式 |
| --- | --- | --- |
| 设计基础 | 颜色、排版、间距、深浅色、布局工具、焦点环 | 所有组件共享 `tokens/tokens.css` 与 `components/base.css` |
| 基础组件 | 按钮、字段、开关、列表、对话框、底部面板、轻提示 | 按需加载组件 CSS，交互组件再接入行为模块 |
| 场景组合 | 动态、评论、用户行、资料头、语音条、聊天气泡 | 按示例结构组合，并引入使用到的各组件样式 |
| 页面模板 | 桌面双栏 / 移动单栏登录页、统一子级页面 | 复用页面结构，接入自己的文案、校验和业务逻辑 |

## 快速开始

### 1. 在本地查看效果

本地预览需要 **Node.js 22+**。下载或克隆仓库后，在仓库根目录执行：

```bash
npm run dev
```

无需先运行 `npm install`。服务启动后打开以下地址：

| 页面 | 地址 | 可以看到什么 |
| --- | --- | --- |
| 组件总览 | [http://127.0.0.1:4173/](http://127.0.0.1:4173/) | 组件、变体、页面模板，可切换深浅色与跟随系统 |
| 组合示例 | [http://127.0.0.1:4173/test/components.html](http://127.0.0.1:4173/test/components.html) | 可操作的设置表单、内容互动，以及蓝色 / 紫色双品牌主题 |
| 行为验证 | [http://127.0.0.1:4173/test/behaviors.html](http://127.0.0.1:4173/test/behaviors.html) | 焦点、键盘、下拉提交与取消等行为断言 |
| 全局弹窗验证 | [http://127.0.0.1:4173/test/alerts.html](http://127.0.0.1:4173/test/alerts.html) | 确认结果、队列、关闭策略、焦点与长文案断言 |
| 子级页面示例 | [http://127.0.0.1:4173/pages/subpage.html](http://127.0.0.1:4173/pages/subpage.html) | 顶栏仅返回键和标题，正文直接展示可保存的设置表单 |

默认端口为 `4173`，可用 `npm run dev -- 4180` 指定其他端口。Node.js 仅用于本地工具；页面可部署到静态站点或集成到现有应用。

### 2. 运行第一个页面

在仓库根目录新建 `quickstart.html`，粘贴以下完整示例：

```html
<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>我的第一个 Tacto UI 页面</title>
  <link rel="stylesheet" href="./tokens/tokens.css">
  <link rel="stylesheet" href="./components/base.css">
  <link rel="stylesheet" href="./components/button.css">
  <link rel="stylesheet" href="./components/toast.css">
</head>
<body>
  <main class="ui-page ui-stack">
    <h1 class="ui-h1">你好，Tacto UI</h1>
    <p class="ui-muted">样式已加载，点击按钮体验第一段交互。</p>
    <div>
      <button class="ui-btn ui-btn--primary" id="notify" type="button">显示轻提示</button>
    </div>
  </main>
  <div class="ui-toast-region" id="toast-region"></div>

  <script type="module">
    import { createToaster } from './behaviors/toast.js';

    const toast = createToaster(document.querySelector('#toast-region'));
    document.querySelector('#notify').addEventListener('click', () => {
      toast.show('接入成功', { type: 'success' });
    });
  </script>
</body>
</html>
```

保持本地服务运行，打开 [http://127.0.0.1:4173/quickstart.html](http://127.0.0.1:4173/quickstart.html)。看到带样式的主按钮，点击后出现「接入成功」，就完成了样式与行为层的接入。

行为模块使用 ES Modules，需通过 HTTP 访问。直接双击 HTML 以 `file://` 打开时，浏览器会拦截模块加载。

### 3. 接入自己的项目

将 `tokens/`、`components/` 和需要的 `behaviors/` 模块复制到项目的静态资源目录，保留相对结构，再按页面位置调整上例的 `href` 与 `import` 路径。使用登录模板时一并复制 `pages/`。

加载顺序为 **设计令牌 → 基础样式 → 需要的组件样式 → 自定义主题与页面样式**。例如，按钮只需 `button.css`；上例的轻提示还需 `toast.css` 和 `toast.js`。每个组件的结构与依赖见[组件文档](docs/COMPONENTS.md)。

`base.css` 包含全局重置与基础排版；接入已有站点时，先确认这些规则与现有样式的关系。`index.html` 中的内联 CSS 仅服务于组件展示页，接入时使用组件自己的文件。

纯样式组件无需初始化。需要交互时，可像上例一样直接导入单个模块，也可从 `behaviors/index.js` 按名称导入：`alert`、`confirm`、`createDialog`、`createSheet`、`createToaster`、`createSegmented`、`createSelect`、`createPullRefresh`。各模块所需的 HTML、参数和清理方式见[行为 API](docs/BEHAVIORS.md)。

### 全局警告与确认弹窗

先按上述顺序加载 `tokens.css`、`base.css`、`button.css` 和 `dialog.css`，然后在任意页面调用，无需额外 HTML：

```js
import { alert as showAlert, confirm as showConfirm } from './behaviors/index.js';

await showAlert('请检查配置后再继续。');

const confirmed = await showConfirm({
  type: 'danger',
  title: '删除这条记录？',
  message: '删除后无法恢复。',
  confirmText: '删除记录',
});
if (confirmed) {
  // 在这里执行删除操作。
}
```

支持提示、成功、警告、错误与危险操作五种状态，连续调用依次显示。确认返回 `true`，取消 / Esc 返回 `false`，默认点击遮罩不关闭；关闭后自动清理并归还焦点。更多选项见[全局弹窗 API](docs/BEHAVIORS.md#alert--confirm-全局通用弹窗)。

### 统一子级页面

子级页面遵循固定结构：**顶栏只有返回键与标题，内容区不再出现标题块**。设置、编辑等操作直接放在正文中，保存按钮也放在正文。

复制 [`pages/subpage.html`](pages/subpage.html) 与 [`pages/subpage.css`](pages/subpage.css)，按文件中的顺序加载令牌、基础样式、所用组件和页面样式。顶栏使用 `page-header.css` 的 `.ui-sub-header`，页面外层为 `.ui-subpage`、正文为 `.ui-subpage__content`；调整返回链接为实际父级地址，再替换表单内容即可。

示例包含可用的返回链接、开关、本地保存与失败反馈，并支持系统主题和 `?theme=light|dark`。完整约束见[子级页面规范](docs/DESIGN.md#13-子级页面)，可复制的最小 HTML 见[页头组件](docs/COMPONENTS.md#pageheader-页头)。

## 切换主题与定制品牌

深浅色通过 `<html>` 的 `data-theme` 属性驱动：

```js
document.documentElement.dataset.theme = 'dark'; // 'light' 为浅色
```

需要跟随系统时，在应用入口同步该属性：

```js
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const syncTheme = () => {
  document.documentElement.dataset.theme = systemTheme.matches ? 'dark' : 'light';
};
syncTheme();
systemTheme.addEventListener('change', syncTheme);
```

自定义品牌时，在后加载的主题文件中覆盖语义令牌：

- `--accent` / `--accent-deep` / `--accent-soft`：链接、图标、强调文字及柔和底色。
- `--action-bg` / `--action-bg-hover` / `--text-on-accent`：主按钮、发出消息等实色区域的背景与文字。
- `--bg-page` / `--bg-card` / `--text-primary`：页面、表面与正文层级。

浅色和 `html[data-theme='dark']` 两种状态都应定义并验证。蓝色 / 紫色品牌的完整覆盖示例见 [`test/components.html`](test/components.html)；深色角色与对比度规则见[设计规范第 12 章](docs/DESIGN.md#12-深色模式)。

## 文档与目录

| 想做什么 | 从这里开始 |
| --- | --- |
| 找到组件结构、类名、变体与状态 | [组件文档](docs/COMPONENTS.md) |
| 接入键盘、焦点、手势与生命周期 | [行为 API](docs/BEHAVIORS.md) |
| 修改颜色、排版、玻璃与动效规则 | [设计规范](docs/DESIGN.md) |
| 查看多个组件共用样式与主题的实例 | [组合示例源码](test/components.html) |
| 接入只在顶栏显示标题的子级页面 | [子级页面规范](docs/DESIGN.md#13-子级页面) / [完整示例](pages/subpage.html) |
| 了解版本变化与升级事项 | [更新日志](CHANGELOG.md) |
| 报告问题或贡献改进 | [贡献指南](CONTRIBUTING.md) |

```text
tokens/tokens.css       设计令牌与深浅色角色
components/base.css     基础重置、排版、布局工具与焦点环
components/*.css        按组件拆分的样式
behaviors/*.js          可选交互模块，index.js 为统一导出入口
pages/login.css         登录页模板
pages/subpage.html      子级页完整示例（通知设置）
pages/subpage.css       子级页正文与安全区布局
docs/                   设计规范、组件文档、行为 API
test/                   行为断言与真实 CSS 组合验证
scripts/                本地预览与静态自检工具
index.html              组件总览与规范页
```

## 设计原则

1. **内容实，控件轻。** 内容区用实色卡加柔和阴影；玻璃只给导航、悬浮按钮和弹层。
2. **颜色有语义。** 组件只引用 `--text-primary` 这类语义变量，不直接写色值。换肤只改令牌层。
3. **状态双通道。** 错误、选中、禁用都同时用颜色和形状或文字表达，不单靠颜色。
4. **动效短而克制。** 140–300ms，主曲线快出缓停。按压用缩放，不用变色。
5. **能交给浏览器就不自己写。** 对话框、开关、焦点管理优先用原生元素。

详见 [`docs/DESIGN.md`](docs/DESIGN.md)。

## 验证与贡献

```bash
npm run check
npm run dev
```

`check` 检查文件引用、CSS 基础规则、深色令牌覆盖，以及模块和测试页脚本语法。运行本地服务后，再在浏览器中打开：

- [`test/behaviors.html`](test/behaviors.html)：焦点归还、滚动锁定、提示替换、键盘切换、下拉提交与取消等行为断言。
- [`test/alerts.html`](test/alerts.html)：全局警告 / 确认的返回结果、队列、焦点、滚动锁、关闭策略与纯文本安全断言。
- [`test/subpage.html`](test/subpage.html)：真实窄屏 / 宽屏视口中的顶栏结构、正文无标题、居中、安全区、长文案与设置保存断言。
- [`test/components.html`](test/components.html)：使用真实 CSS 验证双品牌深浅色文字对比度、点击范围、布局隔离与表单行为，并提供可操作的组合示例。

四页均以标题 `ALL_PASS` 为通过标志。静态自检与这些断言覆盖的具体项目见[贡献指南](CONTRIBUTING.md)；接入项目仍需验证自己的文案、内容和目标设备。

欢迎带着实际页面中的问题来改进组件、示例和文档。提交前请阅读[贡献指南](CONTRIBUTING.md)，并在[更新日志](CHANGELOG.md)的「未发布」部分记录变更。

### 升级到 v1.0.0

v1.0.0 的接口调整详见[更新日志](CHANGELOG.md)，接入时留意：

- 横向布局工具使用 `.ui-cluster` / `.ui-cluster--between`；`.ui-row` 用于列表导航行。
- 自定义主题同时设置强调色和 `--action-bg` / `--action-bg-hover`，分别验证文字与实色背景的对比度。
- Select 初始化不触发 `onChange`，回调仅在提交值改变时触发；读取初始值请使用实例的 `.value`。

## 浏览器支持

面向支持 CSS 自定义属性、ES Modules、`<dialog>` 与 `dvh` 单位的现代浏览器：

- Chrome / Edge 105+
- Safari 15.4+
- Firefox 121+

玻璃效果使用 `backdrop-filter`，不支持时自动降级为实色。WebView 的实际兼容性取决于宿主使用的浏览器内核版本。

## 许可

[MIT](LICENSE)
