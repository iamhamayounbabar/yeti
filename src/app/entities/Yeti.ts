export class Attribute {
    trait_type: string;
    value: string;
}

export class AvailableYeti {
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
}