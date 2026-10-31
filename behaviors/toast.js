/* ============================================================
   toast.js — 轻提示行为
   ------------------------------------------------------------
   规则落地：
     1. 同一时刻只显示一个，新提示替换旧提示而不是排队
     2. 2.4 秒后自动离场；错误用 role="alert"，其余用 role="status"
     3. 文案走 textContent，不拼 HTML，避免把用户输入当标记解析

   用法
   const toast = createToaster(region);
   toast.show('已保存', { type: 'success' });
   ============================================================ */

export function createToaster(region, { duration = 2400 } = {}) {
  if (!(region instanceof HTMLElement)) {
    throw new TypeError('createToaster 需要一个容器元素');
  }

  let timer = null;
  let current = null;

  const remove = (el) => {
    if (!el.isConnected) return;
    el.remove();
  };

  const clear = () => {
    clearTimeout(timer);
    timer = null;
    if (!current) return;
    const leaving = current;
    current = null;
    leaving.classList.add('is-leaving');
    // 动画结束时移除；减少动画偏好下没有动画，用定时兜底
    leaving.addEventListener('animationend', () => remove(leaving), { once: true });
    setTimeout(() => remove(leaving), 400);
  };

  /**
   * @param {string} text 提示文案，纯文本
   * @param {{ type?: 'plain'|'success'|'error', icon?: string, timeout?: number }} options
   */
  const show = (text, { type = 'plain', icon = '', timeout = duration } = {}) => {
    clear();
    region.replaceChildren();

    const el = document.createElement('div');
    el.className = `ui-toast ui-toast--${type}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');

    if (icon) {
      const iconEl = document.createElement('span');
      iconEl.className = 'ui-toast__icon';
      iconEl.innerHTML = icon; // 图标来自开发者，不是用户输入
      el.append(iconEl);
    }

    const textEl = document.createElement('span');
    textEl.className = 'ui-toast__text';
    textEl.textContent = text;
    el.append(textEl);

    region.append(el);
    current = el;

    if (timeout > 0) timer = setTimeout(clear, timeout);
    return el;
  };

  return {
    show,
    clear,
    get isVisible() { return Boolean(current); },
  };
}
