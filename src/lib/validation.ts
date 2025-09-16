import * as yup from 'yup';

// Bilingual error messages
const messages = {
  en: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    password: 'Password must be at least 6 characters',
    confirmPassword: 'Passwords must match',
    username: 'Username must be at least 3 characters',
    otp: 'OTP must be 6 digits',
    minLength: (min: number) => `Must be at least ${min} characters`,
    maxLength: (max: number) => `Must be no more than ${max} characters`,
  },
  fa: {
    required: 'این فیلد الزامی است',
    email: 'لطفاً یک آدرس ایمیل معتبر وارد کنید',
    password: 'رمز عبور باید حداقل 6 کاراکتر باشد',
    confirmPassword: 'رمزهای عبور باید مطابقت داشته باشند',
    username: 'نام کاربری باید حداقل 3 کاراکتر باشد',
    otp: 'کد تایید باید 6 رقم باشد',
    minLength: (min: number) => `باید حداقل ${min} کاراکتر باشد`,
    maxLength: (max: number) => `باید حداکثر ${max} کاراکتر باشد`,
  },
};

// Get current locale (you can pass this from your component)
const getCurrentLocale = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/fa') ? 'fa' : 'en';
  }
  return 'en';
};

// Create validation schemas
export const createValidationSchemas = (locale: 'en' | 'fa' = 'en') => {
  const t = messages[locale];

  return {
    // Signup validation
    signup: yup.object({
      email: yup.string().required(t.required).email(t.email),
      password: yup.string().required(t.required).min(6, t.password),
      confirmPassword: yup
        .string()
        .required(t.required)
        .oneOf([yup.ref('password')], t.confirmPassword),
      username: yup
        .string()
        .required(t.required)
        .min(3, t.username)
        .max(20, t.maxLength(20)),
    }),

    // Login validation
    login: yup.object({
      email: yup.string().required(t.required).email(t.email),
      password: yup.string().when('loginMethod', {
        is: 'password',
        then: (schema) => schema.required(t.required).min(6, t.password),
        otherwise: (schema) => schema.optional(),
      }),
      loginMethod: yup.string().oneOf(['password', 'otp']).required(t.required),
    }),

    // OTP validation
    otp: yup.object({
      otp: yup
        .string()
        .required(t.required)
        .matches(/^\d{6}$/, t.otp),
    }),

    // Email validation for OTP login
    emailForOtp: yup.object({
      email: yup.string().required(t.required).email(t.email),
    }),
  };
};

// Default schemas (English)
export const validationSchemas = createValidationSchemas('en');

// Helper function to get validation schema for current locale
export const getValidationSchema = <
  T extends keyof ReturnType<typeof createValidationSchemas>,
>(
  schemaName: T
): ReturnType<typeof createValidationSchemas>[T] => {
  const locale = getCurrentLocale() as 'en' | 'fa';
  const schemas = createValidationSchemas(locale);
  return schemas[schemaName];
};
