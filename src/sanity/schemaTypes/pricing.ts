import { defineField, defineType } from 'sanity'

export const pricingType = defineType({
  name: 'pricing',
  title: 'Tarifs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la section',
      type: 'string',
      initialValue: 'Tarifs',
    }),
    defineField({
      name: 'tiers',
      title: 'Formules tarifaires',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Nom de la formule', type: 'string' },
            { name: 'price', title: 'Prix (ex: "90 €/an")', type: 'string' },
            { name: 'description', title: 'Description courte', type: 'string' },
            {
              name: 'features',
              title: 'Avantages',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Ajoutez un avantage par ligne.',
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'price' },
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Tarifs du club' }) },
})
