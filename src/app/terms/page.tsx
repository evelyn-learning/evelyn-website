import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Evelyn Learning - Review our terms and conditions for using our website and services.",
};

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="heading-1">Terms of Service</h1>
            <p className="mt-4 text-gray-600">
              Last updated: February 26, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl prose prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">

            <h2>Agreement to Terms</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you
              and ELS Corp, doing business as Evelyn Learning (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;),
              governing your access to and use of the website at evelynlearning.com and all related services.
            </p>
            <p>
              By accessing or using our website, you acknowledge that you have read, understood, and agree
              to be bound by these Terms. If you do not agree to these Terms, you must not access or use
              our website.
            </p>

            <h2>Services</h2>
            <p>
              ELS Corp, doing business as Evelyn Learning, provides AI-powered learning solutions,
              educational content development services, and related technology services for organizations,
              publishers, and educational institutions. Our services are primarily offered on a
              business-to-business basis.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content, features, and functionality on our website, including but not limited to text,
              graphics, logos, icons, images, software, and the design and arrangement thereof, are the
              exclusive property of ELS Corp or its licensors and are protected by United States and
              international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display,
              publicly perform, republish, download, store, or transmit any materials from our website
              without our prior written consent, except as permitted by applicable law.
            </p>

            <h2>Use of Website</h2>
            <p>You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul>
              <li>Use the website in any way that violates applicable federal, state, local, or international law or regulation</li>
              <li>Attempt to gain unauthorized access to any portion of the website, other accounts, computer systems, or networks</li>
              <li>Use any automated means, including robots, spiders, or scrapers, to access the website without our express written permission</li>
              <li>Introduce any viruses, trojan horses, worms, or other malicious or harmful material</li>
              <li>Interfere with or disrupt the website or the servers and networks connected to it</li>
            </ul>

            <h2>User Content</h2>
            <p>
              Any information, content, or materials you submit through our website, including through
              contact forms, demo requests, or other interactive features, may be used by us to respond
              to your inquiry and improve our services. You represent that you have the right to submit
              such content and that it does not violate any third-party rights.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              Our website and services are provided on an &quot;as is&quot; and &quot;as available&quot; basis,
              without any warranties of any kind, either express or implied, including but not limited to
              implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              We do not warrant that the website will be uninterrupted, secure, or error-free.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, ELS Corp and its officers, directors, employees,
              agents, and affiliates shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including but not limited to loss of profits, data,
              use, or goodwill, arising out of or related to your use of or inability to use our website
              or services, regardless of the theory of liability.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless ELS Corp and its officers, directors,
              employees, agents, and affiliates from and against any and all claims, liabilities, damages,
              losses, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or
              related to your violation of these Terms or your use of our website.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites or services that are not owned or
              controlled by ELS Corp. We have no control over, and assume no responsibility for, the
              content, privacy policies, or practices of any third-party websites or services. You
              acknowledge and agree that we are not responsible or liable for any damage or loss caused
              by your use of any such third-party websites or services.
            </p>

            <h2>Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time at our sole discretion. If we make
              material changes, we will update the &quot;Last updated&quot; date at the top of this page.
              Your continued use of the website after any changes constitutes your acceptance of the
              revised Terms.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your access to our website immediately, without prior notice or
              liability, for any reason, including if you breach these Terms. All provisions of these Terms
              that by their nature should survive termination shall survive, including intellectual property
              provisions, warranty disclaimers, indemnification, and limitations of liability.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of
              California, without regard to its conflict of law provisions. Any legal action or proceeding
              relating to these Terms shall be brought exclusively in the state or federal courts located
              in California, and you consent to the personal jurisdiction of such courts.
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid, illegal, or unenforceable, the
              remaining provisions shall continue in full force and effect.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions or concerns about these Terms of Service, please contact us at:
            </p>
            <p>
              <strong>ELS Corp (dba Evelyn Learning)</strong><br />
              Email: <a href="mailto:legal@evelynlearning.com">legal@evelynlearning.com</a>
            </p>

          </div>
        </div>
      </section>
    </>
  );
}
