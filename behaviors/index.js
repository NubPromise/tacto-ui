/* ============================================================
   behaviors — 行为层入口
   ------------------------------------------------------------
   纯 CSS 组件解决「长什么样」，这里解决「怎么动、怎么响应键盘」。
   每个模块无依赖，可以单独 import，也可以从这里一次性引入。

   import { createDialog, createSheet, createToaster, createSegmented } from './behaviors/index.js';
   ============================================================ */

export { createDialog } from './dialog.js';
export { createSheet } from './sheet.js';
export { createToaster } from './toast.js';
export { createSegmented } from './segmented.js';
export { createSelect } from './select.js';
export { createPullRefresh } from './pull-refresh.js';
export { focusFirst, getFocusable, lockScroll, trapFocus } from './focus.js';
