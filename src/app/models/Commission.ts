export enum Category {
    PRODUCT = 'product',
    COMMISSION = 'commission',
    UNKNOWN = '',
}
export class Commission {
    commissionname: string;
    commissiondescription: string;
    slot: number;
    price: number;
    category: Category;
    days: number;
    terms: string;

    commissionimage: {
        filename: string,
        contentType: string, 
        imageBase64: string
    }

    constructor() {
        this.commissionname = '';
        this.commissiondescription = '';
        this.slot = 0;
        this.price = 0;
        this.days = 0;
        this.terms = "";
        this.commissionimage = {
            filename : '',
            contentType : '',
            imageBase64 : ''
        };
        this.category = Category.UNKNOWN;
    }
}