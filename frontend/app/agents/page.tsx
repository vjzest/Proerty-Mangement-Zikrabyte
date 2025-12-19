import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Mail, Phone, MapPin, Star, ArrowRight } from "lucide-react";

export default function AgentsPage() {
  const teamMembers = [
    {
      name: "Rohan Verma",
      role: "Luxury Property Specialist",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      listings: 24,
      rating: 4.9,
      email: "rohan.v@estatehub.com",
    },
    {
      name: "Priya Sharma",
      role: "Commercial Real Estate Expert",
      image: "https://randomuser.me/api/portraits/women/75.jpg",
      listings: 18,
      rating: 4.8,
      email: "priya.s@estatehub.com",
    },
    {
      name: "Amit Patel",
      role: "Residential Advisor",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      listings: 32,
      rating: 4.9,
      email: "amit.p@estatehub.com",
    },
    {
      name: "Sunita Reddy",
      role: "Investment Consultant",
      image: "https://randomuser.me/api/portraits/women/76.jpg",
      listings: 15,
      rating: 5.0,
      email: "sunita.r@estatehub.com",
    },
    {
      name: "Vikram Singh",
      role: "Rental Properties Manager",
      image: "https://randomuser.me/api/portraits/men/78.jpg",
      listings: 45,
      rating: 4.7,
      email: "vikram.s@estatehub.com",
    },
    {
      name: "Anjali Desai",
      role: "New Projects Specialist",
      image: "https://randomuser.me/api/portraits/women/78.jpg",
      listings: 20,
      rating: 4.8,
      email: "anjali.d@estatehub.com",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-black">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 text-white">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Find Your Perfect Agent
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Connect with our top-rated professionals who are committed to your
              success.
            </p>
          </div>
        </section>

        {/* Filters and Agent Grid */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <Card className="p-4 sm:p-6 mb-12 shadow-md -mt-36 relative z-10 bg-background/80 backdrop-blur-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium">
                    Agent Name or Location
                  </label>
                  <Input
                    placeholder="e.g., Priya Sharma or Juhu"
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Specialty</label>
                  <Select>
                    <SelectTrigger className="mt-1 h-12">
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="lg"
                  className="h-12 w-full flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Find Agent
                </Button>
              </div>
            </Card>

            {/* Agent Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <Card
                  key={member.name}
                  className="overflow-visible group transition-all duration-300 ease-out hover:shadow-2xl"
                >
                  <CardContent className="relative p-0 text-center">
                    <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-t-lg"></div>
                    <Avatar className="w-28 h-28 mx-auto absolute -top-14 left-0 right-0 border-4 border-background shadow-lg">
                      <AvatarImage src={member.image} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="px-6 pb-6 pt-16">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                        {member.role}
                      </p>

                      <div className="mt-4 flex justify-center items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {member.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({member.listings} listings)
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" /> {member.email}
                      </p>

                      <Button
                        asChild
                        className="w-full mt-6 font-semibold group/btn"
                      >
                        <Link href="#">
                          View Profile{" "}
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
