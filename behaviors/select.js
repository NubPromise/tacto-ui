/* 自定义下拉：浏览活动项不会改变已提交值，确认后才触发 onChange。 */
let nextId = 0;

const ensureId = (el, prefix) => {
  if (el.id) return el.id;
  let id;
  do { id = `${prefix}-${++nextId}`; } while (document.getElementById(id));
  el.id = id;
  return id;
};

export function createSelect(root, { onChange, value } = {}) {
  if (!(root instanceof HTMLElement)) throw new TypeError('createSelect 需要一个容器元素');
  const trigger = root.querySelector('.ui-select__trigger');
  const menu = root.querySelector('.ui-select__menu');
  if (!trigger || !menu) throw new Error('createSelect 需要 .ui-select__trigger 与 .ui-select__menu');

  const options = [...menu.querySelectorAll('.ui-select__option')];
  const optionDisabled = (option) => option.disabled || option.getAttribute('aria-disabled') === 'true';
  const available = () => options.map((_, i) => i).filter((i) => !optionDisabled(options[i]));
  if (!available().length) throw new Error('createSelect 找不到可用选项');
  const optionValue = (option) => option.dataset.value ?? option.textContent.trim();

  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-controls', ensureId(menu, 'ui-select-menu'));
  trigger.setAttribute('aria-expanded', 'false');
  if (trigger instanceof HTMLButtonElement) trigger.type = 'button';
  menu.setAttribute('role', 'listbox');
  menu.setAttribute('aria-labelledby', ensureId(trigger, 'ui-select-trigger'));
  menu.hidden = true;
  root.classList.remove('is-open', 'is-up');
  options.forEach((option) => {
    ensureId(option, 'ui-select-option');
    option.setAttribute('role', 'option');
    option.tabIndex = -1;
    if (option instanceof HTMLButtonElement) option.type = 'button';
  });

  let selectedIndex = options.findIndex((o) => !optionDisabled(o) && o.getAttribute('aria-selected') === 'true');
  if (selectedIndex < 0) selectedIndex = available()[0];
  const initialIndex = options.findIndex((o) => !optionDisabled(o) && optionValue(o) === value);
  if (value !== undefined && initialIndex >= 0) selectedIndex = initialIndex;
  let activeIndex = selectedIndex;
  let isOpen = false;
  const isDisabled = () => trigger.disabled || trigger.getAttribute('aria-disabled') === 'true';

  const renderSelection = () => {
    options.forEach((option, i) => option.setAttribute('aria-selected', String(i === selectedIndex)));
    const label = options[selectedIndex].querySelector('span');
    const triggerLabel = trigger.querySelector('span');
    if (triggerLabel) triggerLabel.textContent = label?.textContent ?? options[selectedIndex].textContent.trim();
  };

  const setActive = (index, { scroll = true } = {}) => {
    activeIndex = index;
    options.forEach((option, i) => option.classList.toggle('is-active', isOpen && i === index));
    trigger.setAttribute('aria-activedescendant', options[index].id);
    if (scroll) options[index].scrollIntoView({ block: 'nearest' });
  };

  const open = () => {
    if (isOpen || isDisabled()) return;
    isOpen = true;
    root.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const up = below < menu.scrollHeight && above > below;
    root.classList.toggle('is-up', up);
    menu.style.maxHeight = `${Math.max(0, Math.min(280, up ? above : below))}px`;
    setActive(selectedIndex, { scroll: false });
    document.addEventListener('pointerdown', onOutside, true);
  };

  const close = ({ focusTrigger = false } = {}) => {
    const wasOpen = isOpen;
    isOpen = false;
    activeIndex = selectedIndex;
    root.classList.remove('is-open', 'is-up');
    options.forEach((option) => option.classList.remove('is-active'));
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    menu.hidden = true;
    menu.style.maxHeight = '';
    document.removeEventListener('pointerdown', onOutside, true);
    if (wasOpen && focusTrigger) trigger.focus();
  };

  const commit = (index) => {
    if (optionDisabled(options[index])) return;
    const changed = selectedIndex !== index;
    selectedIndex = index;
    renderSelection();
    close({ focusTrigger: true });
    if (changed) onChange?.(optionValue(options[index]), options[index]);
  };

  function onOutside(event) {
    if (!root.contains(event.target)) close();
  }

  const move = (step) => {
    const indexes = available();
    if (!indexes.length) return;
    const current = indexes.indexOf(activeIndex);
    setActive(indexes[(current + step + indexes.length) % indexes.length]);
  };

  const onTriggerClick = () => { if (!isDisabled()) isOpen ? close() : open(); };
  const onKeydown = (event) => {
    if (isDisabled()) return;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) open(); else move(event.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Home':
      case 'End': {
        if (!isOpen) return;
        event.preventDefault();
        const indexes = available();
        if (indexes.length) setActive(event.key === 'Home' ? indexes[0] : indexes.at(-1));
        break;
      }
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) open(); else commit(activeIndex);
        break;
      case 'Escape':
        if (!isOpen) return;
        event.preventDefault();
        close({ focusTrigger: true });
        break;
      case 'Tab': close(); break;
      default: break;
    }
  };

  const onOptionClick = (event) => {
    if (isDisabled() || !(event.target instanceof Element)) return;
    const index = options.indexOf(event.target.closest('.ui-select__option'));
    if (index >= 0) commit(index);
  };

  trigger.addEventListener('click', onTriggerClick);
  trigger.addEventListener('keydown', onKeydown);
  menu.addEventListener('click', onOptionClick);
  // 初始化不是用户修改，不发出 onChange，也不抢焦点。
  renderSelection();

  return {
    el: root,
    open,
    close,
    get value() { return optionValue(options[selectedIndex]); },
    get isOpen() { return isOpen; },
    setValue(next) {
      const index = options.findIndex((o) => optionValue(o) === next);
      if (index >= 0) commit(index);
    },
    destroy() {
      close();
      trigger.removeEventListener('click', onTriggerClick);
      trigger.removeEventListener('keydown', onKeydown);
      menu.removeEventListener('click', onOptionClick);
    },
  };
}
