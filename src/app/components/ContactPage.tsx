'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Calendar, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { contactApi } from '../../lib/api';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

// TODO: Replace with your actual Calendly URL
const CALENDLY_URL = 'https://calendly.com/umarfarooq75011/30min';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load Calendly widget assets
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await contactApi.sendMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="pt-28 pb-16 bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in touch
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Schedule a meeting or send us a message. We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Side-by-Side: Calendly + Contact Form */}
      <div className="py-16 bg-white dark:bg-[#161926]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto items-start">

            {/* Left: Calendly */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule a Meeting
                </div>
                <h2 className="text-2xl font-bold mb-2">Book a call with our team</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Pick a time that works for you. We'll discuss how VoxWrites can help.
                </p>
              </div>
              <div
                className="calendly-inline-widget rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800"
                data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&hide_event_type_details=1&background_color=ffffff&text_color=1e293b&primary_color=ea580c`}
                style={{ minWidth: '300px', height: '660px' }}
              />
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 sticky top-24">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Prefer writing? Drop us a message and we'll get back to you within 24 hours.
                  </p>
                </div>

                {status === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      We'll get back to you within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setStatus('idle')}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          disabled={status === 'loading'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          disabled={status === 'loading'}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        disabled={status === 'loading'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your question or feedback..."
                        className="min-h-40 resize-none"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        disabled={status === 'loading'}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-slate-50 dark:bg-[#1a1d2e]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Quick answers to common questions
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  q: 'How does VoxWrites ensure privacy?',
                  a: 'We offer local processing options that keep your data on your device. Cloud processing is encrypted end-to-end.',
                },
                {
                  q: 'What languages do you support?',
                  a: 'We support over 100 languages with automatic detection. Check our documentation for the full list.',
                },
                {
                  q: 'Can I use VoxWrites offline?',
                  a: 'Yes! Our local processing mode works completely offline with no internet connection required.',
                },
                {
                  q: 'Do you offer team plans?',
                  a: 'Yes, we offer enterprise plans with team management, shared templates, and priority support.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
