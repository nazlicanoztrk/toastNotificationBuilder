import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import PresetTable from '../src/components/PresetTable.vue'

vi.mock('../src/supabase', () => ({
  supabase: null,
  isSupabaseConfigured: false
}))

const stubs = {
  'q-card': { template: '<div><slot /></div>' },
  'q-input': {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
      '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
  },
  'q-btn': {
    props: ['label'],
    emits: ['click'],
    template: '<button @click="$emit(\'click\')">{{ label }}<slot /></button>'
  }
}

describe('PresetTable', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('save preset to localStorage when click Save', async () => {
    const wrapper = mount(PresetTable, {
      props: {
        config: {
          type: 'success',
          title: 'A',
          message: 'B',
          duration: 3000,
          position: 'bottom-right',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          showIcon: true,
          showCloseButton: true,
          animation: 'slide'
        }
      },
      global: { stubs }
    })

    await wrapper.find('input').setValue('My Preset')

    const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'))
    await saveBtn!.trigger('click')

    await wrapper.vm.$nextTick()

    const raw = localStorage.getItem('presets')
    expect(raw).toBeTruthy()

    const list = JSON.parse(raw as string)
    expect(list.length).toBe(1)
    expect(list[0].name).toBe('My Preset')
  })

  it('emit load event when click Load button', async () => {
    const fakeList = [{ id: '1', name: 'P1', config: { title: 'X' } }]
    localStorage.setItem('presets', JSON.stringify(fakeList))

    const wrapper = mount(PresetTable, {
      props: { config: {} as any },
      global: { stubs }
    })

    await wrapper.vm.$nextTick()

    const loadBtn = wrapper.findAll('button').find((b) => b.text().includes('Load'))
    await loadBtn!.trigger('click')

    expect(wrapper.emitted('load')).toBeTruthy()
    expect(wrapper.emitted('load')![0][0]).toEqual(fakeList[0].config)
  })
})
