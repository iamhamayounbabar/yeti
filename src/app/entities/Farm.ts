export class Attribute {
    trait_type: string;
    value: string;
}

export class Detail {
    FarmType: string;
    isRevealed: boolean;
    isSynergyBoosted: string;
    isWaterBoosted: string;
    lastClaimedOn: number;
    level: string;
    name: string;
    totalClaimed: string;
    totalUnClaimed: string;
    tribesHoused: string[];
    yetisHoused: string[];
    dailyFrmdDistribution: string;
  }

export class Farm {
    id: number;
    name: string;
    description: string;
    image: string;
    edgeImage: string;
    dna: string;
    edition: number;
    date: any;
    attributes: Attribute[];
    compiler: string;
    frmd: number;
    icon: string;
    detail: Detail
}

