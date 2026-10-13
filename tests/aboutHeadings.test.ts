import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'

describe('About page section headings', () => {
  it('uses h2 elements for all collapsible section titles', () => {
    const source = readFileSync('app/pages/about.vue', 'utf8')
    const titles = [
      'page.introductionHeading',
      'page.missionTitle',
      'page.principlesHeading',
      'page.shortNormsHeading',
      'page.collectiveNormsHeading',
      'page.securityHeading',
      'page.securityMeetingsHeading',
    ]

    for (const title of titles) {
      expect(source).toMatch(new RegExp(`<h2 class="card-title display">\\{\\{ ${title} \\}\\}</h2>`))
    }
  })
})
