export default function TermsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-zinc-400">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Rhine Solution website and services, you accept and agree to be 
              bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Use License</h2>
            <p className="mb-2">
              Permission is granted to temporarily use our services for personal, non-commercial use only. 
              This is the grant of a license, not a transfer of title.
            </p>
            <p>
              You may not: modify or copy the materials, use the materials for any commercial purpose, 
              transfer the materials to another person, or attempt to reverse engineer any software on the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. User Account</h2>
            <p className="mb-2">
              When you create an account, you must provide accurate and complete information. 
              You are responsible for maintaining the security of your account.
            </p>
            <p>
              You agree to take responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Prohibited Uses</h2>
            <p className="mb-2">You may not use our services to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Submit false or misleading information</li>
              <li>Distribute malware or other harmful content</li>
              <li>Engage in any activity that could harm or disrupt our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall Rhine Solution be liable for any damages arising out of the use or 
              inability to use the materials on our website, even if we have been notified of the possibility 
              of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Disclaimer</h2>
            <p>
              The materials on our website are provided "as is". We make no warranties, expressed or implied, 
              and hereby disclaim and negate all other warranties, including without limitation, implied warranties 
              or conditions of merchantability, fitness for a particular purpose, or non-infringement of 
              intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with applicable laws 
              and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{' '}
              <span className="text-indigo-500">contact@rhinesolution.com</span>
            </p>
          </section>

          <p className="text-sm text-zinc-500 pt-8">
            Last updated: April 2026
          </p>
        </div>
      </div>
    </div>
  )
}