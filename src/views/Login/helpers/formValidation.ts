import { LoginFormData } from "../types";

/**
 * Validates login form fields
 */
export const validateLoginFields = (formData: LoginFormData) => {
  const errors: Record<string, string> = {};
  if (!formData.email) {
    errors.email = 'Enter your email address.';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!formData.password) errors.password = 'Enter your password.';
  return errors;
};
