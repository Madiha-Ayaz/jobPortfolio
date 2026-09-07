/**
 * EnhancedContactForm
 * -------------------
 * Modern glassmorphic form with micro-animations,
 * smooth transitions, and professional styling
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, EnvelopeIcon, PhoneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useNotification } from '@/context/NotificationContext';
import ContactFormMascot from '@/components/contact/ContactFormMascot';
import { apiUrl } from '@/utils/api';
import { useTheme } from '@/context/ThemeContext';

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
  const { notify } = useNotification();
  const { t } = useTheme();
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
    setStatus(t('contact.formSending'));

    try {
      const res = await fetch(apiUrl('contact/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || t('contact.formErrorMsg'));
      }

      setSubmitted(true);
      setStatus('');
      setFormData({ name: '', email: '', subject: '', message: '' });
      notify('success', t('contact.formSuccessTitle'), t('contact.formSuccessMsg'));

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setStatus(`Error: ${error.message || t('contact.formErrorMsg')}`);
      notify('error', t('contact.formErrorTitle'), error?.message || t('contact.formErrorMsg'));
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
      {/* Draggable mascot — eyes follow your caret, reacts to errors & success */}
      <motion.div variants={itemVariants}>
        <ContactFormMascot success={submitted} />
      </motion.div>

      {/* Name Field */}
      <motion.div variants={itemVariants}>
        <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
          {t('contact.formName')}
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
          placeholder={t('contact.formNamePlaceholder')}
          className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm input"
        />
      </motion.div>

      {/* Email Field */}
      <motion.div variants={itemVariants}>
        <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
          {t('contact.formEmail')}
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
          className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm input"
        />
      </motion.div>

      {/* Subject Field */}
      <motion.div variants={itemVariants}>
        <label htmlFor="subject" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
          {t('contact.formSubject')}
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
          placeholder={t('contact.formSubjectPlaceholder')}
          className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm input"
        />
      </motion.div>

      {/* Message Field */}
      <motion.div variants={itemVariants}>
        <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
          {t('contact.formMessage')}
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
          placeholder={t('contact.formMessagePlaceholder')}
          className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm input resize-none"
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
          className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
        >
          {submitted ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              <span>{t('contact.formSent')}</span>
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-5 h-5" />
              <span>{loading ? t('contact.formSending') : t('contact.formSend')}</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: status ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}
      >
        {status}
      </motion.div>
    </motion.form>
  );
}
