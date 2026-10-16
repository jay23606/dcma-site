import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageSections from '../app/components/page/PageSections.vue'
import HomeHero from '../app/components/home/HomeHero.vue'
import PageSplitSection from '../app/components/page/PageSplitSection.vue'
import HomeActivityGrid from '../app/components/home/ActivityGrid.vue'
import { makeCard, makeSettings } from './fixtures'
import { DEFAULT_CONTACT_FORM } from '../app/utils/contentDefaults'
import type { PageSection } from '../app/types/content'

// Regression (#79): an image without alt text used to borrow its section heading
// or card title, so screen readers heard the heading twice and got no
// description of the image. It should get alt="" instead.
function mountSections(sections: PageSection[]) {
  return mount(PageSections, {
    props: { sections, settings: makeSettings(), contactForm: DEFAULT_CONTACT_FORM },
    global: { components: { HomeHero, PageSplitSection, HomeActivityGrid } },
  })
}

function imageSections(alt?: string): PageSection[] {
  return [
    { _key: 'hero', _type: 'heroSection', heading: 'Hero heading', imageUrl: '/hero.jpg', imageAlt: alt },
    { _key: 'split', _type: 'splitSection', heading: 'Split heading', imageUrl: '/split.jpg', imageAlt: alt },
    {
      _key: 'cards', _type: 'cardGridSection', heading: 'Cards heading',
      cards: [makeCard({ title: 'Card title', imageUrl: '/card.jpg', imageAlt: alt })],
    },
  ]
}

describe('Image alt text', () => {
  it('renders empty alt, not the heading or title, when an image has no alt text', () => {
    const w = mountSections(imageSections())

    expect(w.findAll('img').map((img) => img.attributes('alt'))).toEqual(['', '', ''])
  })

  it('renders the alt text from Sanity when there is one', () => {
    const w = mountSections(imageSections('Volunteers unload rescued food donations'))

    expect(w.findAll('img').map((img) => img.attributes('alt'))).toEqual([
      'Volunteers unload rescued food donations',
      'Volunteers unload rescued food donations',
      'Volunteers unload rescued food donations',
    ])
  })
})
