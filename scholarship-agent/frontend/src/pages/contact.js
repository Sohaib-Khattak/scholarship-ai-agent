import React, { useState } from 'react';
import { Mail, MessageCircle, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success('✅ Message sent! Sohaib will get back to you soon.');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">📞 Get in Touch</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a
            href="mailto:sohaib@example.com"
            className="bg-white/20 hover:bg-white/30 p-6 rounded-lg text-center transition-colors"
          >
            <Mail size={32} className="mx-auto mb-3" />
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-sm">sohaib@example.com</p>
          </a>

          <a
            href="https://wa.me/1234567890"
            className="bg-white/20 hover:bg-white/30 p-6 rounded-lg text-center transition-colors"
          >
            <MessageCircle size={32} className="mx-auto mb-3" />
            <h3 className="font-bold mb-2">WhatsApp</h3>
            <p className="text-sm">Message us directly</p>
          </a>

          <a
            href="https://linkedin.com/in/sohaib"
            className="bg-white/20 hover:bg-white/30 p-6 rounded-lg text-center transition-colors"
          >
            <Globe size={32} className="mx-auto mb-3" />
            <h3 className="font-bold mb-2">LinkedIn</h3>
            <p className="text-sm">Connect with Sohaib</p>
          </a>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur p-8 rounded-lg">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message here..."
            className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/50 mb-4 focus:outline-none focus:ring-2 focus:ring-white"
            rows="5"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-white text-primary font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
