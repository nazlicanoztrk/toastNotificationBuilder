<script setup lang="ts">
import { computed } from 'vue'
import { copyToClipboard } from 'quasar'
import PresetTable from './PresetTable.vue'
import type { ToastNotification } from '../types'

const props = defineProps<{ config: ToastNotification }>()

const emit = defineEmits(['show', 'load'])

const positionStyle = computed(() => {
  const map = {
    'top-left': { justifyContent: 'flex-start', alignItems: 'flex-start' },
    'top-center': { justifyContent: 'center', alignItems: 'flex-start' },
    'top-right': { justifyContent: 'flex-end', alignItems: 'flex-start' },
    'bottom-left': { justifyContent: 'flex-start', alignItems: 'flex-end' },
    'bottom-center': { justifyContent: 'center', alignItems: 'flex-end' },
    'bottom-right': { justifyContent: 'flex-end', alignItems: 'flex-end' }
  }
  return map[props.config.position] || map['top-right']
})

const toastStyle = computed(() => ({
  backgroundColor: props.config.backgroundColor,
  color: props.config.textColor
}))

const iconChar = computed(() => {
  const map = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'i'
  }
  return map[props.config.type]
})

const codeText = computed(() => {
  const obj = {
    type: props.config.type,
    title: props.config.title,
    message: props.config.message,
    duration: props.config.duration,
    position: props.config.position,
    backgroundColor: props.config.backgroundColor,
    textColor: props.config.textColor,
    showIcon: props.config.showIcon,
    showCloseButton: props.config.showCloseButton,
    animation: props.config.animation,
  };

  return `const notification = ${JSON.stringify(obj, null, 2)};`
})

function copyCode() {
  copyToClipboard(codeText.value)
}
</script>
<template>
  <q-card class="container">
    <div class="header">Preview</div>
    <div class="previewArea" :style="positionStyle">
      <div class="toastPreview" :style="toastStyle">
        <div v-if="props.config.showIcon" class="icon">
          {{ iconChar }}
        </div>
        <div class="content">
          <div v-if="props.config.title" class="title">{{ props.config.title }}</div>
          <div v-if="props.config.message" class="message">{{ props.config.message }}</div>
        </div>

        <q-btn
          v-if="props.config.showCloseButton"
          flat
          round
          dense
          icon="close"
          class="closeBtn"
        />
      </div>
    </div>

    <div class="block">
      <q-btn
        class="showBtn"
        unelevated
        color="primary"
        label="Show Notification"
        @click="$emit('show')"
      />
    </div>
  <PresetTable :config="props.config" @load="(preset) => emit('load', preset)" />

    <div class="block">
      <div class="rowBetween">
        <div class="label">Code Export</div>
        <q-btn class="copyBtn" dense icon="content_copy" label="Copy" @click="copyCode" />
      </div>

      <pre class="codeArea"><code>{{ codeText }}</code></pre>
    </div>
  </q-card>
</template>
<style scoped>
.container {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px, rgba(0, 0, 0, 0.22) 0px 1px 2px;
    border-radius: 10px;
    padding: 10px;
}

.header {
  font-weight: 700;
  margin-bottom: 16px;
}




.rowBetween {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.previewArea {
  min-height: 270px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background-color: aliceblue;
  width: 100%;
}

.toastPreview {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: start;

  padding: 12px;
  border-radius: 12px;
  min-height: 64px;
  width: 100%;
  max-width: 420px;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.18);
}

.content {
  display: grid;
  gap: 4px;
  word-break: break-word;
}



.closeBtn {
  opacity: 0.9;
}

.showBtn {
  width: 100%;
  border-radius: 10px;
}

.codeArea {
  background: #111827;
  color: #e5e7eb;
  padding: 5px;
  border-radius: 10px;
  overflow: auto;
  font-size: 10px;
}
.copyBtn{
  background-color: #e5e7eb;
  border-radius: 8px;
}
</style>