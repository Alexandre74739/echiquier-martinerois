import { defineField, defineType } from 'sanity'

export const blogType = defineType({
  name: 'post',
  title: 'Article de blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Résumé',
      type: 'text',
      rows: 3,
      description: 'Court résumé affiché dans les listes.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Texte alternatif', type: 'string' },
            { name: 'caption', title: 'Légende', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Actualité club', value: 'actualite' },
          { title: 'Tournoi', value: 'tournoi' },
          { title: 'Pédagogie', value: 'pedagogie' },
          { title: 'Résultats', value: 'resultats' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', subtitle: 'publishedAt' },
    prepare({ title, media, subtitle }) {
      return { title, media, subtitle: subtitle ? new Date(subtitle).toLocaleDateString('fr-FR') : '' }
    },
  },
  orderings: [{ title: 'Date, récent', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
})
