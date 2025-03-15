import React from 'react';
import { Check } from 'lucide-react';

function PricingTier({ 
  name, 
  price, 
  description, 
  features, 
  highlighted = false 
}: { 
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-8 ${
      highlighted 
        ? 'bg-blue-600 text-white shadow-xl scale-105' 
        : 'bg-white text-gray-900'
    }`}>
      <h3 className="text-2xl font-bold">{name}</h3>
      <p className={`mt-4 text-sm ${highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
        {description}
      </p>
      <div className="mt-6">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Free' && <span className={`${highlighted ? 'text-blue-100' : 'text-gray-500'}`}>/month</span>}
      </div>
      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check className={`h-5 w-5 ${
              highlighted ? 'text-blue-200' : 'text-blue-600'
            }`} />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`mt-8 w-full rounded-lg py-3 px-6 text-center font-semibold transition-all ${
        highlighted
          ? 'bg-white text-blue-600 hover:bg-blue-50'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}>
        Get Started
      </button>
    </div>
  );
}

function App() {
  const pricingTiers = [
    {
      name: "Free",
      price: "Free",
      description: "Perfect for side projects and simple applications",
      features: [
        "Up to 1,000 API calls/month",
        "Basic analytics",
        "Community support",
        "1 team member",
        "Basic documentation"
      ]
    },
    {
      name: "Basic",
      price: "$29",
      description: "Great for growing businesses and teams",
      features: [
        "Up to 50,000 API calls/month",
        "Advanced analytics",
        "Priority email support",
        "5 team members",
        "Advanced documentation",
        "Custom integrations"
      ],
      highlighted: true
    },
    {
      name: "Pro",
      price: "$99",
      description: "For enterprises and large-scale applications",
      features: [
        "Unlimited API calls",
        "Real-time analytics",
        "24/7 phone support",
        "Unlimited team members",
        "Custom solutions",
        "Dedicated account manager",
        "SLA guarantee"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Choose the right plan for you
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Simple, transparent pricing that grows with your business. No hidden fees or surprise charges.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;