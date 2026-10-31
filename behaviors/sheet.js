/* ============================================================
   sheet.js — 底部面板行为
   ------------------------------------------------------------
   补齐自绘弹层需要而浏览器不提供的部分：
     1. 打开时锁定页面滚动，关闭时释放（引用计数，可嵌套）
     2. 焦点陷阱 + 关闭后焦点归还
     3. 点遮罩关闭、按 Esc 关闭、拖拽把手下滑关闭
     4. 下滑超过阈值或速度足够快即关闭，否则回弹

   用法
   const sheet = createSheet(el, { backdrop });
   sheet.open(triggerButton);
   ============================================================ */

import { focusFirst, lockScroll, trapFocus } from './focus.js';

const CLOSE_DISTANCE = 96;   // 下滑超过这个距离就关闭
const CLOSE_VELOCITY = 0.5;  // 或速度超过 px/ms（快速轻扫）

export function createSheet(sheet, { backdrop, onOpen, onClose, dismissible = true } = {}) {
  if (!(sheet instanceof HTMLElement)) {
    throw new TypeError('createSheet 需要一个面板元素');
  }

  let opener = null;
  let releaseScroll = null;
  let releaseTrap = null;

  const isOpen = () => !sheet.hidden;

  const open = (trigger) => {
    if (isOpen()) return;
    opener = trigger instanceof HTMLElement ? trigger : document.activeElement;
    sheet.hidden = false;
    if (backdrop) backdrop.hidden = false;
    releaseScroll = lockScroll();
    releaseTrap = trapFocus(sheet);
    focusFirst(sheet);
    onOpen?.(sheet);
  };

  const close = () => {
    if (!isOpen()) return;
    sheet.hidden = true;
    if (backdrop) backdrop.hidden = true;
    sheet.style.transform = '';
    sheet.classList.remove('is-dragging');
    releaseTrap?.();
    releaseScroll?.();
    releaseTrap = releaseScroll = null;
    onClose?.(sheet);
    if (opener?.isConnected) opener.focus();
    opener = null;
  };

  // —— Esc：只在面板打开时响应，避免影响页面其他快捷键 ——
  const onKeydown = (event) => {
    if (event.key === 'Escape' && isOpen()) {
      event.stopPropagation();
      close();
    }
  };

  const onClickBackdrop = () => close();

  const onClickInside = (event) => {
    if (event.target instanceof Element && event.target.closest('[data-close-sheet]')) close();
  };

  // —— 下滑关闭：只从把手或标题区域起手，避免和内容滚动冲突 ——
  let dragState = null;

  const onPointerDown = (event) => {
    if (!dismissible || event.button !== 0) return;
    const handle = event.target instanceof Element
      ? event.target.closest('.ui-sheet__grabber, .ui-sheet__title')
      : null;
    if (!handle) return;

    dragState = { startY: event.clientY, startTime: performance.now(), dy: 0 };
    sheet.classList.add('is-dragging');
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const onPointerMove = (event) => {
    if (!dragState) return;
    dragState.dy = Math.max(0, event.clientY - dragState.startY);
    // 往下拖时给一点阻尼感：位移超过面板高度后增长变缓
    sheet.style.transform = `translateY(${dragState.dy}px)`;
  };

  const onPointerUp = () => {
    if (!dragState) return;
    const { dy, startTime } = dragState;
    const velocity = dy / Math.max(1, performance.now() - startTime);
    dragState = null;

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    sheet.classList.remove('is-dragging');
    sheet.style.transform = '';

    if (dy > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) close();
  };

  sheet.addEventListener('keydown', onKeydown);
  sheet.addEventListener('click', onClickInside);
  sheet.addEventListener('pointerdown', onPointerDown);
  backdrop?.addEventListener('click', onClickBackdrop);

  return {
    el: sheet,
    open,
    close,
    get isOpen() { return isOpen(); },
    destroy() {
      sheet.removeEventListener('keydown', onKeydown);
      sheet.removeEventListener('click', onClickInside);
      sheet.removeEventListener('pointerdown', onPointerDown);
      backdrop?.removeEventListener('click', onClickBackdrop);
      releaseTrap?.();
      releaseScroll?.();
      releaseTrap = releaseScroll = null;
    },
  };
}
