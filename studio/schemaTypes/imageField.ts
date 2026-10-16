import { defineField, type ImageDefinition } from 'sanity'

type ImageValue = { asset?: unknown; decorative?: boolean }

// Every image field is built with this so editors always get an alt text box.
// Alt text is required once an image is uploaded, unless the editor marks the
// image as decorative, in which case the site renders it with alt="".
export function imageField(config: Omit<ImageDefinition, 'type' | 'fields'>) {
  return defineField({
    ...config,
    type: 'image',
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Describe what the image shows for people who can’t see it. Don’t repeat the nearby heading.',
        hidden: ({ parent }) => (parent as ImageValue | undefined)?.decorative === true,
        // `hidden` only affects the form, so the validator checks the decorative flag itself
        validation: (rule) => rule.custom((alt: string | undefined, { parent }) => {
          const image = parent as ImageValue | undefined
          if (!image?.asset || image.decorative) return true
          return alt?.trim() ? true : 'Add alt text, or turn on “Decorative image”'
        }),
      }),
      defineField({
        name: 'decorative',
        title: 'Decorative image',
        type: 'boolean',
        description: 'Turn on only if the image adds no information, like a background pattern. Screen readers will skip it.',
      }),
    ],
  })
}
