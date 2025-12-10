export interface SeriesData {
  githubUrl?: string
  texts?: {
    [key: string]: {
      title?: string
      description?: string
      button?: string
    }
  }
}

export const seriesData: Record<string, SeriesData> = {
  'StarDraw': {
    githubUrl: 'https://github.com/hunkstalker/stardraw',
    texts: {
      es: {
        title: 'Código Abierto',
      },
      ca: {
        title: 'Codi Obert',
      },
      en: {
        title: 'Open Source',
      }
    }
  }
}
