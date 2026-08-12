/**
 * EnhancedContactForm
 * -------------------
 * Modern glassmorphic form with micro-animations,
 * smooth transitions, and professional styling
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, EnvelopeIcon, PhoneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const inputVariants = {
  initial: { scale: 1 },
  focus: { scale: 1.02 },
  hover: { scale: 1.01 },
};

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function EnhancedContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Submitting...');

    try {
      const db = getFirestore(app);
      const contactsCollection = collection(db, 'contacts');

      await addDoc(contactsCollection, {
        ...formData,
        timestamp: serverTimestamp(),
      });

      setSubmitted(true);
      setStatus('');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setStatus(`Error: ${error.message || 'Failed to send message.'}`);
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Name Field */}
      <motion.div variants={itemVariants}>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
          Full Name
        </label>
        <motion.input
          variants={inputVariants}
          whileFocus="focus"
          whileHover="hover"
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
          className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/60 text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600/50 focus:border-slate-600 focus:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm"
        />
      </motion.div>

      {/* Email Field */}
      <motion.div variants={itemVariants}>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
          Email Address
        </label>
        <motion.input
          variants={inputVariants}
          whileFocus="focus"
          whileHover="hover"
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/60 text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600/50 focus:border-slate-600 focus:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm"
        />
      </motion.div>

      {/* Subject Field */}
      <motion.div variants={itemVariants}>
        <label htmlFor="subject" className="block text-sm font-semibold text-slate-300 mb-2">
          Subject
        </label>
        <motion.input
          variants={inputVariants}
          whileFocus="focus"
          whileHover="hover"
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Project or inquiry topic"
          className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/60 text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600/50 focus:border-slate-600 focus:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm"
        />
      </motion.div>

      {/* Message Field */}
      <motion.div variants={itemVariants}>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-2">
          Message
        </label>
        <motion.textarea
          variants={inputVariants}
          whileFocus="focus"
          whileHover="hover"
          name="message"
          id="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Please share details about your inquiry..."
          className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/60 text-slate-100 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-600/50 focus:border-slate-600 focus:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm resize-none"
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        variants={itemVariants}
        className="pt-2"
      >
        <motion.button
          type="submit"
          disabled={loading || submitted}
          whileHover={{ scale: loading || submitted ? 1 : 1.02 }}
          whileTap={{ scale: loading || submitted ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 hover:border-slate-500"
        >
          {submitted ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              <span>Message Sent!</span>
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-5 h-5" />
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: status ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-center text-sm font-medium text-slate-400"
      >
        {status}
      </motion.div>
    </motion.form>
  );
}
