import * as Yup from 'yup';

export const loginValidation = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const patientRegistrationValidation = Yup.object({
  full_name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .required('Phone number is required'),
  date_of_birth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  primary_concern: Yup.string()
    .min(10, 'Please provide more details about your primary concern')
    .required('Primary concern is required'),
});

export const therapistRegistrationValidation = Yup.object({
  full_name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .required('Phone number is required'),
  specialization: Yup.string()
    .required('Specialization is required'),
  license_number: Yup.string()
    .required('License number is required'),
  years_experience: Yup.number()
    .min(0, 'Experience cannot be negative')
    .max(60, 'Experience seems too high')
    .required('Years of experience is required'),
  bio: Yup.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(1000, 'Bio must be less than 1000 characters')
    .required('Bio is required'),
});

export const blogPostValidation = Yup.object({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .required('Title is required'),
  content: Yup.string()
    .min(50, 'Content must be at least 50 characters')
    .required('Content is required'),
});

export const noteValidation = Yup.object({
  title: Yup.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  content: Yup.string()
    .min(1, 'Content is required')
    .required('Content is required'),
});