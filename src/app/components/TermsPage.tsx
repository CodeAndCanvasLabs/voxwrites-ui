import { motion } from 'motion/react';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing or using VoxWrites ("the Service"), including our Chrome extension, web dashboard, and related services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.

These terms constitute a legally binding agreement between you and VoxWrites. Your continued use of the Service following any updates to these terms constitutes acceptance of those changes.`,
  },
  {
    title: 'Eligibility',
    content: `You must be at least 13 years of age to use VoxWrites, in compliance with the Children's Online Privacy Protection Act (COPPA). If you are located in the European Union, you must be at least 16 years of age to use the Service.

By using VoxWrites, you represent and warrant that you meet the applicable age requirements and have the legal capacity to enter into these terms.`,
  },
  {
    title: 'Account Registration',
    content: `To access certain features of the Service, you must create an account. You agree to:`,
    bullets: [
      'Provide accurate, current, and complete registration information',
      'Maintain the security and confidentiality of your login credentials',
      'Promptly update your account information if it changes',
      'Accept responsibility for all activity that occurs under your account',
      'Notify us immediately of any unauthorized use of your account',
    ],
  },
  {
    title: 'Description of Service',
    content: `VoxWrites provides a voice-to-text transcription and AI-powered text enhancement platform. The Service includes:`,
    bullets: [
      'A Chrome browser extension for real-time voice-to-text transcription',
      'AI-powered text enhancement, formatting, and tone adjustment',
      'A web dashboard for managing transcriptions, settings, and account details',
      'Integration with various web applications for seamless text input',
      'Local and cloud-based processing options',
    ],
  },
  {
    title: 'Subscription Plans & Payments',
    content: `VoxWrites offers multiple subscription tiers including Free, Pro, Team, and Enterprise plans. Paid subscriptions are billed through Stripe, our third-party payment processor.`,
    bullets: [
      'Paid plans are billed on a recurring basis (monthly or annually) and auto-renew unless cancelled',
      'You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period',
      'Refunds are handled on a case-by-case basis within 7 days of purchase',
      'Prices are subject to change with 30 days\' advance notice',
      'Upgrading mid-cycle will be prorated; downgrading takes effect at the next billing cycle',
    ],
  },
  {
    title: 'Free Tier & Usage Limits',
    content: `The free tier provides limited access to VoxWrites features, including daily word and enhancement limits. These limits are subject to change at our discretion.

We reserve the right to modify free tier limits, features, or availability at any time. We will make reasonable efforts to notify users of significant changes to the free tier.`,
  },
  {
    title: 'User Content & Ownership',
    content: `You retain full ownership of all text, transcriptions, and other content you create using VoxWrites ("User Content"). By using the Service, you grant VoxWrites a limited, non-exclusive, worldwide license to process your User Content solely for the purpose of providing and improving the Service.

This license terminates when you delete your content or your account. We do not claim any ownership rights over your User Content.`,
  },
  {
    title: 'AI Processing & Third-Party APIs',
    content: `VoxWrites uses third-party AI services, including OpenAI and Anthropic, to provide text enhancement features. When you use AI enhancement:`,
    bullets: [
      'Your text may be sent to these third-party providers for processing',
      'Audio recordings are never stored — audio is processed in real-time and only the resulting text is retained',
      'Third-party AI providers process data under their respective API agreements and do not use API data for model training',
      'If you use the Bring Your Own Key (BYOK) feature, your usage is governed by your own agreement with the respective AI provider',
      'Local processing options are available for users who prefer to keep all data on-device',
    ],
  },
  {
    title: 'Recording Consent',
    content: `You are solely responsible for complying with all applicable laws regarding the recording of audio and conversations in your jurisdiction. Many jurisdictions require consent from all parties being recorded.

VoxWrites does not provide legal advice regarding recording consent. It is your responsibility to obtain any necessary consent before using the Service to transcribe conversations or audio.`,
  },
  {
    title: 'Acceptable Use',
    content: `You agree not to use VoxWrites for any unlawful or prohibited purpose. Specifically, you agree not to:`,
    bullets: [
      'Record or transcribe conversations without required consent from all parties',
      'Use the Service for any illegal, fraudulent, or harmful activity',
      'Reverse engineer, decompile, or disassemble any part of the Service',
      'Attempt to gain unauthorized access to the Service or its related systems',
      'Interfere with or disrupt the Service or servers connected to the Service',
      'Use the Service to generate spam, phishing content, or malicious material',
    ],
  },
  {
    title: 'Intellectual Property',
    content: `The VoxWrites name, logo, branding, software, and all related intellectual property are owned by VoxWrites and its licensors. Nothing in these terms grants you any right to use VoxWrites trademarks, logos, or branding without our prior written consent.

The Service is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on the Service.`,
  },
  {
    title: 'Termination',
    content: `You may delete your account at any time through the web dashboard or by contacting support. Upon account deletion, your data will be removed in accordance with our Privacy Policy.

VoxWrites reserves the right to suspend or terminate your account at any time for violations of these terms, with or without notice. In the event of termination for cause, you will not be entitled to a refund for any prepaid fees.`,
  },
  {
    title: 'Disclaimers',
    content: `The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. VoxWrites does not warrant that:`,
    bullets: [
      'The Service will be uninterrupted, secure, or error-free',
      'AI-generated or enhanced text will be accurate, complete, or suitable for any particular purpose',
      'Transcription results will be 100% accurate in all circumstances',
      'The Service will meet your specific requirements',
    ],
    afterBullets: 'You acknowledge that AI-generated output should be reviewed before use in any critical or professional context.',
  },
  {
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by law, VoxWrites's total liability to you for any claims arising from or related to the Service shall not exceed the total amount you paid to VoxWrites in the 12 months preceding the claim.

VoxWrites shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.`,
  },
  {
    title: 'Changes to Terms',
    content: `We may update these Terms of Service from time to time. For material changes, we will provide at least 30 days' notice via email or a prominent notice within the Service.

Your continued use of VoxWrites after the effective date of any changes constitutes your acceptance of the updated terms. If you do not agree with the changes, you should discontinue use of the Service.`,
  },
  {
    title: 'Contact',
    content: `If you have any questions about these Terms of Service, please contact us at:`,
    bullets: [
      'Email: support@VoxWrites.com',
      'Website: Use the contact form on our Contact page',
    ],
  },
];

export function TermsPage() {
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
              Terms of{' '}
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Service
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
