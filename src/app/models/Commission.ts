export enum Category {
    PRODUCT = 'product',
    COMMISSION = 'commission',
    UNKNOWN = '',
}
export class Commission {
    servicename: string;
    servicedescription: string;
    slot: string;
    price: string;
    category: Category.UNKNOWN;

    serviceimage: {
        filename: string,
        contentType: string, 
        imageBase64: string
    }

    constructor() {
        this.servicename = '';
        this.servicedescription = '';
        this.slot = '';
        this.price = '';
        this.serviceimage = {
            filename : '',
            contentType : '',
            imageBase64 : ''
        };
    }
}