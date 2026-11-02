export interface SignupFormData {
    name: string;
    lastname: string;
    company: string;
    phone: string;
    email: string;
    password: string;
    repeatPassword: string;
}

export type SignupSubStep = 1 | 2;
