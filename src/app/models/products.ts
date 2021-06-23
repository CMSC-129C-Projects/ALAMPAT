export class Products {
    productName: string;
    productDescription: string;
    productImage:{
        filename: string,
        contentType: string, 
        imageBase64: string
    }
    category: string;
    stock: number;
    price: number;

    constructor() {
        
        this.productName = '';
        this. productDescription = '';
        this.productImage.filename = '';
        this.productImage.contentType = '';
        this.productImage.imageBase64 = '';
        this.category = '';
        this.stock = 0;
        this.price = 0;
    }
}