import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, MessageCircle, Brain, Edit } from 'lucide-react';


const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg inline-flex items-center justify-center">
                <Brain className="w-[40px] h-[40px] text-[#27CAB5] logo-brain" />
              </div>

              <h1 className="text-xl font-bold text-gray-900">PLUSEMIND</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/contact"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Contact
              </Link>

              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                About
              </Link>

              <Link
                to="/test"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Test
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="pt-20 pb-32 bg-contain bg-no-repeat bg-center min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/images/military-man-suffering-from-ptsd-having-psychologist-session 1.png')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center  rounded-lg p-8">
          <h1 className="text-[3.5rem] font-bold text-gray-900 mb-6 leading-tight">
            Feel Better, one step at time
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-bold">
            access therapy, self care tool, and 7/24 support in a safe, judgment-fee space.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="bg-[#009484] text-white px-8 py-3 rounded-[44px] text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Start for free
            </Link>
          </div>
        </div>
      </section>

      {/* Mental Health Journey Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          {/* Left Text Content */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              improving your mental health journey
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-[20px]">
              At Mindful Care, we believe everyone deserves access to quality mental health support.
              Our platform combines professional expertise with innovative technology to provide comprehensive care
              that is accessible, affordable, and effective.
            </p>

            <ul className="space-y-4 text-[22px]">
              <li className="flex items-start py-[5px]">
                <span className="text-green-600 text-2xl mr-3">✔</span>
                <p className="text-gray-700">
                  Licensed therapist with extensive experience in various mental health areas.
                </p>
              </li>
              <li className="flex items-start py-[5px]">
                <span className="text-green-600 text-2xl mr-3">✔</span>
                <p className="text-gray-700">
                  Evidence-based approach detailed to your unique needs.
                </p>
              </li>
              <li className="flex items-start py-[5px]">
                <span className="text-green-600 text-2xl mr-3">✔</span>
                <p className="text-gray-700">
                  Secure platform ensuring your privacy and confidentiality.
                </p>
              </li>
            </ul>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 relative">
            <img
              src="/images/therapist.png"
              alt="Therapist"
              className="rounded-2xl w-full object-cover"
            />
            <div className="absolute bottom-[-40px] left-[-40px] bg-[#00BFA5] text-white px-6 py-6 rounded-xl shadow-lg">
              <p className="text-3xl font-bold leading-tight">5000+</p>
              <p className="text-sm">people helped in the year</p>
            </div>
          </div>
        </div>
      </section>
      {/* Tests Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Try Our Free Mental Health Test
          </h2>
          <p className="text-gray-600 mb-10 font-bold">
            get insight into your mental well being with our professional assessment tool
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-2xl p-6 text-left hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#00BFA5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 9.172a4 4 0 00-5.656 5.656m5.656-5.656L21 3m-7.172 6.172A4 4 0 0115 15m-9 0a4 4 0 015.656-5.656"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Depression Test
              </h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed font-bold">
                a mood disorder that causes a persistent feeling of sadness and loss of interest
              </p>
              <button className="text-[#00BFA5] font-medium flex items-center gap-1 hover:underline">
                Take Test
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-lg rounded-2xl p-6 text-left hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#00BFA5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Anxiety Test
              </h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed font-bold">
                a feeling of fear, dread, and uneasiness
              </p>
              <button className="text-[#00BFA5] font-medium flex items-center gap-1 hover:underline">
                Take Test
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-lg rounded-2xl p-6 text-left hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#00BFA5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personality Test
              </h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed font-bold">
                the enduring characteristics and behavior that comprise a person's unique adjustment to life
              </p>
              <button className="text-[#00BFA5] font-medium flex items-center gap-1 hover:underline">
                Take Test
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* See all button */}
          <div className="mt-10">
            <button className="border border-[#00BFA5] text-[#00BFA5] px-8 py-2 rounded-full font-medium hover:bg-[#00BFA5] hover:text-white transition-colors flex items-center mx-auto gap-2">
              see all tests
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* How We Can Help Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-12">
            How we can help you
          </h2>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-start hover:shadow-lg transition-shadow">
              <div className="text-[#009484] mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-1">
                Therapy and counselling
              </h3>
              <p className="text-gray-600 text-[15px] leading-snug">
                connecting with proficiently doctors via chat or calls.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-start hover:shadow-lg transition-shadow">
              <div className="text-[#009484] mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-1">
                Community support
              </h3>
              <p className="text-gray-600 text-[15px] leading-snug">
                join as anonymous group to share your feelings and heal.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-start hover:shadow-lg transition-shadow">
              <div className="text-[#009484] mb-4">
                <Edit className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-1">
                write your feelings
              </h3>
              <p className="text-gray-600 text-[15px] leading-snug">
                have a note to write your feeling and save it in safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
            Reel story, Real healing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white shadow-md rounded-2xl p-6 text-left hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img
                  src="/images/sam.png"
                  alt="Sam M"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <h3 className="font-semibold text-gray-900">Sam M</h3>
              </div>
              <p className="text-gray-600 italic">
                “ this platform changed my life ”
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-md rounded-2xl p-6 text-left hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img
                  src="/images/jones.png"
                  alt="Jones Map"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <h3 className="font-semibold text-gray-900">Jones Map</h3>
              </div>
              <p className="text-gray-600 italic">
                “ it’s a perfect website to rise your mind and forget every things bad ”
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-md rounded-2xl p-6 text-left hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img
                  src="/images/james.png"
                  alt="James K"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <h3 className="font-semibold text-gray-900">James K</h3>
              </div>
              <p className="text-gray-600 italic">
                “ thanks for all doctors now i feel better ”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#009688]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            You deserve support, Start today.
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-[#009688] font-medium px-6 py-3 rounded-full text-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            Begin your journey
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] border-t-4 border-[#009688] py-8">
        <div className="flex justify-center space-x-6">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#009688] rounded-full p-3 hover:bg-[#009688] hover:text-white transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.3.2 2.3.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6V12H17l-.5 3h-2.3v7A10 10 0 0 0 22 12z" />
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#009688] rounded-full p-3 hover:bg-[#009688] hover:text-white transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 2H6C3.79 2 2 3.79 2 6v12a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6c0-2.21-1.79-4-4-4zM8.78 17H6.4l3.67-4.1L6.4 7h2.43l2.49 3.13L13.7 7h2.4l-3.63 4.03L16.1 17h-2.4l-2.71-3.34z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#009688] rounded-full p-3 hover:bg-[#009688] hover:text-white transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3a3 3 0 1 1 0-6zm4.75-3.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
            </svg>
          </a>
        </div>
      </footer>

    </div>
  );
};

export default Landing;