import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ShieldCheck, Users, Globe, ArrowRight } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      desc: "For individual developers and small teams starting their hiring journey.",
      features: ["5 AI Interviews / mo", "Basic Coding Tests", "Public Question Bank", "Email Support"],
      button: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$49",
      desc: "Best for growing startups needing advanced evaluation and anti-cheat.",
      features: ["Unlimited Interviews", "Advanced Anti-Cheat", "Resume Intelligence", "Priority Support", "Custom Branding"],
      button: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Maximum security and integration for global engineering teams.",
      features: ["SSO & SAML", "On-premise Deployment", "Dedicated Account Manager", "Unlimited Seats", "Custom ATS Sync"],
      button: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="bg-mesh" />
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <Badge variant="violet">Pricing Plans</Badge>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white leading-tight">
            Transparent pricing for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 italic">teams of all sizes.</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Scale your engineering team with AI assessments. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full p-10 flex flex-col space-y-8 relative ${p.popular ? 'border-violet-500/50 bg-violet-500/5 shadow-premium' : ''}`}>
                {p.popular && (
                   <div className="absolute top-0 right-0 px-4 py-1 bg-violet-600 text-[10px] font-bold uppercase text-white rounded-bl-xl tracking-widest">
                      Most Popular
                   </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                  <p className="mt-3 text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 py-4 border-y border-zinc-900">
                   <span className="text-5xl font-bold text-white">{p.price}</span>
                   {p.price !== 'Custom' && <span className="text-zinc-500 text-lg">/mo</span>}
                </div>
                <ul className="flex-1 space-y-4">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.popular ? 'primary' : 'secondary'} className="w-full py-4">
                   {p.button} {p.popular && <ArrowRight className="w-4 h-4" />}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section Placeholder */}
        <div className="pt-24 space-y-12">
           <h2 className="text-3xl font-display font-bold text-white text-center">Frequently Asked Questions</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                 { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time from your billing settings.' },
                 { q: 'Is there a limit on candidates?', a: 'Our Professional and Enterprise plans offer unlimited candidate assessments.' },
                 { q: 'Do you offer a free trial?', a: 'Every new account starts with a 14-day free trial of our Professional features.' },
                 { q: 'How secure is our data?', a: 'We use bank-grade encryption and are fully SOC2 compliant to protect your hiring data.' },
              ].map((faq, i) => (
                 <Card key={i} className="space-y-3">
                    <h4 className="text-white font-bold">{faq.q}</h4>
                    <p className="text-zinc-500 text-sm">{faq.a}</p>
                 </Card>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
