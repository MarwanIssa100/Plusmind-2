import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaHome
} from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { loginValidation } from "../../utils/validation";
import {
  loginStart,
  loginSuccess,
  loginFailure
} from "../../store/slices/authSlice";
import { authService } from "../../services/supabase";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (values) => {
    dispatch(loginStart());
    try {
      const { data, error } = await authService.signIn(
        values.email,
        values.password
      );

      if (error) {
        dispatch(loginFailure(error.message));
        return;
      }

      if (data.user) {
        dispatch(
          loginSuccess({
            user: data.user,
            userType: data.user.user_metadata.user_type
          })
        );
        navigate("/dashboard");
      }
    } catch (err) {
      dispatch(loginFailure("An unexpected error occurred"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* Home Icon */}
      <Link
        to="/"
        className="absolute top-4 left-4 text-gray-600 hover:text-[#009484]"
      >
        <FaHome size={24} />
      </Link>

      {/* Login Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Tabs */}
        <div className="flex justify-between mb-8 border-b border-gray-200">
          <Link
            to="/register"
            className="w-1/2 text-center pb-2 text-gray-500 font-medium hover:text-[#009484]"
          >
            sign up
          </Link>
          <div className="w-1/2 text-center pb-2 border-b-4 border-[#009484] text-[#009484] font-semibold">
            log in
          </div>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidation}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#009484]"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#009484]"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-[#009484] hover:bg-[#007a6d] text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6">
          <a
            href="https://www.facebook.com/profile.php?id=61578756504952"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-blue-600 transition"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://www.instagram.com/plusemind277/followers/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-pink-500 transition"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://www.linkedin.com/company/plusemind/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-blue-700 transition"
          >
            <FaLinkedinIn size={20} />
          </a>
          <a
            href="https://www.tiktok.com/@plusemind"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-black transition"
          >
            <FaTiktok size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}
