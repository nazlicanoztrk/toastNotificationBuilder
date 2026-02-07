<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase, isSupabaseConfigured } from '../supabase'
import type { Preset, ToastNotification } from '../types'

const props = defineProps<{ config: ToastNotification }>()
const emit = defineEmits<{ (event: 'load', value: ToastNotification): void }>()

const STORAGE_KEY = 'presets'

const presetName = ref('')
const presetsData = ref([])
const loading = ref(false)
const errorMsg = ref('')

function getLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    console.log('raw', raw)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLocal(list: Preset[]) {
  console.log('list', list)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

async function refresh() {
  loading.value = true
  errorMsg.value = ''
  presetsData.value = getLocal()

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('configtable')
        .select('id,name,config')
        .order('created_at', { ascending: false })

      if (!error && data) {
        presetsData.value = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          config: item.config,
          createdAt: item.created_at || new Date().toISOString()
        }))
      }
    } catch {
    }
  }

  loading.value = false
}

async function save() {
  const name = presetName.value.trim()
  if (!name) return

  errorMsg.value = ''

  const localList = getLocal()
  const { id: _id, ...configNoId } = props.config
  const localPreset: Preset = {
    id: String(Date.now()),
    name,
    config: configNoId,
    createdAt: new Date().toISOString()
  }

  localList.unshift(localPreset)
  setLocal(localList)

  presetName.value = ''
  presetsData.value = localList
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('configtable').insert({
        name: localPreset.name,
        config: localPreset.config
      })
      await refresh()
    } catch {
    }
  }
}

function loadPreset(p: any) {
  emit('load', p.config)
}

async function removePreset(id: string) {
  const next = (getLocal() as Preset[]).filter((p) => p.id !== id)
  setLocal(next)
  presetsData.value = next

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('configtable').delete().eq('id', id)
      await refresh()
    } catch {
    }
  }
}

function shortConfig(value: unknown) {
  const text = JSON.stringify(value)
  if (!text) return ''
  return text.length > 60 ? text.slice(0, 60) + '...' : text
}

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString()
}

onMounted(() => {
  refresh()
})
</script>

<template>
  <q-card class="container">
    <div class="header">Presets</div>

    <div class="block">
      <div class="label">Save</div>

      <div class="saveRow">
        <q-input dense outlined v-model="presetName" placeholder="Preset name" />
        <q-btn unelevated color="primary" label="Save" @click="save" />
      </div>
    </div>

    <div class="block">
      <div class="rowBetween">
        <div class="label">Saved Presets</div>
      </div>

  <div v-if="loading" class="loading">Loading...</div>

  <div v-else-if="presetsData.length === 0" class="subtle">No presets yet.</div>

      <div v-else class="presetList">
        <div class="presetItem" v-for="preset in presetsData" :key="preset.id">
          <div>
            <div class="presetTitle">{{ preset.name }}</div>
            <div class="presetTitle">{{ shortConfig(preset.config) }}</div>
            <div class="subtle">{{ formatDate(preset.createdAt) }}</div>

          </div>

          <div class="presetActions">
            <q-btn dense unelevated color="primary" label="Load" @click="loadPreset(preset)" />
            <q-btn dense flat color="negative" icon="delete" @click="removePreset(preset.id)" />
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<style scoped>
.container { 
  border-radius: 12px; 
  padding: 16px; 
}
.header { 
  font-weight: 700; 
  margin-bottom: 12px; 
}

.block { margin-top: 16px; }
.label { font-size: 12px; font-weight: 700; margin-bottom: 8px; }

.rowBetween {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.saveRow {
  display: grid;
  grid-template-columns: 1fr 120px;
}

.subtle { font-size: 12px; color: #666; }
.errorText { font-size: 12px; color: #d32f2f; margin-top: 6px; }

.presetList {
  display: grid;
  max-height: 150px;
  overflow: auto;
  padding-right: 4px;
}
.presetItem {
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.presetTitle { font-weight: 700; }

.presetActions { display: flex; }
</style>
