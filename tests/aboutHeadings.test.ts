import { describe, it, expect, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import AboutSectionCard from '../app/components/about/SectionCard.vue'

describe('About section cards', () => {
  afterEach(() => {
    window.location.hash = ''
  })

  it('renders the title as an h2 whose only child is the toggle button', () => {
    const wrapper = mount(AboutSectionCard, { props: { id: 'security', title: 'Security norms' } })
    const heading = wrapper.find('h2')

    expect(heading.text()).toBe('Security norms')
    expect(heading.element.children).toHaveLength(1)
    expect(heading.find('button').exists()).toBe(true)
  })

  it('starts collapsed and toggles its body with aria-expanded', async () => {
    const wrapper = mount(AboutSectionCard, { props: { id: 'principles', title: 'Principles' }, attachTo: document.body })
    const button = wrapper.find('button')

    expect(button.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.card-body').isVisible()).toBe(false)

    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.card-body').isVisible()).toBe(true)

    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.card-body').isVisible()).toBe(false)
  })

  it('starts open when defaultOpen is set', () => {
    const wrapper = mount(AboutSectionCard, { props: { id: 'mission', title: 'Mission', defaultOpen: true }, attachTo: document.body })

    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.card-body').isVisible()).toBe(true)
  })

  it('points the button at the body it controls', () => {
    const wrapper = mount(AboutSectionCard, { props: { id: 'security', title: 'Security' } })

    const controls = wrapper.find('button').attributes('aria-controls')
    expect(controls).toBeTruthy()
    expect(wrapper.find(`#${controls}`).classes()).toContain('card-body')
  })

  it('opens a section that the URL hash links to', async () => {
    window.location.hash = '#security'
    const wrapper = mount(AboutSectionCard, { props: { id: 'security', title: 'Security' }, attachTo: document.body })
    await flushPromises()

    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })
})
