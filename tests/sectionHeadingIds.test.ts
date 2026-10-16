import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PageProseSection from '../app/components/page/PageProseSection.vue'
import PageSplitSection from '../app/components/page/PageSplitSection.vue'
import HomeActivityGrid from '../app/components/home/ActivityGrid.vue'
import ContactSection from '../app/components/ContactSection.vue'
import FridgeClosingCta from '../app/components/fridge/FridgeClosingCta.vue'
import { makeSettings } from './fixtures'
import { DEFAULT_CONTACT_FORM } from '../app/utils/contentDefaults'

// A section that names itself must name it with a heading that exists, exactly once in the page.
// A section with no aria-labelledby is unnamed on purpose, so it is skipped here.
function expectUniqueLabeledHeadings(wrapper: ReturnType<typeof mount>) {
  for (const section of wrapper.findAll('section')) {
    const headingId = section.attributes('aria-labelledby')
    if (headingId === undefined) continue
    expect(headingId).toBeTruthy()
    expect(wrapper.findAll(`#${headingId}`).length).toBe(1)
    expect(section.find(`#${headingId}`).exists()).toBe(true)
  }
}

// Every id on the page is unique, which covers the error messages a form points aria-describedby at.
function expectUniqueIds(wrapper: ReturnType<typeof mount>) {
  const ids = wrapper.findAll('[id]').map((el) => el.attributes('id'))
  expect(new Set(ids).size).toBe(ids.length)
}

const contactProps = { formCopy: DEFAULT_CONTACT_FORM, settings: makeSettings() }

describe('section heading IDs', () => {
  it('keeps repeated sections labelled by their own unique headings', () => {
    const wrapper = mount({
      components: { PageProseSection, PageSplitSection, HomeActivityGrid, ContactSection, FridgeClosingCta },
      data: () => ({ contactProps, settings: makeSettings() }),
      template: `
        <div>
          <PageProseSection heading="First prose" />
          <PageProseSection heading="Second prose" />
          <PageSplitSection heading="First split" />
          <PageSplitSection heading="Second split" />
          <HomeActivityGrid heading="First activities" :activities="[]" email="one@example.test" />
          <HomeActivityGrid heading="Second activities" :activities="[]" email="two@example.test" />
          <ContactSection heading="First contact" :form-copy="contactProps.formCopy" :settings="settings" />
          <ContactSection heading="Second contact" :form-copy="contactProps.formCopy" :settings="settings" />
          <FridgeClosingCta heading="First closing" note="n" :cta="{ label: 'Go', href: '/a' }" />
          <FridgeClosingCta heading="Second closing" note="n" :cta="{ label: 'Go', href: '/b' }" />
          <FridgeClosingCta note="n" :cta="{ label: 'Go', href: '/c' }" />
        </div>
      `,
    })

    expectUniqueLabeledHeadings(wrapper)
    expectUniqueIds(wrapper)
  })

  it('keeps the error messages of two contact forms unique', async () => {
    const wrapper = mount({
      components: { ContactSection },
      data: () => ({ contactProps, settings: makeSettings() }),
      template: `
        <div>
          <ContactSection heading="First contact" :form-copy="contactProps.formCopy" :settings="settings" />
          <ContactSection heading="Second contact" :form-copy="contactProps.formCopy" :settings="settings" />
        </div>
      `,
    })

    // Let the submit reach the field validation; jsdom would stop at the browser's own required-field check.
    const checkValidity = vi.spyOn(HTMLFormElement.prototype, 'checkValidity').mockReturnValue(true)
    for (const form of wrapper.findAll('form')) {
      await form.trigger('submit')
    }
    await flushPromises()
    checkValidity.mockRestore()

    expect(wrapper.findAll('.field-error').length).toBeGreaterThan(0)
    expectUniqueIds(wrapper)
  })

  it('leaves a section without a heading unnamed and without an empty heading', () => {
    const prose = mount(PageProseSection, { props: { body: 'Just words' } })
    expect(prose.attributes('aria-labelledby')).toBeUndefined()
    expect(prose.find('h2').exists()).toBe(false)

    const grid = mount(HomeActivityGrid, { props: { activities: [], email: 'x@example.test' } })
    expect(grid.attributes('aria-labelledby')).toBeUndefined()
    expect(grid.find('h2').exists()).toBe(false)

    const cta = mount(FridgeClosingCta, {
      props: { note: 'Just a note', cta: { label: 'Go', href: '/c' } },
    })
    expect(cta.attributes('aria-labelledby')).toBeUndefined()
    expect(cta.find('h2').exists()).toBe(false)
  })
})
