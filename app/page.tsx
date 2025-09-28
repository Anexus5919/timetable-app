"use client";

import { useState } from "react";
import DotGrid from "../components/DotGrid";
import Orb from "../components/Orb";
import { easeInOut } from "framer-motion";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Icon imports from lucide-react
import { Menu, Zap, Clock, ShieldCheck, ArrowRight, Star, User, Layers, GanttChartSquare } from "lucide-react";

// --- Authentication Modal ---
// --- Authentication Modal with Sliding Animation ---
import { motion, AnimatePresence } from "framer-motion";

function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: (open: boolean) => void }) {
  const [isSignIn, setIsSignIn] = useState(true);

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      position: "absolute" as const,
    }),
    animate: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
      transition: { duration: 0.4, ease: easeInOut },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      position: "absolute" as const,
      transition: { duration: 0.4, ease: easeInOut },
    }),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="relative overflow-hidden bg-slate-950/90 backdrop-blur-sm border-slate-800 text-white min-h-[420px] flex flex-col justify-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <AnimatePresence mode="wait" custom={isSignIn ? 1 : -1}>
          <motion.div
            key={isSignIn ? "signIn" : "signUp"}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={isSignIn ? 1 : -1}
            className="w-full"
          >
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">
                {isSignIn ? "Welcome Back" : "Create Your Account"}
              </DialogTitle>
              <DialogDescription className="text-center text-slate-400">
                {isSignIn
                  ? "Enter your credentials to access your dashboard."
                  : "Get started in seconds."}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              {!isSignIn && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button
                type="submit"
                className="w-full !mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                size="lg"
              >
                {isSignIn ? "Sign In" : "Sign Up for Free"}
              </Button>
            </form>
            <p className="text-center text-sm text-slate-400 mt-3">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                className="pl-1.5 text-blue-400 hover:text-blue-300"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </Button>
            </p>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}



// --- Main Landing Page ---
export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navLinks = ["Features", "How it Works", "Testimonials"];

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-x-hidden">
      <div className="absolute inset-0 z-[-2] bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      <DotGrid 
        className="absolute inset-0 z-[1]" 
        baseColor="rgba(255, 255, 255, 0.15)" 
        activeColor="rgba(255, 255, 255, 0.4)" 
        dotSize={2}
        gap={32}
        proximity={120}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* --- Header --- */}
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-800/50 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-wider">SchedulAI</h1>
              <div className="w-8 h-8">
                <Orb className="w-full h-full" />
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{link}</a>)}
            </nav>
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(true)}>Sign In</Button>
              <Button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-gray-200">Sign Up</Button>
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu /></Button></SheetTrigger>
                <SheetContent side="right" className="bg-slate-950/90 backdrop-blur-sm border-slate-800 text-white"><SheetHeader><SheetTitle className="text-xl font-bold tracking-wider">SchedulAI</SheetTitle></SheetHeader><nav className="flex flex-col gap-6 mt-10">{navLinks.map((link) => (<a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-lg font-medium text-slate-300 hover:text-white transition-colors">{link}</a>))}<div className="flex flex-col gap-4 pt-6 border-t border-slate-800"><Button variant="outline" className="bg-transparent" onClick={() => setIsModalOpen(true)}>Sign In</Button><Button onClick={() => setIsModalOpen(true)}>Sign Up</Button></div></nav></SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {/* --- Hero Section --- */}
          <section className="container mx-auto text-center px-4 pt-24 pb-20 sm:pt-32 sm:pb-28 relative">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-b from-slate-50 to-slate-400 bg-clip-text text-transparent">
              Automate Your School's Timetable with AI
            </h2>
            <div className="mt-6">
              <p className="max-w-2xl mx-auto text-lg text-slate-300">Save hundreds of hours, eliminate conflicts, and create perfectly optimized schedules in minutes.</p>
              <Button onClick={() => setIsModalOpen(true)} size="lg" className="mt-8 group px-8 py-6 text-base font-semibold shadow-blue-500/20 shadow-[0_8px_30px] transition-transform hover:scale-105">
                Get Started for Free <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </section>

          {/* --- Features Section --- */}
          <section id="features" className="container mx-auto px-4 pb-24 sm:pb-32">
            <h3 className="text-3xl font-bold text-center mb-2">Powerful Features</h3>
            <p className="text-slate-400 text-center mb-12">Built for complexity, designed for simplicity.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard icon={<Zap className="w-8 h-8 text-blue-400" />} title="AI-Powered Automation" description="Our intelligent algorithm resolves conflicts and optimizes schedules in minutes, not weeks." />
              <FeatureCard icon={<Clock className="w-8 h-8 text-blue-400" />} title="Real-Time Editing" description="Drag-and-drop classes and get instant feedback on constraint violations." />
              <FeatureCard icon={<ShieldCheck className="w-8 h-8 text-blue-400" />} title="Constraint Management" description="Easily define hard and soft constraints to create the perfect timetable for your institution." />
            </div>
          </section>

          {/* --- How It Works Section --- */}
          <section id="how-it-works" className="bg-slate-900/50 py-24 sm:py-32">
            <div className="container mx-auto px-4">
              <h3 className="text-3xl font-bold text-center mb-2">Get Your Perfect Timetable in 3 Easy Steps</h3>
              <p className="text-slate-400 text-center mb-16">From data import to final schedule in minutes.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800 -translate-y-1/2 hidden md:block"></div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-slate-800 -translate-x-1/2 md:hidden"></div>
                <HowItWorksStep icon={<Layers/>} number="01" title="Input Your Data" description="Easily upload teachers, subjects, rooms, and student groups." />
                <HowItWorksStep icon={<GanttChartSquare/>} number="02" title="Define Constraints" description="Set your rules and preferences for the AI to follow." />
                <HowItWorksStep icon={<Zap/>} number="03" title="Generate & Export" description="Click generate, review the results, and export your timetable." />
              </div>
            </div>
          </section>

          {/* --- Testimonials Section --- */}
          <section id="testimonials" className="container mx-auto px-4 py-24 sm:py-32">
            <h3 className="text-3xl font-bold text-center mb-2">Trusted by Educators</h3>
            <p className="text-slate-400 text-center mb-12">See what school administrators are saying about SchedulAI.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TestimonialCard quote="SchedulAI saved us over 40 hours of manual work. The final timetable had zero conflicts. A complete game-changer." author="Jane Doe" title="Principal, Techville High" />
              <TestimonialCard quote="The ability to set soft constraints is incredible. We finally have a schedule that not only works but also makes our teachers happier." author="John Smith" title="Academic Coordinator, Innovate Academy" />
              <TestimonialCard quote="I was skeptical about an AI doing this, but the results are flawless. The UI is intuitive and the support is fantastic." author="Emily White" title="Administrator, Future Minds School" />
            </div>
          </section>
          
          {/* --- Final CTA Section --- */}
          <section className="container mx-auto px-4 pb-24 sm:pb-32 text-center">
             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12">
                <h3 className="text-3xl font-bold mb-4">Ready to Revolutionize Your Scheduling?</h3>
                <p className="text-slate-400 max-w-2xl mx-auto mb-8">Stop wrestling with spreadsheets. Start building intelligent, conflict-free timetables today.</p>
                <Button onClick={() => setIsModalOpen(true)} size="lg" className="group px-8 py-6 text-base font-semibold shadow-blue-500/20 shadow-[0_8px_30px] transition-transform hover:scale-105">
                  Get Started for Free <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
             </div>
          </section>

        </main>

        {/* --- Footer --- */}
        <footer className="border-t border-slate-800/50">
          <div className="container mx-auto py-6 text-center text-slate-500 text-sm">&copy; {new Date().getFullYear()} SchedulAI. All rights reserved.</div>
        </footer>
      </div>
      <AuthModal isOpen={isModalOpen} onClose={setIsModalOpen} />
    </div>
  );
}

// --- Sub-components for cleaner code ---

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="bg-slate-900/50 border-slate-800 text-center p-6 transition-transform hover:-translate-y-2">
    <CardHeader>
      <div className="mx-auto bg-slate-800/70 w-14 h-14 flex items-center justify-center rounded-lg mb-4">{icon}</div>
      <CardTitle className="text-xl text-slate-100">{title}</CardTitle>
    </CardHeader>
    <CardContent><p className="text-slate-400">{description}</p></CardContent>
  </Card>
);

const HowItWorksStep = ({ icon, number, title, description }: { icon: React.ReactNode; number: string; title: string; description: string }) => (
  <div className="relative z-10 flex flex-col items-center text-center p-4">
    <div className="bg-black w-20 h-20 flex items-center justify-center rounded-full border-2 border-slate-800 mb-4">
      <div className="bg-slate-900 w-16 h-16 flex items-center justify-center rounded-full text-blue-400">{icon}</div>
    </div>
    <h4 className="text-lg font-semibold text-slate-100 mb-1">{number}. {title}</h4>
    <p className="text-slate-400">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, title }: { quote: string; author: string; title: string }) => (
  <Card className="bg-slate-900/50 border-slate-800 p-6">
    <CardContent className="p-0">
      <div className="flex text-yellow-400 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5" />)}</div>
      <blockquote className="text-slate-300 italic">"{quote}"</blockquote>
      <div className="flex items-center mt-6">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mr-4"><User className="w-6 h-6 text-slate-400"/></div>
        <div>
          <p className="font-semibold text-slate-100">{author}</p>
          <p className="text-sm text-slate-400">{title}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
