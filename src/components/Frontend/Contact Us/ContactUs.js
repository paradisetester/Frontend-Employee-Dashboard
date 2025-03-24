import React from 'react';
import ContactUsForm from './ContactUsForm';

const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-6">
        We are here to answer any questions you may have. Please fill out the form below and we will get in touch with you as soon as possible.
      </p>
      <ContactUsForm />
    </div>
  );
};

export default ContactUs;
