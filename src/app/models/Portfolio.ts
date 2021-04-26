export class Portfolio {
    artworkname: string;
    artworkdescription: string;
    artworkimage: {
        filename: string,
        contentType: string, 
        imageBase64: string
    }

    constructor() {
        this.artworkname = '';
        this.artworkdescription = '';
        this.artworkimage = {
            filename : '',
            contentType : '',
            imageBase64 : ''
        };
    }
}
