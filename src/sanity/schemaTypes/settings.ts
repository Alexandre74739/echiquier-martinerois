import { defineField, defineType } from 'sanity'

export const settingsType = defineType({
  name: 'settings',
  title: 'Paramètres du site',
  type: 'document',
  fields: [
    defineField({ name: 'siteTitle', title: 'Nom du site', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'email', title: 'Email de contact', type: 'string' }),
    defineField({ name: 'phone', title: 'Téléphone', type: 'string' }),
    defineField({ name: 'address', title: 'Adresse', type: 'text', rows: 3 }),
    defineField({ name: 'schedule', title: 'Horaires (texte libre)', type: 'text', rows: 3 }),
  ],
  preview: { prepare: () => ({ title: 'Paramètres du site' }) },
})
