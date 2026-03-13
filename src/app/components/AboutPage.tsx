import { Card } from './ui/card';
import { motion } from 'motion/react';
import { Target, Users, Zap, Heart } from 'lucide-react';

// Team data hidden — team section is commented out below
// const team = [
//   { name: 'Umar Farooq', role: 'Founder & CEO', avatar: 'UF', image: '/founder.jpeg', color: 'bg-orange-500' },
//   { name: 'Fahad', role: 'Co-Founder & CTO', avatar: 'FA', image: '/cofounder.jpeg', color: 'bg-blue-500' },
// ];
const values = [
  {
    icon: Target,
    title: 'Mission Driven',
    description: 'We believe everyone deserves to write efficiently and effectively.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'User First',
    description: 'Every feature we build starts with understanding our users\' needs.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We push the boundaries of what\'s possible with voice and AI technology.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Heart,
    title: 'Privacy Focused',
    description: 'Your data is yours. We provide local processing options for complete privacy.',
    color: 'from-green-500 to-emerald-500',
  },
];

export function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="pt-28 pb-20 bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Empowering everyone to
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {' '}write faster
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              We're on a mission to make voice-to-text transcription seamless, accurate, 
              and accessible to everyone, everywhere.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 bg-white dark:bg-[#161926]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                  VoxWrites was born out of a simple frustration: typing was slowing us down. 
                  As remote work became the norm, we found ourselves spending hours typing emails, 
                  messages, and documents that could be spoken in minutes.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                  Existing voice-to-text tools either required constant internet connectivity, 
                  lacked context awareness, or produced transcriptions that needed extensive editing. 
                  We knew there had to be a better way.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  So we built VoxWrites – a voice-to-text tool that understands context, adapts to 
                  different platforms, and uses AI to produce polished, ready-to-send text. 
                  Today, we're proud to help thousands of professionals save hours every week.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-slate-50 dark:bg-[#1a1d2e]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}>
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="py-20 bg-white dark:bg-[#161926]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              The people building the future of voice-to-text
            </p>
          </motion.div>

          <div className="flex justify-center gap-16 max-w-3xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover mx-auto mb-4 ring-4 ring-orange-200 dark:ring-orange-800"
                  />
                ) : (
                  <div className={`w-28 h-28 rounded-full ${member.color} flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 ring-4 ring-blue-200 dark:ring-blue-800`}>
                    {member.avatar}
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            {[
              { value: '10,000+', label: 'Active Users' },
              { value: '5M+', label: 'Words Transcribed' },
              { value: '100+', label: 'Languages' },
              { value: '98.5%', label: 'Accuracy Rate' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-orange-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
