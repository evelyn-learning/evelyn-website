import { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Evelyn Learning for educational content solutions, AI services, and curriculum development. We are here to help transform your educational goals.",
};

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: "contact@evelynlearning.com",
    href: "mailto:contact@evelynlearning.com",
  },
  {
    icon: Phone,
    title: "Phone",
    details: "+1 (302) 212-0975",
    href: "tel:+13022120975",
  },
  {
    icon: MapPin,
    title: "Offices",
    details: ["San Francisco, CA", "New Delhi, India"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon - Fri: 8:00 AM - 5:00 PM PST",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/site/hero-education.jpg"
            alt="Educational technology background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/80" />
        </div>

        <div className="container-wide relative py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="heading-1">Get in Touch</h1>
            <p className="mt-4 text-lg text-gray-600">
              Have a question or want to discuss a project? We would love to hear
              from you. Fill out the form below and our team will get back to
              you shortly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="heading-3">Contact Information</h2>
              <p className="mt-4 text-gray-600">
                Reach out to us through any of the following channels or use the
                contact form.
              </p>

              <div className="mt-8 space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 text-gray-600 hover:text-primary-500"
                        >
                          {item.details}
                        </a>
                      ) : Array.isArray(item.details) ? (
                        <div className="mt-1 text-gray-600">
                          {item.details.map((detail) => (
                            <p key={detail}>{detail}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-gray-600">{item.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h2 className="heading-3">Send us a Message</h2>
                <p className="mt-2 text-gray-600">
                  Fill out the form below and we will respond within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
