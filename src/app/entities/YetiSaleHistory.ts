export interface YetiSaleHistory {
    status: string
    code: string
    data: YetiSaleDetails[]
  }
  
  export interface YetiSaleDetails {
    quantity: number
    txId: string
    to: string
    type: string
    timestamp: number
    price?: string
    from?: string
  }
  