
export enum Category {
    PRODUCT = 'product',
    COMMISSION = 'commission',
    UNKNOWN = '',
}
export enum payment_Category {
    half = 'half',
    full = 'full',
    UNKNOWN = '',
}
export class Commission {
    orderStatus: string
    orderType: Category
    proof: {
        filename : string
        contentType : string
        imageBase64 : string
    }
    payment_status: payment_Category

    totalAmount: number

    constructor(){
        this.orderStatus = ''
        this.orderType = Category.UNKNOWN
        this.proof.filename = ''
        this.proof.contentType = ''
        this.proof.imageBase64 = ''
        this.payment_status = payment_Category.UNKNOWN
        this.totalAmount = 0
    }

}