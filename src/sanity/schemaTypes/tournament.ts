import { defineField, defineType } from 'sanity'

export const tournamentType = defineType({
  name: 'tournament',
  title: 'Tournoi',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom du tournoi',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Lieu',
      type: 'string',
    }),
    defineField({
      name: 'level',
      title: 'Niveau',
      type: 'string',
      options: {
        list: [
          { title: 'Débutant', value: 'débutant' },
          { title: 'Intermédiaire', value: 'intermédiaire' },
          { title: 'Avancé', value: 'avancé' },
          { title: 'Open (tous niveaux)', value: 'open' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'poster',
      title: 'Affiche du tournoi',
      type: 'image',
      options: { hotspot: true },
      description: "Importez l'affiche PDF ou image du tournoi.",
    }),
    defineField({
      name: 'registrationUrl',
      title: "Lien d'inscription",
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date', media: 'poster' },
    prepare({ title, subtitle, media }) {
      return { title, media, subtitle: subtitle ? new Date(subtitle).toLocaleDateString('fr-FR') : 'Date inconnue' }
    },
  },
  orderings: [{ title: 'Date, à venir', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] }],
})
