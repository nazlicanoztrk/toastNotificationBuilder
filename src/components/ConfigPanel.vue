<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import type { ToastNotification } from '../types'

const props = defineProps<{ config: ToastNotification }>()
const emit = defineEmits(['update:config'])

const config = reactive({ ...props.config })
onMounted(() => {
console.log('config', config)
})

const positions: { key: ToastNotification['position']; label: string }[] = [
  { key: 'top-left', label: 'TL' },
  { key: 'top-center', label: 'TC' },
  { key: 'top-right', label: 'TR' },
  { key: 'bottom-left', label: 'BL' },
  { key: 'bottom-center', label: 'BC' },
  { key: 'bottom-right', label: 'BR' }
]
function setType(type: ToastNotification['type']) {
  const defaults = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f2c037',
    info: '#31ccec'
  }

  config.type = type
  config.backgroundColor = defaults[type]
}

const durationSec = ref(Math.round(config.duration / 1000))
const isPersistent = ref(config.duration === 0)

watch(
  () => props.config,
  (value) => {
    Object.assign(config, value)
    durationSec.value = Math.round(value.duration / 1000)
    isPersistent.value = value.duration === 0
  },
  { deep: true }
)

watch(
  config,
  () => emit('update:config', { ...config }),
  { deep: true }
)

watch(durationSec, (value) => {
  if (isPersistent.value) return
  config.duration = Number(value) * 1000
})

watch(isPersistent, (value) => {
  config.duration = value ? 0 : Number(durationSec.value) * 1000
})
</script>
<template>
    <q-card class="container">
    <div class="header">Configuration</div>
    <div class="block">
        <div class="label">Type</div>
        <div class="typeRow">
        <q-btn
            class="typeBtn successButton"
            icon="check"
            color="positive"
            label="Success"
            :class="{ active: config.type === 'success' }"
            @click="setType('success')"
        />

        <q-btn
            class="typeBtn errorButton"
            icon="close"
            label="Error"
            color="negative"
            :class="{ active: config.type === 'error' }"
            @click="setType('error')"
        />

        <q-btn
            class="typeBtn warningButton"
            icon="warning"
            label="Warning"
            color="warning"
            :class="{ active: config.type === 'warning' }"
            @click="setType('warning')"
        />

        <q-btn
            class="typeBtn infoButton"
            unelevated
            icon="info"
            color="info"
            label="Info"
            :class="{ active: config.type === 'info' }"
            @click="setType('info')"
        />
        </div>
    </div>
    <div class="block">
        <div class="label">Title</div>
        <q-input
        dense
        outlined
        v-model="config.title"
        class="input"
        />
    </div>
    <div class="block">
        <div class="label">Message</div>
        <q-input
        outlined
        type="textarea"
        v-model="config.message"
        class="input"
        />
    </div>
    <div class="block">
    <div class="rowBetween flex-1">
        <div class="label">Duration</div>
        <div class="muted">
        ({{ config.duration / 1000 }}s)
        </div>
    </div>
  <q-slider
    v-model="durationSec"
        :min="1"
        :max="10"
        class="slider"
    />
    </div>
    <q-checkbox
      v-model="isPersistent"
      label="Persistent (no auto-dismiss)"
      class="persistentCheck"
    />
    <div class="block">
    <div class="label">Position</div>

    <div class="posGrid">
        <q-btn
        v-for="p in positions"
        :key="p.key"
        class="posBtn"
        size="m"
        unelevated
        :class="{ active: config.position === p.key }"
        @click="config.position = p.key"
        >
        {{ p.label }}
        </q-btn>
    </div>
    </div>
    <div class="block">
    <div class="label">Style</div>

    <div class="styleGrid">
        <div class="subLabel">Background</div>
        <q-input dense outlined v-model="config.backgroundColor" class="input">
            <template #prepend>
            <q-icon name="palette" />
            </template>
            <template #append>
            <q-btn flat round icon="colorize">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="config.backgroundColor" />
                </q-popup-proxy>
            </q-btn>
            </template>
        </q-input>
        <div>
        <div class="subLabel">Text Color</div>
        <q-input dense outlined v-model="config.textColor" class="input">
            <template #prepend>
            <q-icon name="format_color_text" />
            </template>
            <template #append>
            <q-btn flat round icon="colorize">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="config.textColor" />
                </q-popup-proxy>
            </q-btn>
            </template>
        </q-input>
        </div>
    </div>
    </div>
    <div class="block">
    <div class="label">Options</div>
    <div class="optionRow">
        <q-checkbox v-model="config.showIcon" label="Show Icon" />
        <q-checkbox v-model="config.showCloseButton" label="Show Close Button" />
    </div>
    </div>
    <div class="block">
    <div class="label">Animation</div>

    <div class="animRow">
        <q-btn
        class="animBtn"
        :class="{ active: config.animation === 'fade' }"
        @click="config.animation = 'fade'"
        >
        Fade
        </q-btn>

        <q-btn
        class="animBtn"
        :class="{ active: config.animation === 'slide' }"
        @click="config.animation = 'slide'"
        >
        Slide
        </q-btn>

        <q-btn
        class="animBtn"
        :class="{ active: config.animation === 'bounce' }"
        @click="config.animation = 'bounce'"
        >
        Bounce
        </q-btn>
    </div>
    </div>

  </q-card>
</template>
<style scoped>
.container {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px, rgba(0, 0, 0, 0.22) 0px 1px 2px;
    border-radius: 10px;
    padding: 10px;
}
.q-card {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    width: 60%;;
}

.header {
  font-weight: 700;
  margin-bottom: 16px;

}

.block {
  margin-bottom: 8px;
  
}



.typeRow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.typeBtn {
  width: 100%;
  border-radius: 8px;
}

.typeBtn.active {
  border: 2px solid aliceblue;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;  
  transform: translateY(-1px);

}

.input {
  width: 100%;
}

.posGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.posBtn {
  border-radius: 8px;
}

.posBtn.active {
  background: #4f46e5;
  color: white;
}
.animRow {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  padding-top: 20px;
}
.animBtn{
box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;}
.animBtn.active {
  background: #4f46e5;
  color: white;
}
</style>