export interface YetiTrait {
    yetiId: number
    traits: Trait[]
  }
  
  export interface Trait {
    traitType: string
    traitValue: string
    traitCount: number
    traitPerc: number
  }