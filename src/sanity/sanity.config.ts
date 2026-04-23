import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './schema'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name: 'echiquier-martinerois',
  title: "L'Échiquier Martinérois — Administration",
  projectId,
  dataset,
  basePath: '/studio',
  schema,
  plugins: [
    structureTool(),
    visionTool(),
  ],
})
