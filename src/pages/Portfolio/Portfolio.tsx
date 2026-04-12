import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import PortfolioCard from '../../components/PortfolioCard';
import FilterButtons from '../../components/FilterButtons';

const categories = ['All', 'Web Development', 'Cloud Infrastructure', 'AI & Automation', 'Cybersecurity'];

const placeholderProjects = [
  {
    slug: 'enterprise-dashboard',
    title: 'Enterprise Dashboard',
    category: 'Web Development',
    description: 'A comprehensive dashboard solution for enterprise clients with real-time analytics and reporting.',
    technologies: ['React', 'TypeScript', 'D3.js', 'Supabase'],
    thumbnail: undefined
  },
  {
    slug: 'cloud-migration',
    title: 'Cloud Infrastructure Migration',
    category: 'Cloud Infrastructure',
    description: 'Seamless migration of legacy systems to modern cloud infrastructure with zero downtime.',
    technologies: ['AWS', 'Kubernetes', 'Terraform', 'Docker'],
    thumbnail: undefined
  },
  {
    slug: 'ai-chatbot',
    title: 'AI-Powered Chatbot',
    category: 'AI & Automation',
    description: 'Intelligent chatbot system powered by advanced LLMs for customer support automation.',
    technologies: ['Python', 'OpenAI', 'FastAPI', 'React'],
    thumbnail: undefined
  },
  {
    slug: 'security-audit',
    title: 'Enterprise Security Audit',
    category: 'Cybersecurity',
    description: 'Comprehensive security assessment and vulnerability testing for financial institutions.',
    technologies: ['Penetration Testing', 'SIEM', 'OWASP', 'Nessus'],
    thumbnail: undefined
  },
  {
    slug: 'web3-platform',
    title: 'Web3 DeFi Platform',
    category: 'Web Development',
    description: 'Decentralized finance platform with token swap, staking, and yield farming capabilities.',
    technologies: ['Solidity', 'Web3.js', 'React', 'Node.js'],
    thumbnail: undefined
  },
  {
    slug: 'iot-dashboard',
    title: 'IoT Device Management',
    category: 'Cloud Infrastructure',
    description: 'Centralized platform for managing and monitoring thousands of IoT devices in real-time.',
    technologies: ['MQTT', 'InfluxDB', 'Grafana', 'Node.js'],
    thumbnail: undefined
  }
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const { themeColor } = useThemeHue();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = activeCategory === 'All' 
    ? placeholderProjects 
    : placeholderProjects.filter(p => p.category === activeCategory);

  return (
    <Layout themeColor={themeColor} showAuthButtons>
      <div className="relative z-10 min-h-screen">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" style={{ borderTopColor: themeColor }}></div>
              <span className="text-white/40 text-sm uppercase tracking-widest">Loading Projects</span>
            </div>
          </div>
        ) : (
          <>
          {/* Hero Section */}
        <section className="py-16 md:py-40 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-[10px] uppercase tracking-[0.8em] mb-4" style={{ color: themeColor }}>Our Work</h3>
            <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 md:mb-12">Portfolio</h2>
            <p className="text-white/60 text-sm md:text-lg max-w-2xl mb-10 md:mb-16">
              Explore our recent projects and see how we've helped businesses transform their digital presence.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <FilterButtons
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              themeColor={themeColor}
            />
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-12 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <PortfolioCard
                    key={project.slug}
                    slug={project.slug}
                    title={project.title}
                    category={project.category}
                    description={project.description}
                    thumbnail={project.thumbnail}
                    technologies={project.technologies}
                    themeColor={themeColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-12 inline-block">
                  <p className="text-white/40 text-xl uppercase tracking-widest">No Projects Yet</p>
                  <p className="text-white/30 text-sm mt-4">We're working on new projects. Check back soon!</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Load More */}
        {filteredProjects.length > 0 && (
          <section className="pb-12 px-4 md:px-10">
            <div className="max-w-4xl mx-auto text-center">
              <button className="px-8 py-4 border-2 border-white/20 uppercase text-xs font-bold tracking-[0.2em] text-white/60 transition-all hover:border-white/40 hover:text-white hover:bg-white/5">
                Load More Projects
              </button>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">Start Your Project</h3>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how we can help bring your vision to life.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-4 border-2 uppercase text-xs font-bold tracking-[0.2em] transition-all hover:shadow-lg"
              style={{ borderColor: themeColor, color: themeColor, backgroundColor: `${themeColor}10` }}
            >
              Get in Touch
            </a>
          </div>
        </section>
          </>
        )}
      </div>
    </Layout>
  );
}