import { motion } from 'motion/react';

const sections = [
  {
    title: 'Introduction',
    content: `This Privacy Policy explains how VoxWrites ("we", "us", or "our") collects, uses, and protects your information when you use our Chrome extension, web dashboard, and related services (collectively, "the Service").

We are committed to transparency about our data practices and to protecting your privacy. This policy applies to all users of VoxWrites, regardless of how you access or use the Service.`,
  },
  {
    title: 'Information We Collect',
    content: `We collect information in several categories to provide and improve the Service:`,
    bullets: [
      'Account Information: Email address, name, and password (or OAuth provider details) when you create an account',
      'Transcription Data: Text generated from your voice input, stored to provide history and sync features',
      'Usage Statistics: Feature usage, enhancement counts, word counts, and general interaction patterns',
      'Device Information: Browser type, extension version, operating system, and language preferences',
      'Payment Information: Billing details processed securely through Stripe — we never store your full card number',
    ],
    afterBullets: 'We only collect information that is necessary to provide the Service and improve your experience.',
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect for the following purposes:`,
    bullets: [
      'Providing the Service: Processing voice-to-text transcription and AI text enhancement',
      'Account Management: Creating and managing your account, authenticating your identity',
      'Payment Processing: Handling subscriptions, billing, and refunds through Stripe',
      'Communication: Sending transactional emails (receipts, password resets) and optional product updates',
      'Service Improvement: Analyzing usage patterns to improve features, fix bugs, and optimize performance',
      'Support: Responding to your support requests and troubleshooting issues',
    ],
  },
  {
    title: 'Audio Data',
    content: `We want to be completely transparent about how we handle audio data:`,
    bullets: [
      'We never store your audio recordings — this is a core privacy commitment',
      'Audio is processed in real-time for transcription and immediately discarded',
      'Only the resulting text transcription is retained, never the original audio',
      'When using local processing mode, audio never leaves your device',
      'Cloud-based transcription uses encrypted connections and audio is not retained after processing',
    ],
    afterBullets: 'Your voice data is treated with the highest level of privacy protection. We have designed our architecture specifically to avoid storing audio recordings.',
    highlighted: true,
  },
  {
    title: 'AI Processing & Third-Party Sharing',
    content: `When you use AI-powered text enhancement features, your text is processed by third-party AI providers:`,
    bullets: [
      'OpenAI and Anthropic are used to provide text enhancement, formatting, and tone adjustment',
      'Only the text you choose to enhance is sent to these providers — not your entire transcription history',
      'These providers process data under their API agreements and do not use API data to train their models',
      'If you use the Bring Your Own Key (BYOK) feature, your usage is subject to your own agreement with the AI provider',
      'We do not sell, rent, or share your personal data with third parties for marketing purposes',
    ],
  },
  {
    title: 'Third-Party Service Providers',
    content: `We use the following trusted third-party services to operate VoxWrites:`,
    bullets: [
      'Stripe — Payment processing and subscription management',
      'Supabase — Database hosting and authentication infrastructure',
      'Resend — Transactional and marketing email delivery',
      'OpenAI — AI text enhancement and processing',
      'Anthropic — AI text enhancement and processing',
    ],
    afterBullets: 'Each provider is bound by their own privacy policies and data processing agreements. We select providers that maintain high standards of data security and privacy.',
  },
  {
    title: 'Data Retention',
    content: `We retain your data for as long as your account is active and as needed to provide the Service:`,
    bullets: [
      'Account data is kept while your account is active',
      'Transcription history is retained until you delete it or close your account',
      'Upon account deletion, all personal data is permanently removed within 30 days',
      'Anonymized, aggregated usage statistics may be retained for analytics purposes',
      'Payment records are retained as required by tax and financial regulations',
    ],
  },
  {
    title: 'Data Security',
    content: `We implement industry-standard security measures to protect your data:`,
    bullets: [
      'All data in transit is encrypted using TLS (Transport Layer Security)',
      'Data at rest is encrypted using AES-256 encryption',
      'Access to user data is restricted to authorized personnel on a need-to-know basis',
      'API keys (including BYOK keys) are stored securely using encryption',
      'We conduct regular security reviews and follow secure development practices',
    ],
    afterBullets: 'While no method of transmission or storage is 100% secure, we strive to use commercially acceptable means to protect your personal information.',
  },
  {
    title: 'Your Rights',
    content: `You have the following rights regarding your personal data:`,
    bullets: [
      'Access: Request a copy of the personal data we hold about you',
      'Correction: Request that we correct any inaccurate or incomplete data',
      'Deletion: Request that we delete your account and associated data',
      'Export: Download your transcription data in a portable format',
      'Opt-out: Unsubscribe from marketing communications at any time',
      'Restriction: Request that we limit how we process your data in certain circumstances',
    ],
    afterBullets: 'To exercise any of these rights, contact us at privacy@VoxWrites.com or use the account settings in your web dashboard.',
  },
  {
    title: 'Cookies',
    content: `Our use of cookies and similar technologies varies by platform:`,
    bullets: [
      'Web Dashboard: We use session cookies for authentication and essential functionality',
      'Analytics: We may use privacy-respecting analytics to understand how users interact with the dashboard',
      'Chrome Extension: The extension uses browser local storage (not cookies) to store your preferences and settings',
      'No third-party tracking cookies are used for advertising purposes',
    ],
  },
  {
    title: "Children's Privacy",
    content: `VoxWrites is not intended for children under the age of 13 (or under 16 in the European Union). We do not knowingly collect personal information from children under these ages.

If we become aware that we have collected personal data from a child under the applicable age, we will take steps to delete that information as quickly as possible. If you believe a child has provided us with personal data, please contact us at privacy@VoxWrites.com.`,
  },
  {
    title: 'International Data',
    content: `VoxWrites operates globally, and your data may be processed in countries other than your own:`,
    bullets: [
      'Our primary infrastructure is hosted in the United States',
      'Third-party providers may process data in various locations worldwide',
      'We ensure appropriate safeguards are in place for international data transfers',
      'EU users: We comply with applicable data transfer mechanisms under GDPR',
    ],
  },
  {
    title: 'Changes to Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.

For material changes, we will notify you via email at the address associated with your account at least 30 days before the changes take effect. We encourage you to review this policy periodically.`,
  },
  {
    title: 'Contact',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:`,
    bullets: [
      'Email: privacy@VoxWrites.com',
      'General support: support@VoxWrites.com',
      'Website: Use the contact form on our Contact page',
    ],
  },
];

export function PrivacyPage() {
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
              Privacy{' '}
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Last updated: February 23, 2026
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 bg-white dark:bg-[#161926]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className={index < sections.length - 1 ? 'border-b border-slate-100 dark:border-slate-800 pb-8 mb-8' : ''}
              >
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  {index + 1}. {section.title}
                </h2>
                {'highlighted' in section && section.highlighted && (
                  <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-1">
                      Important
                    </p>
                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      We never store your audio recordings. Audio is processed in real-time and immediately discarded.
                    </p>
                  </div>
                )}
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
                  {section.content}
                </p>
                {section.bullets && (
                  <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400 mb-4">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="text-base leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                )}
                {'afterBullets' in section && section.afterBullets && (
                  <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    {section.afterBullets}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
