export enum Category {
    PRODUCT = 'product',
    COMMISSION = 'commission',
    UNKNOWN = '',
}
export class Commission {
    commissionname: string;
    commissiondescription: string;
    slot: string;
    price: string;
    category: Category.UNKNOWN;

    commissionimage: {
        filename: string,
        contentType: string, 
        imageBase64: string
    }

    constructor() {
        this.commissionname = '';
        this.commissiondescription = '';
        this.slot = '';
        this.price = '';
        this.commissionimage = {
            filename : '',
            contentType : '',
            imageBase64 : ''
        };
    }
}