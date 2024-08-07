// Create user type (interface)  

export interface CreateUserInterface {
    username:string;
    fullName:string;
    email:string;
    pic:string;
    oauth:boolean;
    oauthProvider?:string;
    password:string;
}
