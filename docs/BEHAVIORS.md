# Tacto UI 行为层 API

纯 CSS 组件解决「长什么样」，`behaviors/` 解决「怎么动、怎么响应键盘」。

每个模块无依赖，可以单独 import：

```js
import { createDialog, createSheet, createToaster, createSegmented, createSelect, createPullRefresh } from './behaviors/index.js';
```

带事件监听的工厂函数返回 `destroy()` 用于解绑；Toaster 使用 `clear()` 清理当前提示。弹层重复调用 `open()` 不会出错。

---

## createDialog

原生 `<dialog>` 已经提供焦点陷阱和 Esc 关闭，这个模块只补三件浏览器不做的事：记录触发元素并在关闭后归还焦点、点遮罩关闭、统一处理 `[data-close]`。

```js
const dialog = createDialog(el, {
  onOpen: (el) => {},
  onClose: (el, returnValue) => {},
});

dialog.open(triggerButton);   // 省略参数则用当前焦点元素
dialog.close('confirm');      // 传入的值可从 el.returnValue 读到
dialog.isOpen;                // 只读
dialog.destroy();
```

| 选项 | 说明 |
|---|---|
| `onOpen(el)` | 打开后调用 |
| `onClose(el, returnValue)` | 关闭后调用，此时焦点已归还 |

**注意：** `close` 事件是异步派发的，焦点归还发生在下一拍。要在关闭后立即做判断，请等一个宏任务。

---

## createSheet

自绘的底部面板需要手动处理滚动锁定、焦点陷阱和关闭手势。

```js
const sheet = createSheet(el, {
  backdrop: backdropEl,
  dismissible: true,
  onOpen: () => {},
  onClose: () => {},
});

sheet.open(triggerButton);
sheet.close();
```

| 选项 | 默认 | 说明 |
|---|---|---|
| `backdrop` | — | 遮罩元素，点击即关闭 |
| `dismissible` | `true` | 是否允许下滑关闭 |
| `onOpen` / `onClose` | — | 生命周期回调 |

**关闭方式四种：** 点遮罩、按 Esc、点 `[data-close-sheet]`、从把手或标题区域下滑。

**下滑关闭：** 位移超过 96px，或速度超过 0.5px/ms（快速轻扫）即关闭，否则回弹。只从 `.ui-sheet__grabber` 或 `.ui-sheet__title` 起手，避免和内容滚动打架。

**滚动锁定：** 内部用引用计数，两个面板先后打开时不会提前解锁。

---

## createToaster

同一时刻只显示一个提示，新提示替换旧提示而不是排队。

```js
const toast = createToaster(regionEl, { duration: 2400 });

toast.show('已保存', { type: 'success' });
toast.show('请求失败', { type: 'error', timeout: 4000 });
toast.clear();
```

| 参数 | 默认 | 说明 |
|---|---|---|
| `text` | — | 提示文案，按**纯文本**插入 |
| `type` | `'plain'` | `plain` / `success` / `error` |
| `icon` | `''` | 图标 SVG 字符串，来自开发者 |
| `timeout` | `2400` | 自动关闭毫秒数，`0` 表示不自动关闭 |

**安全：** 文案走 `textContent`，即使用户输入里带 `<script>` 也只会显示成文字。`icon` 走 `innerHTML`，因此只应传开发者可控的 SVG。

**播报：** `error` 用 `role="alert"`，其余用 `role="status"`。不要给两者都加 `aria-live="assertive"`。

---

## createSegmented

补齐 WAI-ARIA Tabs 要求的键盘交互。只负责选中态与焦点，内容切换交给 `onChange`。

```js
const seg = createSegmented(el, {
  initial: 0,
  onChange: (index, item) => {},
});

seg.select(2);
seg.index;    // 只读
seg.item;     // 当前选中项
```

**键盘：** `←` `→` 切换并循环，`Home` / `End` 跳到首尾。

**roving tabindex：** 整组只有一个 Tab 停靠点（当前选中项），进入后用方向键移动。这是 ARIA Tabs 的标准做法，避免用户要按多次 Tab 才能穿过一整排标签。

---

## createSelect

原生 `<select>` 的弹层无法定制，这里用按钮 + 列表实现，但按 combobox 模式保留完整键盘操作。焦点始终留在触发器上，用 `aria-activedescendant` 指向当前项——移动端不会出现键盘弹起又收起。

```js
const select = createSelect(el, {
  onChange: (value, option) => {},
});

select.value;          // 当前值，取自选项的 data-value
select.setValue('pro');
select.isOpen;
```

**键盘：** `↓` `↑` 移动，`Enter` / `Space` 选中，`Esc` 关闭，`Home` / `End` 跳首尾，`Tab` 关闭。

**值与事件：** 方向键只移动活动项，不改变 `.value`、显示标签或 `aria-selected`。Enter / Space、点击选项或有效的 `setValue()` 才提交；Esc、Tab、点击外部关闭时丢弃未确认的浏览，重开从已提交项开始。`onChange` 仅在提交值改变时触发，初始化和重复设置相同值均不通知。

**语义与多实例：** 行为层补齐 combobox / listbox、`aria-controls`、唯一 ID 和选项的 `tabindex="-1"`；接入方仍须给触发器提供 `aria-label` 或可见标签的 `aria-labelledby`。禁用选项使用原生 `disabled` 或 `aria-disabled="true"`，键盘与程序设值均跳过它们。`destroy()` 会先关闭菜单，再解绑事件。

**定位：** 下方空间不足时自动加 `.is-up` 改为向上展开，不需要手动计算。

**关闭：** 点击外部（`pointerdown` 捕获阶段）关闭，不会误触发页面上的其他点击。

---

## createPullRefresh

只在滚动容器位于顶部时接管纵向手势，其余情况交还原生滚动。

```js
const refresh = createPullRefresh({
  scroller: document.querySelector('#scroll'),
  indicator: document.querySelector('.ui-refresh'),
  onRefresh: async () => { await load(); },
  threshold: 64,
});
```

| 选项 | 默认 | 说明 |
|---|---|---|
| `scroller` | — | 滚动容器 |
| `indicator` | — | 指示器元素，状态写在 `data-state` |
| `onRefresh` | — | 返回 Promise 的刷新函数 |
| `threshold` | `64` | 触发刷新的下拉距离 |

**状态机：** `idle → pulling → ready → loading → idle`。达到阈值时文案变「松手刷新」，指示器翻转 180°。

**手势边界：** 只有 `scrollTop === 0` 且向下拉时才接管；一旦检测到向上滑立即交还原生滚动，否则页面会卡住。

**阻尼：** 实际位移 = 手指位移 × 0.55，上限 96px。松手时若达到阈值触发刷新，否则回弹。

**触感：** 触发刷新时调用 `navigator.vibrate(8)`，不支持的环境静默跳过。

---

## focus.js 工具

弹层组件的底层能力，也可以单独用。

```js
import { getFocusable, focusFirst, lockScroll, trapFocus } from './behaviors/focus.js';
```

| 函数 | 说明 |
|---|---|
| `getFocusable(container)` | 取出容器内当前可聚焦元素，过滤不可见项 |
| `focusFirst(container)` | 聚焦第一个可聚焦元素，没有则让容器自身获得焦点 |
| `lockScroll()` | 锁定页面滚动，返回释放函数；支持嵌套 |
| `trapFocus(container)` | 在容器内循环 Tab 焦点，返回解绑函数 |

`trapFocus` 用于自绘弹层。原生 `<dialog>` 自带陷阱，不要重复套。

---

## 浏览器测试

`test/behaviors.html` 是一组无依赖的浏览器断言，覆盖焦点归还、滚动锁定引用计数、提示替换、键盘切换，以及下拉框的浏览 / 提交 / 取消、多实例、禁用选项和销毁等行为。

`test/components.html` 加载真实组件 CSS，验证蓝色 / 紫色两套品牌的深浅色文字对比度、48px 点击区域、列表与布局工具隔离，以及表单内下拉按钮不会误提交。它同时是可操作的组合示例。

```bash
npm run dev            # 起静态服务器
# 打开 http://localhost:4173/test/behaviors.html
```

页面标题会变成 `ALL_PASS` 或 `FAILED`，结果同时打印在页面上。改动行为层后跑一遍再提交。
