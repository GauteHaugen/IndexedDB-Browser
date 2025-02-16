<template>
  <div class="d-flex w-100 h-100" :class="wrapperClasses">
    <div class="d-flex" :style="container1StyleSize">
      <slot name="container1"></slot>
    </div>

    <div class="d-flex justify-content-center" :class="splitContainerDividerClass" :style="splitContainerDividerStyle">
      <div
        class="d-flex bg-danger"
        :class="splitContainerDividerDraggerClass"
        :style="splitContainerDividerDraggerStyle"
        @mousedown="onMouseDown"
      >
        <i class="bi" :class="splitContainerDividerDraggerIcon"></i>
      </div>
    </div>

    <div class="d-flex" :style="container2StyleSize">
      <slot name="container2"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, computed, ref, onBeforeUnmount } from 'vue';

interface IProps {
  direction?: 'horizontal' | 'vertical';
  initialSize: number;
  container1Options?: IContainerOptions;
  container2Options?: IContainerOptions;
}

interface IContainerOptions {
  minSize?: number;
  maxSize?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  direction: 'horizontal',
});

const userSetWidth = ref<number>(props.initialSize);

const wrapperClasses = computed(() => (props.direction === 'horizontal' ? ['flex-row'] : ['flex-column']));

const splitContainerDividerClass = computed(() => (props.direction === 'horizontal' ? ['flex-column', 'h-100'] : ['flex-row', 'w-100']));
const splitContainerDividerStyle = computed(() => (props.direction === 'horizontal' ? { width: '30px' } : { height: '30px' }));

const splitContainerDividerDraggerClass = computed(() => (props.direction === 'horizontal' ? ['flex-column'] : ['flex-row']));
const splitContainerDividerDraggerStyle = computed(() => (props.direction === 'horizontal' ? { width: '30px' } : { height: '30px' }));

const splitContainerDividerDraggerIcon = computed(() =>
  props.direction === 'horizontal' ? ['bi-three-dots-vertical'] : ['bi-three-dots'],
);

const container1StyleSize = computed(() => {
  if (props.direction === 'horizontal') {
    return {
      width: `${userSetWidth.value}px`,
      ...(props.container1Options?.minSize && {
        minWidth: `${props.container1Options.minSize}px`,
      }),
      ...(props.container1Options?.maxSize && {
        maxWidth: `${props.container1Options.maxSize}px`,
      }),
    };
  } else {
    return {
      height: `${userSetWidth.value}px`,
      ...(props.container1Options?.minSize && {
        minHeight: `${props.container1Options.minSize}px`,
      }),
      ...(props.container1Options?.maxSize && {
        maxHeight: `${props.container1Options.maxSize}px`,
      }),
    };
  }
});

const container2StyleSize = computed(() => {
  if (props.direction === 'horizontal') {
    return {
      flex: 1,
      ...(props.container2Options?.minSize && {
        minWidth: `${props.container2Options.minSize}px`,
      }),
      ...(props.container2Options?.maxSize && {
        maxWidth: `${props.container2Options.maxSize}px`,
      }),
    };
  } else {
    return {
      flex: 1,
      ...(props.container2Options?.minSize && {
        minHeight: `${props.container2Options.minSize}px`,
      }),
      ...(props.container2Options?.maxSize && {
        maxHeight: `${props.container2Options.maxSize}px`,
      }),
    };
  }
});

let isDragging = false;
let startX = 0;
let startY = 0;
let startSize = userSetWidth.value;

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging) return;
  let delta = 0;
  if (props.direction === 'horizontal') {
    delta = e.clientX - startX;
  } else {
    delta = e.clientY - startY;
  }
  let newSize = startSize + delta;
  // Constrain newSize based on container1Options, if provided.
  if (props.container1Options) {
    if (props.container1Options.minSize !== undefined) {
      newSize = Math.max(newSize, props.container1Options.minSize);
    }
    if (props.container1Options.maxSize !== undefined) {
      newSize = Math.min(newSize, props.container1Options.maxSize);
    }
  }
  userSetWidth.value = newSize;
};

const onMouseUp = () => {
  if (isDragging) {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
};

const onMouseDown = (e: MouseEvent) => {
  isDragging = true;
  startSize = userSetWidth.value;
  if (props.direction === 'horizontal') {
    startX = e.clientX;
  } else {
    startY = e.clientY;
  }
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

onBeforeUnmount(() => {
  // Clean up in case the component is unmounted while dragging.
  if (isDragging) {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
});
</script>
