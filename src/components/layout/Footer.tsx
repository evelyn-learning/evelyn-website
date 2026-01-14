import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  services: [
    { name: "For Organizations", href: "/services/organizations" },
    { name: "AI Services", href: "/services/ai" },
    { name: "Publishing", href: "/services/publishing" },
    { name: "K-12 Solutions", href: "/services/k12" },
    { name: "Test Preparation", href: "/services/test-prep" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Webinars", href: "/webinars" },
    { name: "Interviews", href: "/interviews" },
    { name: "Speakers Hall of Fame", href: "/speakers" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-heading text-xl font-bold text-white"
            >
              Evelyn Learning
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
                href="tel:+1234567890"
                className="flex items-center gap-2 text-sm hover:text-white"
              >
                <Phone className="h-4 w-4" />
                +1 (234) 567-890
              </a>
              <p className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>New Delhi, India | Bay Area, California</span>
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.services.map((link) => (
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
            &copy; {new Date().getFullYear()} Evelyn Learning. All rights
            reserved.
          </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <a
              href="https://linkedin.com/company/evelyn-learning"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/evelynlearning"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com/@evelynlearning"
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
