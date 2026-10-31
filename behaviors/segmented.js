/* ============================================================
   segmented.js — 分段控件与标签栏行为
   ------------------------------------------------------------
   补上 WAI-ARIA Tabs 要求的键盘交互：
     左右方向键切换、Home / End 跳到首尾、roving tabindex
   只负责选中态与焦点，不负责切换面板内容——内容切换交给 onChange。

   用法
   const seg = createSegmented(el, { onChange: (index, item) => {} });
   seg.select(2);
   ============================================================ */

const ITEM_SELECTOR = '[role="tab"], .ui-seg__item, .ui-tabs__item';

export function createSegmented(root, { onChange, initial } = {}) {
  if (!(root instanceof HTMLElement)) {
    throw new TypeError('createSegmented 需要一个容器元素');
  }

  const items = [...root.querySelectorAll(ITEM_SELECTOR)];
  if (!items.length) throw new Error('createSegmented 找不到可切换的项');

  let index = Number.isInteger(initial)
    ? initial
    : Math.max(0, items.findIndex((item) => item.getAttribute('aria-selected') === 'true'));

  const select = (next, { focus = false, emit = true } = {}) => {
    index = ((next % items.length) + items.length) % items.length;

    items.forEach((item, i) => {
      const active = i === index;
      item.setAttribute('aria-selected', String(active));
      // roving tabindex：整组只有一个 Tab 停靠点
      item.tabIndex = active ? 0 : -1;
      if (active && item.hasAttribute('aria-current')) item.setAttribute('aria-current', 'page');
    });

    if (focus) items[index].focus();
    if (emit) onChange?.(index, items[index]);
    return items[index];
  };

  const onKeydown = (event) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (step) {
      event.preventDefault();
      select(index + step, { focus: true });
    } else if (event.key === 'Home') {
      event.preventDefault();
      select(0, { focus: true });
    } else if (event.key === 'End') {
      event.preventDefault();
      select(items.length - 1, { focus: true });
    }
  };

  const onClick = (event) => {
    if (!(event.target instanceof Element)) return;
    const item = event.target.closest(ITEM_SELECTOR);
    const i = items.indexOf(item);
    if (i >= 0) select(i);
  };

  root.addEventListener('keydown', onKeydown);
  root.addEventListener('click', onClick);
  select(index, { emit: false });

  return {
    select,
    get index() { return index; },
    get item() { return items[index]; },
    destroy() {
      root.removeEventListener('keydown', onKeydown);
      root.removeEventListener('click', onClick);
    },
  };
}
