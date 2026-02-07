<script setup lang="ts">
import { ref } from 'vue'
import ConfigPanel from './ConfigPanel.vue'
import ConfigPreview from './ConfigPreview.vue'
import type { ToastNotification } from '../types'

const config = ref<ToastNotification>({
  type: 'success',
  title: 'Success!',
  message: 'Your changes have been saved.',
  duration: 3000,
  position: 'bottom-right',
  backgroundColor: '#22c55e',
  textColor: '#ffffff',
  showIcon: true,
  showCloseButton: true,
  animation: 'slide'
})

const items = ref<any[]>([])

const positions: ToastNotification['position'][] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
]

function getItems(position: ToastNotification['position']) {
  return items.value.filter((i) => i.position === position)
}

function getIcon(type: string) {
  if (type === 'success') return '✓'
  if (type === 'error') return '✕'
  if (type === 'warning') return '!'
  return '✓'
}

function showNotification() {
  const toast = {
    ...config.value,
    id: Date.now() + '-' + Math.floor(Math.random() * 100000),
    _state: 'enter'
  }

  items.value.unshift(toast)

  const safeTimeout = Number.isFinite(toast.duration) && toast.duration > 0 ? toast.duration : 3000
  setTimeout(() => {
    startClose(toast.id)
  }, safeTimeout)
}

function applyPreset(presetConfig: ToastNotification) {
  Object.assign(config.value, presetConfig)
}

function startClose(id: string) {
  const t = items.value.find((x) => x.id === id)
  if (!t) return
  if (t._state === 'leave') return

  t._state = 'leave'

  setTimeout(() => {
    items.value = items.value.filter((x) => x.id !== id)
  }, 500)
}

function closeNotification(id: string) {
  startClose(id)
}
</script>

<template>
  <div class="layout">
    <ConfigPanel v-model:config="config" />
    <ConfigPreview :config="config" @show="showNotification" @load="applyPreset" />
  </div>

  <div
    v-for="position in positions"
    :key="position"
    class="toastStack"
    :class="`pos-${position}`"
  >
    <div
      v-for="toast in getItems(position)"
      :key="toast.id"
      class="toastItem"
      :class="[
        toast._state === 'leave' ? 'leaving' : 'entering',
        `animation-${toast.animation}`
      ]"
      :style="{ backgroundColor: toast.backgroundColor, color: toast.textColor }"
    >
      <span v-if="toast.showIcon" class="toastIcon">{{ getIcon(toast.type) }}</span>

      <div class="toastBody">
        <div v-if="toast.title" class="toastTitle">{{ toast.title }}</div>
        <div v-if="toast.message" class="toastMessage">{{ toast.message }}</div>
      </div>

      <q-btn
        v-if="toast.showCloseButton"
        @click="closeNotification(toast.id)"
        flat
        round
        dense
        icon="close"
      />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  gap: 60px;
}

.toastStack {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
  max-width: 360px;
  padding: 12px;
}

.pos-top-left {
  top: 12px;
  left: 12px;
  align-items: flex-start;
}

.pos-top-center {
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.pos-top-right {
  top: 12px;
  right: 12px;
  align-items: flex-end;
}

.pos-bottom-left {
  bottom: 12px;
  left: 12px;
  align-items: flex-start;
}

.pos-bottom-center {
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.pos-bottom-right {
  bottom: 12px;
  right: 12px;
  align-items: flex-end;
}

.pos-bottom-left,
.pos-bottom-center,
.pos-bottom-right {
  flex-direction: column-reverse;
}

.toastItem {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: start;
  padding: 12px 14px;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
  min-width: 260px;
}

.entering.animation-fade {
  animation: inFade 300ms ease-out both;
}
.entering.animation-slide {
  animation: inSlide 300ms ease-out both;
}
.entering.animation-bounce {
  animation: inBounce 300ms ease-out both;
}
.leaving.animation-fade {
  animation: inFade 500ms ease-in both reverse;
}
.leaving.animation-slide {
  animation: inSlide 500ms ease-in both reverse;
}
.leaving.animation-bounce {
  animation: inBounce 500ms ease-in both reverse;
}
@keyframes inFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes outFade {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes inSlide {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes outSlide {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes inBounce {
  0%   { opacity: 0; transform: scale(0.96); }
  60%  { opacity: 1; transform: scale(1.03); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes outBounce {
 0%   { opacity: 0; transform: scale(0.96); }
  60%  { opacity: 1; transform: scale(1.03); }
  100% { opacity: 1; transform: scale(1); }
}

.toastIcon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.2);
}

.toastBody {
  display: grid;
  gap: 4px;
}

</style>
