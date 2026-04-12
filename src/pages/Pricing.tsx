import { useState } from 'react';
import Layout from '../components/Layout';
import { Check, X, Star, Zap, Shield, Users } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'For individuals and small projects',
    price: 0,
    period: 'Free forever',
    icon: <Zap className="w-6 h-6" />,
    features: [
      { name: '3 Projects', included: true },
      { name: '1 GB Storage', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Email Support', included: true },
      { name: 'Team Collaboration', included: false },
      { name: 'Custom Domain', included: false },
      { name: 'API Access', included: false },
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing teams and businesses',
    price: 29,
    period: 'per month',
    icon: <Star className="w-6 h-6" />,
    features: [
      { name: 'Unlimited Projects', included: true },
      { name: '50 GB Storage', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Team Collaboration', included: true },
      { name: 'Custom Domain', included: true },
      { name: 'API Access', included: true },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 99,
    period: 'per month',
    icon: <Shield className="w-6 h-6" />,
    features: [
      { name: 'Unlimited Everything', included: true },
      { name: 'Unlimited Storage', included: true },
      { name: 'Enterprise Analytics', included: true },
      { name: '24/7 Dedicated Support', included: true },
      { name: 'Unlimited Team Members', included: true },
      { name: 'Custom Domain', included: true },
      { name: 'Full API Access', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <Layout>
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border transition-all ${
                  plan.popular
                    ? 'bg-white/5 border-brand-primary shadow-lg shadow-brand-primary/20'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-primary text-white text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    plan.popular ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-white/60'
                  }`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    <p className="text-sm text-white/50">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      ${billingCycle === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price}
                    </span>
                    {plan.price > 0 && <span className="text-white/50">/mo</span>}
                  </div>
                  <p className="text-sm text-white/40 mt-1">{plan.period}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-white/30 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-white/80' : 'text-white/40'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-brand-primary hover:bg-brand-primary/80 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="flex items-center justify-center gap-2 text-white/60 mb-4">
              <Users className="w-5 h-5" />
              <span>Need a custom plan for your team?</span>
            </div>
            <button className="text-brand-primary hover:underline">
              Contact us for enterprise pricing →
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}