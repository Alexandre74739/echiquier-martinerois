'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/src/sanity/sanity.config'

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center text-blanc p-8">
        <div className="max-w-lg text-center">
          <span className="text-6xl block mb-6" aria-hidden="true">♞</span>
          <h1 className="font-display text-4xl mb-4">Studio non configuré</h1>
          <p className="text-gris mb-6 leading-relaxed">
            Pour activer le CMS, créez un projet sur{' '}
            <a href="https://sanity.io" className="text-red hover:underline" target="_blank" rel="noopener noreferrer">
              sanity.io
            </a>{' '}
            et ajoutez les variables d'environnement dans <code className="text-red">.env.local</code> :
          </p>
          <pre className="bg-gris-fonce text-left p-4 text-sm text-blanc mb-6 overflow-x-auto">
{`NEXT_PUBLIC_SANITY_PROJECT_ID=votre_id
NEXT_PUBLIC_SANITY_DATASET=production`}
          </pre>
          <p className="text-xs text-gris">
            Redémarrez ensuite le serveur de développement.
          </p>
        </div>
      </div>
    )
  }

  return <NextStudio config={config} />
}
