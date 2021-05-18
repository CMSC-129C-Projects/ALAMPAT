export class Products {
    productName: string;
    productDescription: string;
    productImage: HTMLImageElement;

    constructor() {
        var img = new Image();
        this.productName = '';
        this. productDescription = '';
        this.productImage = img;
    }
}