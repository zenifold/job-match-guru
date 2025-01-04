import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export const PricingSection = () => {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">$5/month</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {["5 AI-optimized resumes/month", "Basic ATS optimization", "PDF exports"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For serious job seekers</CardDescription>
              <div className="text-3xl font-bold">$10/month</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Unlimited AI-optimized resumes",
                  "Advanced ATS optimization",
                  "Multiple resume formats",
                  "Job application tracking",
                  "Priority support"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/login">Try Pro</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For teams and organizations</CardDescription>
              <div className="text-3xl font-bold">$15/month</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Everything in Pro",
                  "Team collaboration",
                  "Custom branding",
                  "API access",
                  "Dedicated support",
                  "Analytics dashboard"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/login">Contact Sales</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};