import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p>
                EstateHub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by EstateHub. This policy applies to our website, and its associated subdomains.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
              <p>
                We collect information from you when you visit our website, register on our site, place an inquiry, or fill out a form. The information we may collect includes:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number.</li>
                <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and time spent on pages.</li>
                <li><strong>Cookies:</strong> Information collected through cookies and similar tracking technologies.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide, operate, and maintain our website.</li>
                <li>Improve, personalize, and expand our website.</li>
                <li>Communicate with you, either directly or through one of our partners, for customer service, to provide you with updates and other information relating to the website, and for marketing purposes.</li>
                <li>Process your transactions and inquiries.</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Data Security</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@estatehub.com" className="text-blue-600 hover:underline">privacy@estatehub.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}