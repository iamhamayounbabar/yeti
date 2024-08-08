import { Attribute } from './attribute.model';
export interface Nft {
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