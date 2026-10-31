# Tacto UI 组件清单

共享 `tokens/tokens.css` 与 `components/base.css`，其他样式按需引入。场景组合会用到头像、徽标、按钮等基础组件，请按 HTML 中实际使用的类引入对应文件。

类名统一 `ui-` 前缀，采用 BEM 风格修饰符（`--variant`）与状态类（`.is-*`）。

分层：基础组件用于跨业务组合；Feed / Comment / UserList / ProfileHeader / Voice / Bubble 是可选场景组合；`pages/` 保存页面模板。样式不包含网络请求、音频播放或业务路由。

---

## Button 按钮

`components/button.css`

| 类名 | 说明 |
|---|---|
| `.ui-btn` | 基础按钮（次级样式） |
| `.ui-btn--primary` | 主按钮，一屏内只允许一个 |
| `.ui-btn--ghost` | 幽灵按钮，无底色 |
| `.ui-btn--danger` | 危险操作 |
| `.ui-btn--sm` / `--lg` | 40px / 52px 高度 |
| `.ui-btn--block` | 整宽 |
| `.ui-btn--icon` | 正方形图标按钮，必须有 `aria-label` |
| `.ui-btn-group` | 贴合按钮组 |
| `.is-loading` | 加载态，配 `aria-busy="true"` |

状态：`:hover` `:active` `:disabled` `[aria-pressed]`

---

## Field 表单字段

`components/field.css`

| 类名 | 说明 |
|---|---|
| `.ui-field` | 字段容器（`<label>`） |
| `.ui-field__label` | 标签，必须可见 |
| `.ui-field__input` / `__select` / `__textarea` | 控件本体 |
| `.ui-field__hint` | 说明文字 |
| `.ui-field__error` | 错误文字，`role="alert"`，有内容时自动显示 |
| `.ui-field__wrap` / `__affix` | 带尾部按钮的输入框 |
| `.ui-field.is-invalid` / `.is-valid` | 校验状态 |
| `.ui-choice` | 勾选行 |

约束：高度 ≥ 48px，字号 ≥ 16px。

---

## Card 卡片

`components/card.css`

| 类名 | 说明 |
|---|---|
| `.ui-card` | 基础卡片 |
| `.ui-card--soft` | 柔和底，无阴影 |
| `.ui-card--glass` | 玻璃卡，仅用于浮层 |
| `.ui-card--flat` | 去阴影 |
| `.ui-card--accent` | 左侧色条强调 |
| `.ui-card--pressable` | 可点击，整块为链接 |
| `.ui-card--sm` / `--lg` | 紧凑 / 大型 |
| `.ui-card__head` / `__title` / `__extra` / `__body` / `__foot` | 内部结构 |
| `.ui-metric` / `__value` / `__label` | 指标块 |
| `.ui-progress` / `__bar` | 进度条 |
| `.ui-alert` | 提示条，`--success` `--warning` `--error` |

---

## List 列表

`components/list.css`

| 类名 | 说明 |
|---|---|
| `.ui-list` | 卡片式列表容器 |
| `.ui-list--plain` | 无背景无阴影 |
| `.ui-list-label` | 分组标题 |
| `.ui-row` | 导航行，整行可点 |
| `.ui-row__mark` | 行首图标块 |
| `.ui-row__copy` | 主文案 + 辅助说明 |
| `.ui-row__value` | 行尾值 |
| `.ui-row__arrow` | 跳转箭头，只在真跳转时出现 |
| `.ui-row--danger` | 危险行 |
| `.ui-kv` | 键值详情 |

---

## Badge 徽标

`components/badge.css`

| 类名 | 说明 |
|---|---|
| `.ui-badge` | 基础徽标 |
| `.ui-badge--accent` / `--success` / `--warning` / `--error` | 语义变体 |
| `.ui-badge--outline` | 描边 |
| `.ui-badge--sm` | 小号 |
| `.ui-badge--dot` | 纯圆点 |
| `.ui-badge-count` | 计数角标 |

文字必须自带语义，不能只靠颜色区分状态。

---

## Avatar 头像

`components/avatar.css`

| 类名 | 说明 |
|---|---|
| `.ui-avatar` | 40px 圆形 |
| `.ui-avatar--xs` / `--md` / `--lg` / `--xl` | 24 / 48 / 64 / 88px |
| `.ui-avatar--square` | 圆角矩形 |
| `[data-tone]` | 兜底底色：`blue` `mint` `peach` `violet` |
| `.ui-avatar-wrap` / `__status` | 带在线状态 |
| `.ui-avatar-group` | 叠放组 |

无图时用首字母兜底，底色按语义分组，不用随机色。

---

## Switch 开关

`components/switch.css`

| 类名 | 说明 |
|---|---|
| `.ui-switch` | 开关容器 |
| `.ui-switch__track` | 轨道 |
| `.ui-switch-row` | 带说明的开关行 |

结构：`<label class="ui-switch"><input type="checkbox" role="switch" aria-label="自动同步"><span class="ui-switch__track" aria-hidden="true"></span></label>`

必须用原生 `checkbox` + `role="switch"`，保留键盘与播报行为。

视觉轨道保持 50×30px，外层点击区域至少 50×48px。带说明的整行使用 `<label class="ui-switch-row">`，内部开关容器改用 `<span class="ui-switch">`，避免嵌套 label；通过 `aria-labelledby` 关联可见标题，`aria-describedby` 关联说明。见总览页可复制示例。

---

## Segmented 分段控件

`components/segmented.css`

| 类名 | 说明 |
|---|---|
| `.ui-seg` | 分段容器，`role="tablist"` |
| `.ui-seg__item` | 分段项，`role="tab"` + `aria-selected` |
| `.ui-seg--sm` | 紧凑版 |
| `.ui-tabs` / `__item` | 可滚动标签栏，超过 5 段时用 |

---

## Dialog 对话框

`components/dialog.css`

| 类名 | 说明 |
|---|---|
| `.ui-dialog` | 基于原生 `<dialog>`，用 `showModal()` 打开 |
| `.ui-dialog__title` / `__body` / `__actions` | 结构 |
| `.ui-dialog__actions--stack` | 纵向堆叠（超过两个操作时） |
| `.ui-dialog__form` | 表单型内容 |
| `.ui-dialog--alert` / `.ui-dialog__status` | 全局通用提示 / 确认及状态图标，由行为层自动创建 |

危险操作：主按钮换 `--danger`，默认焦点放「取消」。

全局调用使用 `behaviors/alert.js` 的 `alert()` / `confirm()`，支持 `info`、`success`、`warning`、`error`、`danger`。依赖 `button.css` 与 `dialog.css`，无需预写 HTML；完整参数与返回值见[行为 API](BEHAVIORS.md#alert--confirm-全局通用弹窗)。

---

## Sheet 底部面板

`components/sheet.css`

| 类名 | 说明 |
|---|---|
| `.ui-sheet` | 面板本体 |
| `.ui-sheet-backdrop` | 遮罩 |
| `.ui-sheet__grabber` / `__title` / `__body` / `__foot` | 结构 |
| `.ui-actions` / `__item` / `__item--danger` / `__cancel` | 操作表 |

三种关闭方式缺一不可：点遮罩、按 Esc、下滑把手。

---

## Toast 轻提示

`components/toast.css`

| 类名 | 说明 |
|---|---|
| `.ui-toast-region` | 固定定位容器 |
| `.ui-toast` | 提示本体，`role="status"` |
| `.ui-toast--success` / `--error` | 语义变体 |
| `.is-leaving` | 离场动画 |
| `.ui-banner` | 顶部横幅式提示 |

停留 2.4 秒；同一时刻只显示一个，新提示替换旧提示。

---

## Dock 导航

`components/dock.css`

| 类名 | 说明 |
|---|---|
| `.ui-dock` | 底部胶囊导航 |
| `.ui-dock__item` | 导航项，选中用 `aria-current="page"` |
| `.ui-dock__item--primary` | 中央凸起主操作 |
| `.ui-dock__icon` / `__label` | 图标与文字 |
| `.ui-topbar` / `__title` / `__action` | 顶部栏 |

3–5 项；页面底部要留 `--dock-h` 的滚动余量。

---

## Bubble 对话气泡

`components/bubble.css`

| 类名 | 说明 |
|---|---|
| `.ui-bubbles` | 消息列表容器 |
| `.ui-bubble` | 单条消息 |
| `.ui-bubble--in` / `--out` | 对方（左）/ 自己（右） |
| `.ui-bubble__content` / `__text` / `__time` / `__avatar` | 结构 |
| `.ui-composer` / `__input` / `__send` | 输入区 |
| `.ui-typing` | 打字指示器 |

单条最大宽度 78%；连续同人消息只在末条显示时间与头像。

---

## Skeleton 骨架与空状态

`components/skeleton.css`

| 类名 | 说明 |
|---|---|
| `.ui-skeleton` | 骨架块 |
| `.ui-skeleton--text` / `--title` / `--line` / `--avatar` / `--thumb` / `--card` | 形状 |
| `.ui-skeleton-card` / `__body` | 骨架卡片组合 |
| `.ui-empty` / `__icon` / `__title` / `__desc` | 空状态 |
| `.ui-loadbar` | 顶部 2px 刷新进度条 |

骨架只用于首次加载；刷新用 `.ui-loadbar`，不要整页骨架。

---

## Base 基础

`components/base.css`

| 类名 | 说明 |
|---|---|
| `.ui-h1` ~ `.ui-h4` | 标题层级 |
| `.ui-body` / `.ui-small` / `.ui-meta` | 文本层级 |
| `.ui-muted` / `.ui-faint` / `.ui-num` | 文本工具 |
| `.ui-glass` / `--float` / `--surface` | 玻璃容器三档 |
| `.ui-stack` / `.ui-cluster` / `.ui-cluster--between` | 纵向 / 横向 / 两端对齐布局工具 |
| `.ui-page` | 页面容器（含安全区与底部留白） |
| `.ui-sr-only` | 屏幕阅读器专用 |
| `.ui-skip` | 跳转链接 |

---

## Select 下拉选择

`components/select.css`

| 类名 | 说明 |
|---|---|
| `.ui-select` | 容器，展开时加 `.is-open` |
| `.ui-select__trigger` | 触发器，`aria-expanded` / `aria-haspopup="listbox"` |
| `.ui-select__menu` | 弹层，`role="listbox"` |
| `.ui-select__option` | 选项，`role="option"` + `aria-selected` |
| `.ui-select__group` | 分组标题 |
| `.is-up` | 向上展开 |

---

## State 空 / 错误 / 加载

`components/states.css`

| 类名 | 说明 |
|---|---|
| `.ui-state` | 空状态骨架 |
| `.ui-state--error` | 错误态，图标转警示色 |
| `.ui-state--loading` | 加载态 |
| `.ui-state__icon` / `__title` / `__desc` / `__actions` | 结构 |
| `.ui-spinner` | 旋转环 |
| `.ui-loadmore` | 列表底部「加载更多」 |
| `.ui-skeleton-card` | 骨架卡片容器 |

---

## PageHeader 页头

`components/page-header.css`

| 类名 | 说明 |
|---|---|
| `.ui-page-title` | 一级页面大标题 |
| `.ui-page-title__text` / `__sub` / `__actions` | 结构 |
| `.ui-section-title` | 分区小标题 |
| `.ui-sub-header` | 子级页吸顶顶栏，只放返回键和标题 |
| `.ui-sub-header__back` / `__title` | 48px 返回控件 / 居中的唯一页面标题 |

子级页再加载 `pages/subpage.css`：`.ui-subpage` 是页面外层，`.ui-subpage__content` 是正文容器。正文不放任何标题块，说明、字段标签与操作直接排列；`.ui-page-title` 仅用于一级页。完整规则见[子级页面规范](DESIGN.md#13-子级页面)。

最小结构（保存为仓库根目录的 HTML 可直接预览；将 `href="./index.html"` 替换成实际父级地址）：

```html
<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>通知设置</title>
  <link rel="stylesheet" href="./tokens/tokens.css">
  <link rel="stylesheet" href="./components/base.css">
  <link rel="stylesheet" href="./components/page-header.css">
  <link rel="stylesheet" href="./pages/subpage.css">
</head>
<body class="ui-subpage">
  <a class="ui-skip" href="#main">跳到主要内容</a>
  <header class="ui-sub-header">
    <a class="ui-sub-header__back" href="./index.html" aria-label="返回设置">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m14 6-6 6 6 6"/></svg>
    </a>
    <h1 class="ui-sub-header__title" id="page-title">通知设置</h1>
  </header>
  <main class="ui-subpage__content" id="main" tabindex="-1" aria-labelledby="page-title">
    <p>在这里直接放入字段、列表或正文，不再添加标题。</p>
  </main>
</body>
</html>
```

包含开关、保存、存储失败反馈与系统主题跟随的[完整通知设置示例](../pages/subpage.html)可以直接运行和复制。它使用确定的父级返回链接，业务操作全部位于正文中。

---

## Feed 内容卡与评论

`components/feed.css`

| 类名 | 说明 |
|---|---|
| `.ui-feed` | 信息流容器 |
| `.ui-post` | 内容卡，`--pressable` 可点 |
| `.ui-post__head` / `__author` / `__more` | 头部 |
| `.ui-post__title` / `__body` / `--clamp` | 正文 |
| `.ui-post__images` + `.cols-1/2/3` | 图片网格 |
| `.ui-post__cell` / `--more` / `__cell-more` | 单元格与 +N |
| `.ui-post__meta` + `.is-liked` / `.is-saved` / `.is-pop` | 互动条 |
| `.ui-comment` / `__row` / `__name` / `__text` / `__ops` | 评论 |
| `.ui-comment__replies` / `__reply` / `__expand` | 子回复 |

---

## UserList 用户行

`components/user-list.css`

| 类名 | 说明 |
|---|---|
| `.ui-user-list` | 列表容器 |
| `.ui-user-row` / `__main` / `__name` / `__meta` / `__action` | 行结构 |
| `.ui-notice` / `__icon` / `__content` / `__text` / `__time` / `__dot` | 通知行 |
| `.ui-swipe` / `__actions` / `__action--pin` / `--del` / `__item` | 左滑会话行 |

---

## ProfileHeader 资料头

`components/profile-header.css`

| 类名 | 说明 |
|---|---|
| `.ui-profile` | 容器，`--hero` 带渐变背景 |
| `.ui-profile__top` / `__identity` / `__name` / `__handle` | 头部 |
| `.ui-profile__bio` | 简介，最多三行 |
| `.ui-profile__stats` / `__stat` | 数据行 |
| `.ui-profile__actions` | 操作区 |
| `.ui-avatar-edit` | 头像编辑角标 |

---

## Voice 语音条

`components/voice.css`

| 类名 | 说明 |
|---|---|
| `.ui-voice` | 语音条，整条可点 |
| `.ui-voice__play` / `__wave` / `__duration` | 结构 |
| `.ui-voice--mine` | 自己的语音，反色 |
| `.is-playing` | 播放中，波形呼吸 |
| `.is-error` | 播放失败 |

---

## Refresh 下拉刷新

`components/refresh.css`

| 类名 | 说明 |
|---|---|
| `.ui-refresh` | 指示器容器 |
| `[data-state]` | `idle` / `pulling` / `ready` / `loading` |
| `.ui-refresh__indicator` / `__text` | 结构 |
| `.ui-refresh-content` | 跟随下拉的内容区 |

---

## Banner 横幅与轮播

`components/banner.css`

| 类名 | 说明 |
|---|---|
| `.ui-carousel` / `__track` / `__dots` | 轮播 |
| `.ui-banner` | 横幅卡，`--soft` 浅底 |
| `.ui-banner__art` / `__copy` / `__title` / `__desc` / `__cta` | 结构 |
| `.ui-tipbar` | 单行提示条 |

---

## AppGrid 应用宫格

`components/app-grid.css`

| 类名 | 说明 |
|---|---|
| `.ui-app-grid` | 4 列宫格，`--sm` 紧凑 |
| `.ui-app-item` / `__icon` / `__label` | 单项结构 |

---

## Search 搜索

`components/search.css`

| 类名 | 说明 |
|---|---|
| `.ui-search` / `__box` / `__cancel` | 搜索框 |
| `mark.ui-hl` | 关键词高亮 |
| `.ui-result` / `__main` / `__title` / `__snippet` / `__meta` | 结果行 |

---

## Viewer 图片查看

`components/viewer.css`

| 类名 | 说明 |
|---|---|
| `.ui-viewer` | 全屏容器 |
| `.ui-viewer__close` / `__stage` / `__counter` / `__dots` | 结构 |
| `.is-zoomed` | 双击放大态 |

---

## Login 登录页模板

`pages/login.css`

| 类名 | 说明 |
|---|---|
| `.ui-login` | 页面容器，宽屏双栏 / 窄屏单栏 |
| `.ui-login__brand` / `__brand-copy` / `__brand-foot` | 左侧品牌区 |
| `.ui-login__main` / `__box` / `__header` | 右侧表单区 |
| `.ui-login__form` / `__error` / `__row` / `__link` | 表单 |
| `.ui-login__divider` / `__oauth` / `__note` | 分隔与第三方登录 |
| `.ui-float` | 浮动标签输入框，`--affix` 带尾部按钮 |
| `.ui-float__input` / `__label` / `__affix` | 结构 |
| `.ui-float.is-filled` / `.is-invalid` | 已填 / 错误态 |

---

## 组件与行为层的对应关系

样式是静态的，交互在 `behaviors/`。不是每个组件都需要 JS：

| 组件 | 需要 JS | 模块 |
|---|---|---|
| Button / Badge / Avatar / Card / List | 否 | — |
| Field | 否 | 原生控件 |
| Switch | 否 | 原生 `checkbox` |
| Skeleton / Empty | 否 | — |
| Dialog | 是 | 自定义结构用 `createDialog`；全局提示 / 确认用 `alert` / `confirm` |
| Sheet | 是 | `createSheet` |
| Toast | 是 | `createToaster` |
| Segmented / Tabs | 是 | `createSegmented` |
| Select | 是 | `createSelect` |
| Refresh | 是 | `createPullRefresh` |
| Feed / Comment | 否 | 点赞态用 `.is-liked` |
| UserList / Notice | 否 | 左滑行需自行绑手势 |
| ProfileHeader / Voice / Banner / AppGrid / Search / Viewer | 否 | 纯样式 |
| Login | 否 | 浮动标签靠 CSS 伪类 |
| Dock | 否 | 选中态用 `aria-current` 即可 |

详见 [`BEHAVIORS.md`](BEHAVIORS.md)。
