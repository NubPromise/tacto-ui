/* 全局提示与确认：按需创建 DOM，共用队列，关闭后清理并归还焦点。 */
import { lockScroll } from './focus.js';

const queue = [];
let active = null;
let sequence = 0;

const titles = {
  info: '提示',
  success: '操作成功',
  warning: '请注意',
  error: '操作未完成',
  danger: '确认危险操作',
};
const paths = {
  info: 'M12 11v6 M12 7h.01',
  success: 'm7 12 3 3 7-7',
  warning: 'M12 3 2 21h20L12 3Z M12 9v4 M12 17h.01',
  error: 'm8 8 8 8 M16 8l-8 8',
};

function createIcon(type) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  if (!['warning', 'danger'].includes(type)) {
    const circle = document.createElementNS(svg.namespaceURI, 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '9');
    svg.append(circle);
  }
  const path = document.createElementNS(svg.namespaceURI, 'path');
  path.setAttribute('d', paths[type === 'danger' ? 'warning' : type]);
  svg.append(path);
  return svg;
}

function showNext() {
  if (active || !queue.length) return;
  const request = queue.shift();
  const { options, isConfirm } = request;
  const id = `ui-alert-dialog-${++sequence}`;
  const dialog = document.createElement('dialog');
  dialog.className = 'ui-dialog ui-dialog--alert';
  dialog.dataset.type = options.type;
  dialog.setAttribute('role', 'alertdialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', `${id}-title`);

  const status = document.createElement('span');
  status.className = 'ui-dialog__status';
  status.append(createIcon(options.type));
  const title = document.createElement('h2');
  title.className = 'ui-dialog__title';
  title.id = `${id}-title`;
  title.textContent = options.title;
  dialog.append(status, title);

  if (options.message) {
    const body = document.createElement('p');
    body.className = 'ui-dialog__body';
    body.id = `${id}-body`;
    body.textContent = options.message;
    dialog.setAttribute('aria-describedby', body.id);
    dialog.append(body);
  }

  const actions = document.createElement('div');
  actions.className = 'ui-dialog__actions';
  const button = (text, action, className) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = className;
    el.textContent = text;
    el.dataset.action = action;
    el.addEventListener('click', () => dialog.close(action));
    actions.append(el);
    return el;
  };
  const cancelButton = isConfirm ? button(options.cancelText, 'cancel', 'ui-btn') : null;
  const confirmButton = button(options.confirmText, 'confirm',
    `ui-btn ui-btn--${options.type === 'danger' ? 'danger' : 'primary'}`);
  // 任何确认操作都先聚焦「取消」，防止 Enter 意外确认。
  (cancelButton || confirmButton).autofocus = true;
  dialog.append(actions);
  document.body.append(dialog);
  active = { ...request, dialog };
  let unlock = () => {};

  const cleanup = () => {
    dialog.remove();
    unlock();
    if (request.opener?.isConnected) request.opener.focus({ preventScroll: true });
    active = null;
  };
  dialog.addEventListener('close', () => {
    const confirmed = dialog.returnValue === 'confirm';
    cleanup();
    request.resolve(confirmed);
    showNext();
  }, { once: true });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    if (options.closeOnEscape) dialog.close('cancel');
  });
  dialog.addEventListener('click', (event) => {
    if (!options.closeOnBackdrop || event.target !== dialog) return;
    // dialog 内部留白也可能成为事件目标，只有矩形外的遮罩才能关闭。
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right
      || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close('cancel');
  });

  try {
    dialog.showModal();
    unlock = lockScroll();
    (cancelButton || confirmButton).focus();
  } catch (error) {
    cleanup();
    request.reject(error);
    showNext();
  }
}

function enqueue(input, isConfirm) {
  return new Promise((resolve, reject) => {
    if (typeof input !== 'string' && (!input || typeof input !== 'object' || Array.isArray(input))) {
      throw new TypeError('alert / confirm 需要提示文本或选项对象');
    }
    const supplied = typeof input === 'string' ? { message: input } : input;
    const type = supplied.type ?? 'warning';
    if (!Object.hasOwn(titles, type)) throw new TypeError(`不支持的弹窗类型：${type}`);
    const options = {
      type,
      title: String(supplied.title || titles[type]),
      message: String(supplied.message ?? ''),
      confirmText: String(supplied.confirmText || (isConfirm ? '确定' : '知道了')),
      cancelText: String(supplied.cancelText || '取消'),
      closeOnEscape: supplied.closeOnEscape !== false,
      closeOnBackdrop: supplied.closeOnBackdrop === true,
    };
    // 排队时焦点可能位于前一弹窗内，保留它原本的触发器。
    const opener = active?.dialog.contains(document.activeElement) ? active.opener : document.activeElement;
    queue.push({ options, isConfirm, opener, resolve, reject });
    showNext();
  });
}

/** 返回 Promise<boolean>；只有点击确认才为 true，其余关闭方式为 false。 */
export function alert(messageOrOptions) { return enqueue(messageOrOptions, false); }
export function confirm(messageOrOptions) { return enqueue(messageOrOptions, true); }
