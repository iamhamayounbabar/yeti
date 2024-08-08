export interface Farm {
    farmType: number,
    isSynergyBoosted: number,
    isWaterBoosted: number,
    lastClaimedOn: string,
    level: number,
    name: string,
    totalClaimed: number,
    totalUnClaimed: string,
    tribesHoused: string[],
    yetisHoused: number[]
}