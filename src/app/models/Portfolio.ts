export class Portfolio {
    artworkname: string;
    artworkdescription: string;
    artworkimage: HTMLImageElement;

    constructor() {
        var img = new Image();
        this.artworkname = '';
        this.artworkdescription = '';
        this.artworkimage = img;
    }
}
