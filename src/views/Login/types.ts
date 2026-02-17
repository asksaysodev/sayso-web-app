// ===== React Hook Form types ===== //
export interface LoginFormData {
    name: string;
    lastname: string;
    company: string;
    email: string;
    password: string;
    repeatPassword: string;
  }

  export interface ResetPasswordFormData {
    newPassword: string;
    confirmPassword: string;
  }

  export interface PasswordRecoveryFormData {
    email: string;
  }