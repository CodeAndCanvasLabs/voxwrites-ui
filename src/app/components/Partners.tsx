import { motion } from 'motion/react';
import type { IconType } from 'react-icons';
import {
  SiOpenai, SiAnthropic, SiGoogle,
  SiGmail, SiGoogledocs, SiSlack, SiNotion, SiLinkedin,
  SiWhatsapp, SiDiscord, SiX, SiReddit, SiGithub,
  SiSalesforce, SiHubspot, SiConfluence, SiZendesk,
  SiFacebook, SiTelegram, SiGooglesheets, SiZoom,
  SiTrello, SiFigma,
} from 'react-icons/si';

const aiProviders: { name: string; Icon: IconType; color: string }[] = [
  { name: 'OpenAI', Icon: SiOpenai, color: '#10A37F' },
  { name: 'Anthropic', Icon: SiAnthropic, color: '#D4A27F' },
  { name: 'Google AI', Icon: SiGoogle, color: '#4285F4' },
];

const appsRow1: { name: string; Icon: IconType; color: string }[] = [
  { name: 'Gmail', Icon: SiGmail, color: '#EA4335' },
  { name: 'Google Docs', Icon: SiGoogledocs, color: '#4285F4' },
  { name: 'Slack', Icon: SiSlack, color: '#E01E5A' },
  { name: 'Notion', Icon: SiNotion, color: '#ffffffcc' },
  { name: 'LinkedIn', Icon: SiLinkedin, color: '#0A66C2' },
  { name: 'WhatsApp', Icon: SiWhatsapp, color: '#25D366' },
  { name: 'Discord', Icon: SiDiscord, color: '#5865F2' },
  { name: 'Zoom', Icon: SiZoom, color: '#0B5CFF' },
  { name: 'Twitter/X', Icon: SiX, color: '#ffffffcc' },
  { name: 'GitHub', Icon: SiGithub, color: '#ffffffcc' },
];

const appsRow2: { name: string; Icon: IconType; color: string }[] = [
  { name: 'Reddit', Icon: SiReddit, color: '#FF4500' },
  { name: 'Salesforce', Icon: SiSalesforce, color: '#00A1E0' },
  { name: 'HubSpot', Icon: SiHubspot, color: '#FF7A59' },
  { name: 'Confluence', Icon: SiConfluence, color: '#1868DB' },
  { name: 'Zendesk', Icon: SiZendesk, color: '#17494D' },
  { name: 'Facebook', Icon: SiFacebook, color: '#1877F2' },
  { name: 'Telegram', Icon: SiTelegram, color: '#26A5E4' },
  { name: 'Sheets', Icon: SiGooglesheets, color: '#0F9D58' },
  { name: 'Trello', Icon: SiTrello, color: '#0052CC' },
  { name: 'Figma', Icon: SiFigma, color: '#F24E1E' },
];

function MarqueeRow({ apps, direction, duration }: { apps: typeof appsRow1; direction: 'left' | 'right'; duration: number }) {
  const xFrom = direction === 'left' ? '0%' : '-50%';
  const xTo = direction === 'left' ? '-50%' : '0%';

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 dark:from-[#0f1219] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 dark:from-[#0f1219] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-4 items-center whitespace-nowrap"
        animate={{ x: [xFrom, xTo] }}
        transition={{ x: { repeat: Infinity, repeatType: 'loop', duration, ease: 'linear' } }}
      >
        {[...Array(2)].map((_, setIndex) => (
          <div key={setIndex} className="flex gap-4 items-center shrink-0">
            {apps.map((app) => (
              <div
                key={`${setIndex}-${app.name}`}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/40 bg-white dark:bg-slate-800/40 hover:border-orange-300 dark:hover:border-orange-500/40 hover:shadow-md transition-all duration-300 group"
              >
                <app.Icon className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" style={{ color: app.color, width: 18, height: 18 }} />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                  {app.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Partners() {
  return (
    <div className="py-20 bg-slate-50 dark:bg-[#0f1219]">
      <div className="container mx-auto px-4">
        {/* AI Providers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-8">
            Built on World-Class AI
          </h3>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            {aiProviders.map((provider, index) => (
              <motion.div
                key={provider.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex items-center gap-3 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30"
              >
                <provider.Icon style={{ color: provider.color, width: 22, height: 22 }} />
                <span className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  {provider.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Works With - highlighted section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-3">
              Works with{' '}
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                150+ apps
              </span>
              {' '}you already use
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Dictate directly into any website. No copy-pasting needed.
            </p>
          </div>

          <div className="flex flex-col gap-4 max-w-6xl mx-auto">
            <MarqueeRow apps={appsRow1} direction="left" duration={28} />
            <MarqueeRow apps={appsRow2} direction="right" duration={32} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
