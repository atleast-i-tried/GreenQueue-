"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// For a real-world app, these icons would be in separate files
// or from a library like lucide-react. For this self-contained
// component, they are defined here.
const IconLeaf = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 20A7 7 0 0 1 4 13V8a2 2 0 0 1 2-2h4l2 4l2-4h4a2 2 0 0 1 2 2v5a7 7 0 0 1-7 7Z" />
    <path d="M12 10a3 3 0 0 0-3 3v7" />
  </svg>
);

const IconZap = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconCloud = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

const IconDollarSign = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const IconTarget = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
);

const IconBarChart = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);

const IconMenu = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const IconX = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default function LandingPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {
    router.push("/scheduler");
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Benefits', href: '#benefits' },
  ];

  return (
    <div className="bg-white text-gray-800 antialiased">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="#" className="flex items-center space-x-2 text-2xl font-bold text-gray-900">
                <IconLeaf className="h-7 w-7 text-green-600" />
                <span>GreenQueue</span>
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-gray-600 hover:text-green-600 transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-600 hover:text-green-600 transition-colors">Log In</button>
              <button onClick={handleGetStarted} className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
                {isMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg p-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-green-600 transition-colors">
                  {link.name}
                </a>
              ))}
              <button onClick={handleGetStarted} className="w-full px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300">
                Get Started
              </button>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-green-50/50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Run Cloud Jobs on the Cleanest, Cheapest Energy
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              GreenQueue automatically selects the most cost-effective and eco-friendly cloud region for your jobs, without compromising on deadlines.
            </p>
            <div className="mt-10">
              <button onClick={handleGetStarted} className="px-8 py-4 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                Start Optimizing for Free
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-4">
                        <p className="text-5xl font-extrabold text-green-600">80%</p>
                        <p className="mt-2 text-lg font-medium text-gray-700">Maximum Carbon Reduction</p>
                        <p className="text-sm text-gray-500">By choosing regions powered by renewables.</p>
                    </div>
                    <div className="p-4">
                        <p className="text-5xl font-extrabold text-green-600">30%</p>
                        <p className="mt-2 text-lg font-medium text-gray-700">Potential Cost Savings</p>
                        <p className="text-sm text-gray-500">Leveraging spot instances and price variations.</p>
                    </div>
                    <div className="p-4">
                        <p className="text-5xl font-extrabold text-green-600">3+</p>
                        <p className="mt-2 text-lg font-medium text-gray-700">Major Clouds Supported</p>
                        <p className="text-sm text-gray-500">Integrations with AWS, GCP, and Azure.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">The Future of Sustainable Computing</h2>
              <p className="mt-4 text-xl text-gray-600">Powerful features to automate your green cloud strategy.</p>
            </div>
            <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                  <IconTarget className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Smart Region Selection</h3>
                <p className="mt-2 text-base text-gray-600">Our algorithm balances carbon intensity, cost, and availability to find the optimal region for every job.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                  <IconCloud className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Multi-Cloud Support</h3>
                <p className="mt-2 text-base text-gray-600">Seamlessly deploy jobs across AWS, Google Cloud, and Azure to maximize flexibility and savings.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                  <IconZap className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Deadline-Aware Scheduling</h3>
                <p className="mt-2 text-base text-gray-600">Prioritize speed for urgent tasks, or maximize green savings for flexible jobs with our intelligent deadline controls.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                  <IconBarChart className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Actionable Dashboard</h3>
                <p className="mt-2 text-base text-gray-600">Visualize your environmental impact and cost savings in real-time with our intuitive analytics dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Simple, Automated, Powerful</h2>
              <p className="mt-4 text-xl text-gray-600">Get started in just a few simple steps.</p>
            </div>
            <div className="mt-16 relative">
              {/* Dashed line connecting steps for larger screens */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-300" style={{ transform: 'translateY(-50%)' }}></div>
              <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-600 text-white text-2xl font-bold border-4 border-white shadow-lg">1</div>
                  <h3 className="mt-6 text-lg font-semibold">Submit Your Job</h3>
                  <p className="mt-2 text-gray-600">Define your workload and set your priorities—Green, Cheap, or Balanced—via our simple API.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-600 text-white text-2xl font-bold border-4 border-white shadow-lg">2</div>
                  <h3 className="mt-6 text-lg font-semibold">GreenQueue Analyzes</h3>
                  <p className="mt-2 text-gray-600">We gather real-time carbon, pricing, and availability data from all major cloud regions.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-600 text-white text-2xl font-bold border-4 border-white shadow-lg">3</div>
                  <h3 className="mt-6 text-lg font-semibold">Select & Execute</h3>
                  <p className="mt-2 text-gray-600">Our scheduler picks the optimal region and automatically deploys your containerized job.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-600 text-white text-2xl font-bold border-4 border-white shadow-lg">4</div>
                  <h3 className="mt-6 text-lg font-semibold">Monitor & Save</h3>
                  <p className="mt-2 text-gray-600">Track your carbon and cost savings on the dashboard as the job completes successfully.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold sm:text-4xl">Reduce Your Footprint, Not Your Performance</h2>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white text-green-600">
                    <IconLeaf className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Achieve Sustainability Goals</h3>
                    <p className="mt-1 opacity-90">Significantly lower your organization's carbon footprint by making every cloud job an opportunity for emission reduction.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white text-green-600">
                    <IconDollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Lower Your Cloud Bill</h3>
                    <p className="mt-1 opacity-90">Capitalize on regional price differences and low-cost spot instances without manual effort, directly impacting your bottom line.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                   <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white text-green-600">
                    <IconZap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Automate Complex Decisions</h3>
                    <p className="mt-1 opacity-90">Focus on your core work while GreenQueue's middleware handles the complex, data-driven task of continuous cloud optimization.</p>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-green-700/50 rounded-lg">
                <blockquote className="text-xl italic">
                  "Data centers consume nearly 2% of global electricity. By intelligently routing workloads, we can make a tangible difference. GreenQueue is proof that you can be both fiscally responsible and environmentally conscious in the cloud."
                </blockquote>
                 <p className="mt-4 font-semibold">- The GreenQueue Team</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Ready to Build a Greener, More Efficient Cloud?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join the waitlist or explore our simulator to see how much you can save.
            </p>
            <div className="mt-8">
              <button onClick={handleGetStarted} className="px-8 py-4 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                Start Your Free Trial
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-2">
                    <li><a href="#features" className="text-base text-gray-400 hover:text-white">Features</a></li>
                    <li><a href="#how-it-works" className="text-base text-gray-400 hover:text-white">How It Works</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Pricing</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-2">
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">About</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Blog</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Careers</a></li>
                </ul>
            </div>
             <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-2">
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Documentation</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">API Status</a></li>
                </ul>
            </div>
             <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-2">
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Privacy</a></li>
                    <li><a href="#" className="text-base text-gray-400 hover:text-white">Terms</a></li>
                </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} GreenQueue Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}