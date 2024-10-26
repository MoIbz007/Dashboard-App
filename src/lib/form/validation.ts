export type ValidationResult = string | null;

export const validateRequired = (value: any): ValidationResult =>
  value ? null : 'This field is required';

export const validateEmail = (value: string): ValidationResult => {
  if (!value) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : 'Invalid email address';
};

export const validateMinLength = (length: number) => (value: string): ValidationResult =>
  value.length >= length ? null : `Must be at least ${length} characters`;

export const validateMaxLength = (length: number) => (value: string): ValidationResult =>
  value.length <= length ? null : `Must be no more than ${length} characters`;

export const validatePattern = (pattern: RegExp, message: string) => (value: string): ValidationResult =>
  pattern.test(value) ? null : message;

export const validateNumber = (value: string): ValidationResult => {
  if (!value) return 'This field is required';
  return isNaN(Number(value)) ? 'Must be a number' : null;
};

export const validateRange = (min: number, max: number) => (value: number): ValidationResult =>
  value >= min && value <= max ? null : `Must be between ${min} and ${max}`;

export const composeValidators = (...validators: ((value: any) => ValidationResult)[]) =>
  (value: any): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (result) return result;
    }
    return null;
  };
