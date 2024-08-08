export interface Market {
    total: number
    activities: Activity[]
  }
  
  export interface Activity {
    yetiId: number
    price: number
    status: string
    date: string
    fromA: string
    toA: string
    tribe: string
    rank: number
    imageSrc: string
    craftHistory: string
  }
  