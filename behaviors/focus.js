/* ============================================================
   focus.js — 焦点与滚动锁定
   ------------------------------------------------------------
   弹层类组件共用的底层能力：焦点陷阱、滚动锁定、焦点归还。
   无依赖，可单独引用。
   ============================================================ */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** 取出容器内当前可聚焦的元素，过滤掉不可见项。 */
export function getFocusable(container) {
  return [...container.querySelectorAll(FOCUSABLE)].filter((el) => {
    if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') return false;
    return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
  });
}

/** 把焦点放到容器内第一个可聚焦元素；没有则让容器自身获得焦点。 */
export function focusFirst(container) {
  const [first] = getFocusable(container);
  if (first) { first.focus(); return first; }
  if (!container.hasAttribute('tabindex')) container.tabIndex = -1;
  container.focus();
  return container;
}

let lockCount = 0;
let previousOverflow = '';

/**
 * 锁定页面滚动。支持嵌套调用，返回释放函数。
 * 用引用计数而不是布尔值，避免两个弹层先后关闭时提前解锁。
 */
export function lockScroll() {
  if (lockCount === 0) {
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }
  lockCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) document.documentElement.style.overflow = previousOverflow;
  };
}

/**
 * 在容器内循环 Tab 焦点。返回解绑函数。
 * 原生 <dialog> 已自带焦点陷阱，不需要这个；底部面板这类自绘弹层才用。
 */
export function trapFocus(container) {
  const onKeydown = (event) => {
    if (event.key !== 'Tab') return;
    const items = getFocusable(container);
    if (!items.length) { event.preventDefault(); return; }

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    const inside = container.contains(active);

    if (event.shiftKey && (active === first || !inside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !inside)) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener('keydown', onKeydown);
  return () => container.removeEventListener('keydown', onKeydown);
}
