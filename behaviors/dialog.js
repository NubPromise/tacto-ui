/* ============================================================
   dialog.js — 对话框行为
   ------------------------------------------------------------
   基于原生 <dialog>，只补三件事：
     1. 打开时记录触发元素，关闭后把焦点还回去
     2. 点遮罩关闭（原生不支持）
     3. 统一处理 [data-close] 按钮

   焦点陷阱、Esc 关闭由浏览器的 showModal() 提供，不重复实现。

   用法
   const dialog = createDialog(el, { onClose: () => {} });
   dialog.open(triggerButton);
   ============================================================ */

import { focusFirst } from './focus.js';

export function createDialog(dialog, { onOpen, onClose } = {}) {
  if (!(dialog instanceof HTMLDialogElement)) {
    throw new TypeError('createDialog 需要一个 <dialog> 元素');
  }

  let opener = null;

  const open = (trigger) => {
    if (dialog.open) return;
    opener = trigger instanceof HTMLElement ? trigger : document.activeElement;
    dialog.showModal();
    // 危险操作会把 autofocus 放在「取消」上，优先尊重这个意图
    const preferred = dialog.querySelector('[autofocus]');
    if (preferred instanceof HTMLElement) preferred.focus();
    else focusFirst(dialog);
    onOpen?.(dialog);
  };

  const close = (returnValue) => {
    if (!dialog.open) return;
    dialog.close(returnValue);
  };

  const onClick = (event) => {
    // 点遮罩时，事件目标是 dialog 自身而不是内部内容
    if (event.target === dialog) { close(); return; }
    if (event.target instanceof Element && event.target.closest('[data-close]')) close();
  };

  const onCloseEvent = () => {
    onClose?.(dialog, dialog.returnValue);
    if (opener?.isConnected) opener.focus();
    opener = null;
  };

  dialog.addEventListener('click', onClick);
  dialog.addEventListener('close', onCloseEvent);

  return {
    el: dialog,
    open,
    close,
    get isOpen() { return dialog.open; },
    destroy() {
      dialog.removeEventListener('click', onClick);
      dialog.removeEventListener('close', onCloseEvent);
    },
  };
}
