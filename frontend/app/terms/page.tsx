import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p>
                Welcome to EstateHub. These Terms of Service govern your use of
                our website located at [Your Website URL] and any related
                services provided by EstateHub. By accessing our website, you
                agree to abide by these Terms of Service and to comply with all
                applicable laws and regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Use of Our Services</h2>
              <p>
                You agree to use our services for lawful purposes only. You are
                prohibited from using our site:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  In any way that violates any applicable national or
                  international law or regulation.
                </li>
                <li>
                  To transmit, or procure the sending of, any advertising or
                  promotional material, including any "junk mail", "chain
                  letter," "spam," or any other similar solicitation.
                </li>
                <li>
                  To impersonate or attempt to impersonate EstateHub, an
                  employee, another user, or any other person or entity.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                3. Intellectual Property
              </h2>
              <p>
                The content on our website, including text, graphics, logos,
                images, as well as the compilation thereof, and any software
                used on the site, is the property of EstateHub or its suppliers
                and protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                4. Limitation of Liability
              </h2>
              <p>
                In no event shall EstateHub, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                5. Changes to These Terms
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. We will notify you of any
                changes by posting the new Terms of Service on this page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:{" "}
                <a
                  href="mailto:contact@estatehub.com"
                  className="text-blue-600 hover:underline"
                >
                  contact@estatehub.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
