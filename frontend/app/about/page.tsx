import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Target, Eye, Handshake, ShieldCheck, Star } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Rohan Verma",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      bio: "With over 15 years of experience, Rohan leads with a passion for innovation and customer satisfaction.",
    },
    {
      name: "Priya Sharma",
      role: "Head of Sales",
      image: "https://randomuser.me/api/portraits/women/75.jpg",
      bio: "Priya is an expert in market trends and excels at finding the perfect property for every client.",
    },
    {
      name: "Amit Patel",
      role: "Lead Architect",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      bio: "Amit’s design philosophy combines modern aesthetics with sustainable and practical living solutions.",
    },
    {
      name: "Sunita Reddy",
      role: "Marketing Director",
      image: "https://randomuser.me/api/portraits/women/76.jpg",
      bio: "Sunita crafts compelling stories that connect our properties with their future owners.",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-cover bg-center text-white flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              alt="Our team working"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="relative z-10 text-center container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Shaping the Future of Real Estate
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-slate-200">
              We are a team of passionate professionals dedicated to simplifying
              your property journey with trust and transparency.
            </p>
          </div>
        </section>

        {/* Mission and Vision Section */}
        <section className="py-20 md:py-28 bg-zinc-50 dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Our Commitment to You
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                "Our mission is to empower clients with exceptional service,
                data-driven insights, and unwavering support. We don't just sell
                properties; we build lifelong relationships and help you find a
                place you can truly call home. Every transaction is guided by
                our core principles of integrity and excellence."
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
                  alt="Office brainstorming session"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6 tracking-tight">
                  Our Story
                </h2>
                <p className="text-muted-foreground leading-relaxed space-y-4">
                  <span>
                    Founded in 2015, EstateHub started with a simple idea: to
                    make real estate transactions more transparent, efficient,
                    and client-focused. We saw a gap in the market for a
                    brokerage that prioritized people over profits.
                  </span>
                  <span>
                    From a small office with just two agents, we have grown into
                    a leading real estate firm in the region, helping hundreds
                    of families find their dream homes. Our success is built on
                    a foundation of hard work, market expertise, and a deep
                    commitment to the communities we serve.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="py-20 md:py-28 bg-zinc-50 dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">
                Meet Our Leadership
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The driving force behind our success and your satisfaction.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <Card
                  key={member.name}
                  className="text-center transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl"
                >
                  <CardContent className="p-8">
                    <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-lg">
                      <AvatarImage src={member.image} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {member.role}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-slate-900 text-white dark:bg-slate-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Let's Build Your Future Together
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
              Ready to take the next step in your property journey? Our team is
              here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-slate-900 hover:bg-slate-200 h-14 px-8 text-base font-semibold rounded-full shadow-lg"
              >
                <Link href="/properties">Explore Listings</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-slate-500 text-white hover:bg-slate-800 h-14 px-8 text-base font-semibold rounded-full bg-transparent"
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
