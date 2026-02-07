import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Toast from '../src/components/Toast.vue'

const stubs = {
  ConfigPanel: { template: '<div />' },
  ConfigPreview: {
    emits: ['show'],
    template: '<button @click="$emit(\'show\')">Show Notification</button>'
  },
  'q-btn': {
    props: ['label', 'icon'],
    emits: ['click'],
    template: '<button @click="$emit(\'click\')">{{ label }}<slot /></button>'
  }
}

describe('Toast', () => {
  it('adds toast when click show button', async () => {
    const wrapper = mount(Toast, { global: { stubs } })

    const btn = wrapper.findAll('button').find((b) => b.text().includes('Show'))
    await btn!.trigger('click')

    expect(wrapper.findAll('.toastItem').length).toBe(1)
  })

  it('removes toast after time finished', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Toast, { global: { stubs } })

    const btn = wrapper.findAll('button').find((b) => b.text().includes('Show'))
    await btn!.trigger('click')

    expect(wrapper.findAll('.toastItem').length).toBe(1)

    vi.advanceTimersByTime(3500)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.toastItem').length).toBe(0)

    vi.useRealTimers()
  })

  it('close button remove the toast', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Toast, { global: { stubs } })

    const btn = wrapper.findAll('button').find((b) => b.text().includes('Show'))
    await btn!.trigger('click')

    expect(wrapper.findAll('.toastItem').length).toBe(1)

    await wrapper.find('.toastItem button').trigger('click')

    vi.advanceTimersByTime(600)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.toastItem').length).toBe(0)

    vi.useRealTimers()
  })

  it('shows toast in bottom right position', async () => {
    const wrapper = mount(Toast, { global: { stubs } })

    const btn = wrapper.findAll('button').find((b) => b.text().includes('Show'))
    await btn!.trigger('click')

    expect(wrapper.find('.pos-bottom-right').exists()).toBe(true)
    expect(wrapper.find('.pos-bottom-right').findAll('.toastItem').length).toBe(1)
  })
})
