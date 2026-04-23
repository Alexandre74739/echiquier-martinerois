import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './schema'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name: 'echiquier-martinerois',
  title: "L'Échiquier Martinérois",
  projectId,
  dataset,
  basePath: '/studio',
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Administration')
          .items([
            /* Singleton : Paramètres */
            S.listItem()
              .title('Paramètres du site')
              .icon(() => '⚙️')
              .child(
                S.document()
                  .schemaType('settings')
                  .documentId('siteSettings')
                  .title('Paramètres du site'),
              ),

            S.divider(),

            /* Articles de blog */
            S.listItem()
              .title('Articles de blog')
              .icon(() => '📝')
              .schemaType('post')
              .child(S.documentList().title('Articles').filter('_type == "post"')),

            /* Tournois */
            S.listItem()
              .title('Tournois')
              .icon(() => '♟')
              .schemaType('tournament')
              .child(S.documentList().title('Tournois').filter('_type == "tournament"')),

            S.divider(),

            /* Singleton : Tarifs */
            S.listItem()
              .title('Tarifs')
              .icon(() => '💶')
              .child(
                S.document()
                  .schemaType('pricing')
                  .documentId('sitePricing')
                  .title('Tarifs du club'),
              ),
          ]),
    }),
  ],
})
