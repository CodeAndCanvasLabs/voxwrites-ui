import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../lib/auth';
import { billingApi } from '../../lib/api';

interface PricingProps {
  onNavigate: (page: string) => void;
  onOpenWaitlist?: () => void;
  standalone?: boolean;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out VoxWrites',
    features: [
      '1,000 words per day',
      '50 AI enhancements per day',
      'Real-time voice transcription',
      'Basic AI text enhancement',
      '30+ languages supported',
      'Browser extension for any website',
      'Auto app detection (Gmail, Slack, etc.)',
      'Voice commands (punctuation, new line)',
      'Transcription history',
    ],
    cta: 'Join Waitlist',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For professionals who write daily',
    features: [
      'Unlimited words',
      '100 AI enhancements per day',
      'Premium AI enhancement (GPT-4)',
      '100+ languages with Whisper',
      'Priority email support',
      'Custom tone templates',
      'Smart context detection',
      'Email thread context awareness',
      'Usage analytics & insights',
      'Weekly usage reports via email',
      'Export transcriptions (CSV/PDF)',
      'Ad-free experience',
    ],
    cta: 'Join Waitlist',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'SSO & SAML authentication',
      'Admin dashboard',
      'Team usage analytics',
      'Custom integrations & API',
      'On-premise deployment option',
      'SLA guarantee (99.9% uptime)',
      'Training & onboarding',
      'Volume discounts',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function Pricing({ onNavigate, onOpenWaitlist, standalone = false }: PricingProps) {
  const { isAuthenticated, token } = useAuth();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleProClick = async () => {
    if (!isAuthenticated || !token) {
      onOpenWaitlist?.();
      return;
    }
    setCheckoutLoading(true);
    try {
      const { checkout_url } = await billingApi.createCheckoutSession('monthly', token);
      window.location.href = checkout_url;
    } catch {
      onNavigate('signup');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className={`py-20 bg-white dark:bg-[#161926] ${standalone ? 'pt-28' : ''}`} id="pricing">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Choose the plan that's right for you. No hidden fees.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => {
            const isActive = hoveredIndex === index || (hoveredIndex === null && plan.popular);
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`h-full ${plan.popular ? 'md:-mt-4' : ''}`}
              >
                <motion.div
                  className="h-full"
                  animate={{
                    scale: isHovered ? 1.03 : 1,
                    y: isHovered ? -8 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card
                    className={`p-8 h-full relative transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? 'border-2 border-orange-500 shadow-2xl shadow-orange-500/20'
                        : isHovered
                          ? 'border-2 border-orange-400 shadow-xl shadow-orange-400/10'
                          : 'border border-slate-200 dark:border-slate-800 hover:border-orange-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-1">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-slate-500">/{plan.period}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        {plan.description}
                      </p>
                    </div>

                    <Button
                      className={`w-full mb-6 ${
                        plan.popular || isHovered
                          ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white'
                          : ''
                      }`}
                      variant={plan.popular || isHovered ? 'default' : 'outline'}
                      disabled={plan.name === 'Pro' && checkoutLoading}
                      onClick={() => {
                        if (plan.name === 'Enterprise') onNavigate('contact');
                        else if (plan.name === 'Pro') handleProClick();
                        else onOpenWaitlist?.();
                      }}
                    >
                      {plan.name === 'Pro' && checkoutLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                      ) : plan.cta}
                    </Button>

                    <div className="space-y-3">
                      {plan.features.map((feature, fi) => (
                        <motion.div
                          key={feature}
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0.6,
                            x: isActive ? 0 : -4,
                          }}
                          transition={{ delay: isActive ? fi * 0.03 : 0, duration: 0.2 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                            isActive ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-slate-100 dark:bg-slate-800'
                          }`}>
                            <Check className={`w-3 h-3 transition-colors duration-300 ${
                              isActive ? 'text-orange-600' : 'text-slate-400'
                            }`} />
                          </div>
                          <span className={`text-sm transition-colors duration-300 ${
                            isActive ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'
                          }`}>
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-600 dark:text-slate-400">
            Join our waitlist to be the first to know when we launch.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
