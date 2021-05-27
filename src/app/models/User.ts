export enum UserType {
    BUYER = 'buyer',
    SELLER = 'seller',
    UNKNOWN = '',
}

export class User {
    name: string;
    profileImage:{
        filename: string,
        contentType: string, 
        imageBase64: string
    }
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    userType: UserType;
    description: string;
    constructor() {
        this.name = '';
        this.email = '';
        this.phoneNumber = '';
        this.address = '';
        this.password = '';
        this.userType = UserType.UNKNOWN;
        this.profileImage.filename = '';
        this.profileImage.contentType = '';
        this.profileImage.imageBase64 = '';
        this.description = '';
    }
}
