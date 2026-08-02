import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Linkedin, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  whatWeOffer: [
    { name: "AI Products", href: "/products" },
    { name: "Custom AI Development", href: "/services/custom-ai" },
    { name: "Content Services", href: "/services/content" },
  ],
  whoWeServe: [
    { name: "Test Prep & Tutoring", href: "/industries/test-prep" },
    { name: "K-12 Schools", href: "/industries/k12" },
    { name: "Higher Education", href: "/industries/higher-ed" },
    { name: "Publishers", href: "/industries/publishers" },
    { name: "Enterprise", href: "/industries/enterprise" },
  ],
  platform: [
    { name: "Integrations", href: "/integrations" },
    { name: "Security", href: "/security" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Research & White Papers", href: "/research" },
    { name: "Press", href: "/press/time-top-edtech-2026" },
    { name: "Interviews", href: "/interviews" },
    { name: "Speakers", href: "/speakers" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-7">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-xl"
            >
              <Image
                src="/images/site/logo-icon.png"
                alt="Evelyn Learning"
                width={28}
                height={28}
                className="h-7 w-auto brightness-110"
              />
              <span>
                <span className="font-normal" style={{ color: '#c77cb8' }}>Evelyn</span>
                {' '}
                <span className="font-bold text-white">Learning</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Empowering education through innovative content solutions and
              AI-powered learning experiences.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="mailto:contact@evelynlearning.com"
                className="flex items-center gap-2 text-sm hover:text-white"
              >
                <Mail className="h-4 w-4" />
                contact@evelynlearning.com
              </a>
              <a
                href="tel:+13022120975"
                className="flex items-center gap-2 text-sm hover:text-white"
              >
                <Phone className="h-4 w-4" />
                +1 (302) 212-0975
              </a>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p>San Francisco, CA</p>
                </div>
              </div>
            </div>

            {/* Recognition */}
            <div className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Recognition
              </h3>
              <Link
                href="/press/time-top-edtech-2026"
                className="mt-3 block rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-300">
                  TIME · 2026
                </span>
                <span className="mt-1 block text-sm text-gray-200">
                  Top EdTech Companies: #9 US · #35 World
                </span>
              </Link>
            </div>
          </div>

          {/* What We Offer */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              What We Offer
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.whatWeOffer.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Who We Serve */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Who We Serve
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.whoWeServe.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ELS Corp dba Evelyn Learning. All rights
            reserved.
          </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <a
              href="https://www.linkedin.com/company/evelyn-learning-systems/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/evelyn_learning"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/@EvelynSystems"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
