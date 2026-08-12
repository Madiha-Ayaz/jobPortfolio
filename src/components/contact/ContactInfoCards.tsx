import { useState } from 'react';

interface ContactCard {
  id: string;
  title: string;
  content: string;
  subtext?: string;
  color: string;
  icon: string;
}

const contactCards: ContactCard[] = [
  {
    id: 'email',
    icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    title: 'Email',
    content: 'madihaayaz248@gmail.com',
    subtext: 'Best way to reach me',
    color: '#a78bfa',
  },
  {
    id: 'phone',
    icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
    title: 'Phone',
    content: '+92 334 3717260',
    subtext: 'Available for calls',
    color: '#ec4899',
  },
  {
    id: 'location',
    icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    title: 'Location',
    content: 'Pakistan',
    subtext: 'Open to remote work',
    color: '#06b6d4',
  },
];

function Card({ card, index }: { card: ContactCard; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-xl p-6 transition-all duration-300 cursor-default"
      style={{
        background: hovered ? `${card.color}10` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? card.color + '35' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered ? `0 8px 30px ${card.color}12` : 'none',
        opacity: 0,
        animation: `fadeInCard 0.5s ease-out ${index * 0.15}s forwards`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
        style={{ background: `${card.color}12`, border: `1px solid ${card.color}30` }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={card.color} strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
        </svg>
      </div>

      <h3 className="text-base font-bold text-heading mb-1">{card.title}</h3>
      <p className="text-sm font-semibold mb-1" style={{ color: card.color }}>{card.content}</p>
      {card.subtext && <p className="text-xs text-dim">{card.subtext}</p>}

      <div
        className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300"
        style={{
          width: hovered ? '100%' : '0%',
          background: `linear-gradient(90deg, ${card.color}, ${card.color}88)`,
          boxShadow: `0 0 8px ${card.color}40`,
        }}
      />
    </div>
  );
}

export default function ContactInfoCards() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black mb-6 text-heading">
        Contact Methods
      </h2>

      {contactCards.map((card, index) => (
        <Card key={card.id} card={card} index={index} />
      ))}

      <div
        className="p-4 rounded-xl mt-6"
        style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.12)' }}
      >
        <p className="text-xs text-muted">
          <span className="font-bold text-brand">Response Time:</span> I typically respond within{' '}
          <span className="font-bold text-brand">24-48 hours</span>.
        </p>
      </div>

      <style>{`
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
