import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WeFoosball',
    short_name: 'WeFoosball',
    description: 'WeFoosball',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
    ],
  }
}