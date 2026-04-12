import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import useThemeHue from '../../hooks/useThemeHue';
import TeamCard from '../../components/TeamCard';
import ValueCard from '../../components/ValueCard';
import { Shield, Zap, Users, Lightbulb, MessageCircle, Link2 } from 'lucide-react';
import { githubIcon, twitterIcon } from '../../components/GFX';

const teamMembers = [
  {
    name: 'Ragnarok',
    role: 'CEO',
    bio: 'Leading Rhine Solution with vision and strategic direction. Driving innovation in technology solutions.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  },
  {
    name: 'ZeroMeister',
    role: 'CTO',
    bio: 'Overseeing technical strategy and architecture. Expert in WebGPU, WebGL, and cutting-edge web technologies.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  }
];

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'We prioritize security in every solution, following best practices and maintaining robust protection.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Constantly pushing boundaries with cutting-edge technologies like WebGPU, AI, and cloud-native solutions.'
  },
  {
    icon: Users,
    title: 'Client Focus',
    description: 'Your success is our success. We work closely with you to deliver solutions that meet your unique needs.'
  },
  {
    icon: Lightbulb,
    title: 'Excellence',
    description: 'Committed to delivering highest quality code, architecture, and services in everything we do.'
  }
];

export default function About() {
  const navigate = useNavigate();
  const { themeColor } = useThemeHue();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout themeColor={themeColor} showAuthButtons>
      <div className="relative z-10 min-h-screen">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" style={{ borderTopColor: themeColor }}></div>
              <span className="text-white/40 text-sm uppercase tracking-widest">Loading</span>
            </div>
          </div>
        ) : (
          <>
        {/* Hero Section */}
        <section id="company" className="py-16 md:py-40 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-[10px] uppercase tracking-[0.8em] mb-4" style={{ color: themeColor }}>About Us</h3>
            <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 md:mb-12">Who We Are</h2>
            <p className="text-white/60 text-sm md:text-lg max-w-2xl mb-10 md:mb-16">
              We build innovative digital solutions that transform businesses and push the boundaries of what's possible on the web.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section id="story" className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[2px]" style={{ backgroundColor: themeColor }}></div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Our Story</h3>
                </div>
                <div className="space-y-4 text-white/60">
                  <p>
                    Rhine Solution was founded with a mission to deliver cutting-edge technology solutions that help businesses thrive in the digital age.
                  </p>
                  <p>
                    We specialize in advanced web technologies including WebGPU 3D rendering, blockchain solutions, AI integration, and enterprise software development.
                  </p>
                  <p>
                    Our team combines technical expertise with creative problem-solving to deliver solutions that not only meet but exceed our clients' expectations.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-black/80 backdrop-blur-xl border-l border-white/20 rounded-r-2xl p-8 md:p-12">
                  <div className="text-center">
                    <span className="text-5xl font-black text-white/20 uppercase tracking-tighter" style={{ color: themeColor }}>2024</span>
                    <p className="text-white/40 text-sm uppercase tracking-widest mt-2">Founded</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Meet The Team</h3>
            </div>
            <p className="text-white/60 text-sm md:text-lg mb-10 md:mb-16 max-w-2xl">
              The passionate people behind Rhine Solution, dedicated to delivering excellence in every project.
            </p>
            
            <div className="space-y-6">
              {teamMembers.map((member, index) => (
                <TeamCard
                  key={index}
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                  linkedin={member.linkedin}
                  twitter={member.twitter}
                  themeColor={themeColor}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section id="values" className="py-12 md:py-20 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px]" style={{ backgroundColor: themeColor }}></div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Our Values</h3>
            </div>
            <p className="text-white/60 text-sm md:text-lg mb-10 md:mb-16 max-w-2xl">
              The principles that guide everything we do at Rhine Solution.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <ValueCard
                  key={index}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  themeColor={themeColor}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA / Contact Section */}
        <section id="contact" className="py-12 md:py-20 px-4 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">Let's Build Something Amazing</h3>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Ready to transform your digital presence? Let's discuss your project and find the perfect solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigate('/contact')}
                className="px-8 py-4 border-2 uppercase text-xs font-bold tracking-[0.2em] transition-all hover:shadow-lg"
                style={{ borderColor: themeColor, color: themeColor, backgroundColor: `${themeColor}10` }}
              >
                Get in Touch
              </button>
              <button 
                onClick={() => navigate('/portfolio')}
                className="px-8 py-4 border-2 border-white/20 uppercase text-xs font-bold tracking-[0.2em] text-white transition-all hover:bg-white/10 hover:border-white/40"
              >
                View Our Work
              </button>
            </div>
          </div>
        </section>

        {/* Social Section */}
        <section className="py-12 px-4 md:px-10 bg-black/40">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">Follow Us</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/Rhine-Solution"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full hover:border-white/30 transition-all duration-300"
              >
                <span className="w-5 h-5 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">{githubIcon()}</span>
                <span className="text-white/80 text-sm font-medium">GitHub</span>
              </a>
              <a
                href="https://x.com/RhineSolution"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full hover:border-white/30 transition-all duration-300"
              >
                <span className="w-5 h-5 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">{twitterIcon()}</span>
                <span className="text-white/80 text-sm font-medium">X</span>
              </a>
              <a
                href="https://discord.gg/WEwGppRN8K"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full hover:border-white/30 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                <span className="text-white/80 text-sm font-medium">Discord</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full hover:border-white/30 transition-all duration-300"
              >
                <Link2 className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                <span className="text-white/80 text-sm font-medium">LinkedIn</span>
              </a>
            </div>
          </div>
        </section>
          </>
        )}
      </div>
    </Layout>
  );
}