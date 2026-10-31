/* ============================================================
   pull-refresh.js — 下拉刷新行为
   ------------------------------------------------------------
   只在滚动容器位于顶部时接管纵向手势，其余情况交还原生滚动。

   状态机
     idle → pulling（下拉未达阈值）
          → ready（达到阈值，松手即刷新）
          → loading（刷新中，高度锁定）
          → idle

   用法
   const refresh = createPullRefresh({
     scroller: document.querySelector('#scroll'),
     indicator: document.querySelector('.ui-refresh'),
     onRefresh: async () => { await load(); },
   });
   ============================================================ */

const THRESHOLD = 64;
const MAX_PULL = 96;

export function createPullRefresh({
  scroller,
  indicator,
  onRefresh,
  threshold = THRESHOLD,
} = {}) {
  if (!(scroller instanceof HTMLElement)) throw new TypeError('createPullRefresh 需要滚动容器');
  if (!(indicator instanceof HTMLElement)) throw new TypeError('createPullRefresh 需要指示器元素');
  if (typeof onRefresh !== 'function') throw new TypeError('createPullRefresh 需要 onRefresh 回调');

  const content = scroller.querySelector('.ui-refresh-content');
  let startY = 0;
  let pull = 0;
  let tracking = false;
  let loading = false;

  const setState = (state) => { indicator.dataset.state = state; };

  const setText = (text) => {
    const el = indicator.querySelector('.ui-refresh__text');
    if (el) el.textContent = text;
  };

  const apply = (distance) => {
    pull = distance;
    indicator.style.height = `${Math.min(distance, MAX_PULL)}px`;
    if (content) content.style.setProperty('--pull', `${distance}px`);
  };

  const reset = () => {
    pull = 0;
    indicator.style.height = '';
    if (content) {
      content.classList.add('is-releasing');
      content.style.setProperty('--pull', '0px');
      setTimeout(() => content.classList.remove('is-releasing'), 220);
    }
    setState('idle');
    setText('下拉刷新');
  };

  const onPointerDown = (event) => {
    if (loading || event.button !== 0) return;
    if (scroller.scrollTop > 0) return;
    startY = event.clientY;
    tracking = true;
  };

  const onPointerMove = (event) => {
    if (!tracking || loading) return;
    const dy = event.clientY - startY;

    // 向上滑或容器已滚动：交还原生滚动
    if (dy <= 0 || scroller.scrollTop > 0) {
      if (pull > 0) reset();
      tracking = false;
      return;
    }

    // 阻尼：越往下拉越吃力
    const distance = Math.min(MAX_PULL, dy * 0.55);
    apply(distance);
    const ready = distance >= threshold;
    setState(ready ? 'ready' : 'pulling');
    setText(ready ? '松手刷新' : '下拉刷新');
  };

  const onPointerUp = async () => {
    if (!tracking) return;
    tracking = false;
    if (loading) return;

    if (pull < threshold) { reset(); return; }

    loading = true;
    setState('loading');
    setText('正在刷新…');
    indicator.style.height = `${threshold}px`;
    if (content) content.style.setProperty('--pull', `${threshold}px`);

    // 设备支持时给一次轻触感反馈
    navigator.vibrate?.(8);

    try {
      await onRefresh();
    } finally {
      loading = false;
      reset();
    }
  };

  scroller.addEventListener('pointerdown', onPointerDown);
  scroller.addEventListener('pointermove', onPointerMove);
  scroller.addEventListener('pointerup', onPointerUp);
  scroller.addEventListener('pointercancel', onPointerUp);

  setState('idle');

  return {
    destroy() {
      scroller.removeEventListener('pointerdown', onPointerDown);
      scroller.removeEventListener('pointermove', onPointerMove);
      scroller.removeEventListener('pointerup', onPointerUp);
      scroller.removeEventListener('pointercancel', onPointerUp);
    },
  };
}
