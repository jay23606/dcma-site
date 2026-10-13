import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageProseSection from '../app/components/page/PageProseSection.vue'
import PageSplitSection from '../app/components/page/PageSplitSection.vue'
import HomeActivityGrid from '../app/components/home/ActivityGrid.vue'

function expectUniqueLabeledHeadings(wrapper: ReturnType<typeof mount>) {
  for (const section of wrapper.findAll('section')) {
    const headingId = section.attributes('aria-labelledby')
    expect(headingId).toBeTruthy()
    expect(wrapper.findAll(`#${headingId}`).length).toBe(1)
    expect(section.find(`#${headingId}`).exists()).toBe(true)
  }
}

describe('section heading IDs', () => {
  it('keeps repeated sections labelled by their own unique headings', () => {
    const wrapper = mount({
      components: { PageProseSection, PageSplitSection, HomeActivityGrid },
      template: `
        <div>
          <PageProseSection heading="First prose" />
          <PageProseSection heading="Second prose" />
          <PageSplitSection heading="First split" />
          <PageSplitSection heading="Second split" />
          <HomeActivityGrid heading="First activities" :activities="[]" email="one@example.test" />
          <HomeActivityGrid heading="Second activities" :activities="[]" email="two@example.test" />
        </div>
      `,
    })

    expectUniqueLabeledHeadings(wrapper)
  })
})
