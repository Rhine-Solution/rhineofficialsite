'use client'

import Card, { CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const values = [
  { icon: '🎯', title: 'Quality', description: 'We deliver high-quality solutions that exceed expectations' },
  { icon: '🤝', title: 'Collaboration', description: 'Working together to achieve the best results' },
  { icon: '🚀', title: 'Innovation', description: 'Continuously improving and adopting new technologies' },
  { icon: '💎', title: 'Integrity', description: 'Honest and transparent in all our dealings' },
]

const timeline = [
  { year: '2024', title: 'Founded', description: 'Rhine Solution was established' },
  { year: '2024', title: 'First Project', description: 'Completed Python Chatbot and Book Manager' },
  { year: '2025', title: 'PHP Webshop', description: 'Launched e-commerce platform with Supabase' },
  { year: '2025', title: 'Frontend Launch', description: 'Deployed portfolio to Cloudflare Pages' },
  { year: '2026', title: 'Unified Platform', description: 'Launched multi-service enterprise app' },
]

const team = [
  { name: 'Founder', role: 'Full-Stack Developer', icon: '👨‍💻' },
  { name: 'Team', role: 'Growing Community', icon: '🌱' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-indigo-900/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-indigo-500">Rhine Solution</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Building modern web experiences with cutting-edge technologies. 
            We're passionate about creating solutions that make a difference.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-zinc-400 text-lg mb-6">
                At Rhine Solution, we believe in the power of technology to transform businesses and lives. 
                Our mission is to provide accessible, high-quality web solutions that help our clients succeed in the digital age.
              </p>
              <p className="text-zinc-400 text-lg">
                We specialize in building modern web applications using the latest technologies including Next.js, 
                React, Supabase, and Cloudflare. Our focus is on creating scalable, secure, and user-friendly applications.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-indigo-500 mb-2">50+</div>
                <div className="text-zinc-400">Projects Completed</div>
              </div>
              <div className="bg-zinc-900 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-cyan-500 mb-2">10+</div>
                <div className="text-zinc-400">Technologies</div>
              </div>
              <div className="bg-zinc-900 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-pink-500 mb-2">100%</div>
                <div className="text-zinc-400">Client Satisfaction</div>
              </div>
              <div className="bg-zinc-900 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">24/7</div>
                <div className="text-zinc-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={value.title} className="card-animate" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-zinc-400 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6 pb-8">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-zinc-800 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="text-indigo-500 font-semibold mb-1">{item.year}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Learn More?</h2>
          <p className="text-zinc-400 mb-8">
            Check out our portfolio or get in touch to discuss your project
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">View Portfolio</Button>
            <Button variant="outline" size="lg">Contact Us</Button>
          </div>
        </div>
      </section>
    </div>
  )
}