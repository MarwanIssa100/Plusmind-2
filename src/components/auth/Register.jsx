import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Users, UserCheck, Eye, EyeOff, Heart, Mail, Lock, User, Phone, Calendar, FileText, Award, BookOpen } from 'lucide-react';
import { patientRegistrationValidation, therapistRegistrationValidation } from '../../utils/validation';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { authService } from '../../services/supabase';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [userType, setUserType] = React.useState('patient');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const getValidationSchema = () => {
    return userType === 'patient' ? patientRegistrationValidation : therapistRegistrationValidation;
  };

  const getInitialValues = () => {
    const commonValues = {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    };

    if (userType === 'patient') {
      return {
        ...commonValues,
        date_of_birth: '',
        primary_concern: '',
      };
    } else {
      return {
        ...commonValues,
        specialization: '',
        license_number: '',
        years_experience: '',
        bio: '',
      };
    }
  };

  const handleSubmit = async (values) => {
    dispatch(loginStart());
    
    try {
      const { confirmPassword, ...userData } = values;
      
      const additionalData = userType === 'patient'
        ? { date_of_birth: values.date_of_birth, primary_concern: values.primary_concern }
        : { 
            specialization: values.specialization, 
            license_number: values.license_number, 
            years_experience: parseInt(values.years_experience), 
            bio: values.bio 
          };

      const { data, error } = await authService.signUp({
        ...userData,
        user_type: userType,
        additionalData,
      });
      
      if (error) {
        dispatch(loginFailure(error.message));
        return;
      }

      if (data.user) {
        dispatch(loginSuccess({
          user: data.user,
          userType: userType
        }));
        navigate('/dashboard');
      }
    } catch (err) {
      dispatch(loginFailure('An unexpected error occurred'));
    }
  };

  const specializations = [
    'Anxiety Disorders',
    'Depression',
    'PTSD',
    'Bipolar Disorder',
    'Eating Disorders',
    'Addiction',
    'Family Therapy',
    'Couples Therapy',
    'Child Psychology',
    'Cognitive Behavioral Therapy',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Heart className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join MindCare Connect
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start your mental health journey
          </p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">I am a:</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'patient'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">Patient</div>
              <div className="text-sm text-gray-500">Seeking mental health support</div>
            </button>
            <button
              type="button"
              onClick={() => setUserType('therapist')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'therapist'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <UserCheck className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">Therapist</div>
              <div className="text-sm text-gray-500">Providing mental health care</div>
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <Formik
            key={userType}
            initialValues={getInitialValues()}
            validationSchema={getValidationSchema()}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Common Fields */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="full_name"
                        className="pl-10 pr-3 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <ErrorMessage name="full_name" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        className="pl-10 pr-3 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className="pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Create password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          className="pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="tel"
                        name="phone"
                        className="pl-10 pr-3 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                {/* User-specific fields */}
                {userType === 'patient' && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            type="date"
                            name="date_of_birth"
                            className="pl-10 pr-3 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <ErrorMessage name="date_of_birth" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="primary_concern" className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Concern
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                            <FileText className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            as="textarea"
                            name="primary_concern"
                            rows={3}
                            className="pl-10 pr-3 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Briefly describe your primary mental health concern or what you're looking for help with..."
                          />
                        </div>
                        <ErrorMessage name="primary_concern" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>
                )}

                {userType === 'therapist' && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Specialization
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <BookOpen className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              as="select"
                              name="specialization"
                              className="pl-10 pr-3 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select specialization</option>
                              {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                  {spec}
                                </option>
                              ))}
                            </Field>
                          </div>
                          <ErrorMessage name="specialization" component="div" className="mt-1 text-sm text-red-600" />
                        </div>

                        <div>
                          <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 mb-2">
                            Years of Experience
                          </label>
                          <Field
                            type="number"
                            name="years_experience"
                            min="0"
                            max="60"
                            className="px-3 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. 5"
                          />
                          <ErrorMessage name="years_experience" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 mb-2">
                          License Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            type="text"
                            name="license_number"
                            className="pl-10 pr-3 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your license number"
                          />
                        </div>
                        <ErrorMessage name="license_number" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                          Professional Bio
                        </label>
                        <Field
                          as="textarea"
                          name="bio"
                          rows={4}
                          className="px-3 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Tell us about your background, approach to therapy, and what makes you passionate about helping others..."
                        />
                        <ErrorMessage name="bio" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Sign in here
                    </Link>
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;