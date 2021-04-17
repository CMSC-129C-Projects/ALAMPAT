export enum UserType {
    BUYER = 'buyer',
    SELLER = 'seller',
    UNKNOWN = '',
}

export class User {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    userType: UserType;

    constructor() {
        this.name = '';
        this.email = '';
        this.phoneNumber = '';
        this.address = '';
        this.password = '';
        this.userType = UserType.UNKNOWN
    }
}
