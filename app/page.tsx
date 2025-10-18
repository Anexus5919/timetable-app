"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Menu, Zap, Clock, ShieldCheck, ArrowRight, Star, User as UserIcon, Layers, GanttChartSquare, LogOut, Eye, EyeOff } from "lucide-react";

// --- Authentication Modal ---
import { motion, AnimatePresence } from "framer-motion";

// --- FIREBASE IMPORTS ---
import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword, User as FirebaseUser, signOut } from "firebase/auth";
import { useAuth } from "@/lib/AuthContext";
// --- END IMPORTS ---


function AuthModal({ isOpen, onClose, initialMode = 'signin' }: { isOpen: boolean; onClose: (open: boolean) => void; initialMode?: 'signin' | 'signup' }) {
  const [isSignIn, setIsSignIn] = useState(initialMode === 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const clearFormState = useCallback(() => {
      setError(null);
      setName('');
      setEmail('');
      setPassword('');
      setIsLoading(false);
      setShowPassword(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
        setIsSignIn(initialMode === 'signin');
        clearFormState();
    } else {
        clearFormState();
    }
  }, [initialMode, isOpen, clearFormState]);

  const variants = {
    initial: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0, position: "absolute" as const }),
    animate: { x: 0, opacity: 1, position: "relative" as const, transition: { duration: 0.4, ease: easeInOut } },
    exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0, position: "absolute" as const, transition: { duration: 0.4, ease: easeInOut } }),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log(`Attempting ${isSignIn ? 'Sign In' : 'Sign Up'} with Email:`, email);

    try {
      let user: FirebaseUser;
      if (isSignIn) {
        console.log("Calling signInWithEmailAndPassword with:", { email: email, password: password ? '******' : 'EMPTY' });
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Sign in successful for:", userCredential.user.uid);
        user = userCredential.user;
      } else {
        console.log("Calling /api/auth/signup with:", { name, email, password: password ? '******' : 'EMPTY' });
        const response = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }), });
        if (!response.ok) {
          let errorMessage = `Server error: ${response.status} ${response.statusText}`;
          try { const data = await response.json(); errorMessage = data.error || errorMessage; } catch (parseError) { console.error("Could not parse error response from signup:", parseError); }
          throw new Error(errorMessage);
        }
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Signup failed');
        console.log("Sign up API successful, attempting client sign in...");
        console.log("Calling post-signup signInWithEmailAndPassword with:", { email: email, password: password ? '******' : 'EMPTY' });
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Client sign in successful after sign up.");
        user = userCredential.user;
      }
      console.log("Getting ID token for user:", user.uid);
      const idToken = await user.getIdToken();
      console.log("ID token obtained, sending to session-login API");
      const sessionResponse = await fetch('/api/auth/session-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }), });
      if (!sessionResponse.ok) {
         let sessionErrorMsg = 'Failed to create session';
         try { const sessionErrorData = await sessionResponse.json(); sessionErrorMsg = sessionErrorData.error || sessionErrorMsg; } catch(e) { /* Ignore */ }
         console.error("Session login API error:", sessionErrorMsg);
         throw new Error(sessionErrorMsg);
      }
      console.log("Session login API successful.");
      onClose(false);
    } catch (err: any) {
      console.error(`Auth handleSubmit ${isSignIn ? 'Sign In' : 'Sign Up'} Error:`, err);
      let displayError = err.message;
       if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') { displayError = 'Invalid email or password. Please try again.'; }
       else if (err.code === 'auth/too-many-requests') { displayError = 'Too many attempts. Please try again later.'; }
       else if (displayError.includes('Failed to create session')) { displayError = 'Login succeeded, but failed to save session. Please try again.'; }
       else { displayError = displayError.replace('Firebase: ', ''); }
      setError(displayError);
    }
    setIsLoading(false);
  };

  const toggleMode = () => { setIsSignIn(!isSignIn); clearFormState(); };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="relative overflow-hidden bg-slate-950/90 backdrop-blur-sm border-slate-800 text-white min-h-[420px] flex flex-col justify-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <AnimatePresence mode="wait" custom={isSignIn ? 1 : -1}>
          <motion.div key={isSignIn ? "signIn" : "signUp"} variants={variants} initial="initial" animate="animate" exit="exit" custom={isSignIn ? 1 : -1} className="w-full">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">{isSignIn ? "Welcome Back" : "Create Your Account"}</DialogTitle>
              <DialogDescription className="text-center text-slate-400">{isSignIn ? "Enter your credentials to access your dashboard." : "Get started in seconds."}</DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              {!isSignIn && (<div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required /></div>)}
              <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-slate-400 hover:text-white hover:bg-transparent" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Hide password" : "Show password"} style={{ top: 'calc(50% + 0.5rem)' }} >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {error && (<p className="text-sm text-red-400 text-center">{error}</p>)}
              <Button type="submit" disabled={isLoading} size="lg" className="w-full !mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
                {isLoading ? "Processing..." : (isSignIn ? "Sign In" : "Sign Up for Free")}
              </Button>
            </form>
            <p className="text-center text-sm text-slate-400 mt-3">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" onClick={toggleMode} className="pl-1.5 text-blue-400 hover:text-blue-300">{isSignIn ? "Sign Up" : "Sign In"}</Button>
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
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin');
  const navLinks = ["Features", "How it Works", "Testimonials"];
  const { user, isLoading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/session-logout', { method: 'POST' });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };


  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-x-hidden">
      <div className="absolute inset-0 z-[-2] bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      <DotGrid
        className="absolute inset-0 z-[1]" baseColor="rgba(255, 255, 255, 0.15)" activeColor="rgba(255, 255, 255, 0.4)"
        dotSize={2.5} gap={32} proximity={120}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-800/50 bg-black/30 backdrop-blur-sm h-16">
          <div className="container mx-auto flex h-full items-center justify-between px-4 md:px-6">

            {/* === Wrap Logo/Title in Link === */}
            <a href="#" className="flex items-center gap-3"> {/* Added <a> tag */}
              <h1 className="text-xl font-bold tracking-wider">SchedulAI</h1>
              <div className="w-8 h-8"><Orb className="w-full h-full" /></div>
            </a>
            {/* === End Logo/Title Link === */}

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{link}</a>)}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Button variant="ghost">Dashboard</Button>
                      <Button onClick={handleSignOut} size="icon" variant="outline" className="bg-transparent" title="Sign Out">
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={() => openAuthModal('signin')}>Sign In</Button>
                      <Button onClick={() => openAuthModal('signup')} className="bg-white text-black hover:bg-gray-200">Sign Up</Button>
                    </>
                  )}
                </>
              )}
               {isLoading && <div className="text-sm text-slate-400">Loading...</div>}
            </div>

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu /></Button></SheetTrigger>
                <SheetContent side="right" className="bg-slate-950/90 backdrop-blur-sm border-slate-800 text-white">
                  <SheetHeader><SheetTitle className="text-xl font-bold tracking-wider">SchedulAI</SheetTitle></SheetHeader>
                  <nav className="flex flex-col gap-6 mt-10">
                    {navLinks.map((link) => (<a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="text-lg font-medium text-slate-300 hover:text-white transition-colors">{link}</a>))}
                    <div className="flex flex-col gap-4 pt-6 border-t border-slate-800">
                      {!isLoading && (
                        <>
                          {user ? (
                            <>
                              <Button variant="outline" className="bg-transparent">Dashboard</Button>
                              <Button onClick={handleSignOut}>Sign Out</Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" className="bg-transparent" onClick={() => openAuthModal('signin')}>Sign In</Button>
                              <Button onClick={() => openAuthModal('signup')}>Sign Up</Button>
                            </>
                          )}
                        </>
                      )}
                      {isLoading && <div className="text-sm text-slate-400 text-center">Loading...</div>}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <section className="container mx-auto text-center px-4 pt-24 pb-20 sm:pt-32 sm:pb-28 relative">
             <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-b from-slate-50 to-slate-400 bg-clip-text text-transparent">
              Automate Your School's Timetable with AI
            </h2>
            <div className="mt-6">
              <p className="max-w-2xl mx-auto text-lg text-slate-300">Save hundreds of hours, eliminate conflicts, and create perfectly optimized schedules in minutes.</p>
              {!isLoading && !user && (
                 <Button onClick={() => openAuthModal('signup')} size="lg" className="mt-8 group px-8 py-6 text-base font-semibold shadow-blue-500/20 shadow-[0_8px_30px] transition-transform hover:scale-105">
                   Get Started for Free <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                 </Button>
              )}
               {!isLoading && user && (
                 <Button size="lg" className="mt-8 group px-8 py-6 text-base font-semibold shadow-blue-500/20 shadow-[0_8px_30px] transition-transform hover:scale-105">
                   Go to Dashboard <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                 </Button>
              )}
            </div>
          </section>

          <section id="features" className="container mx-auto px-4 pb-24 sm:pb-32 scroll-mt-16">
              <h3 className="text-3xl font-bold text-center mb-2">Powerful Features</h3>
            <p className="text-slate-400 text-center mb-12">Built for complexity, designed for simplicity.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard icon={<Zap className="w-8 h-8 text-blue-400" />} title="AI-Powered Automation" description="Our intelligent algorithm resolves conflicts and optimizes schedules in minutes, not weeks." />
              <FeatureCard icon={<Clock className="w-8 h-8 text-blue-400" />} title="Real-Time Editing" description="Drag-and-drop classes and get instant feedback on constraint violations." />
              <FeatureCard icon={<ShieldCheck className="w-8 h-8 text-blue-400" />} title="Constraint Management" description="Easily define hard and soft constraints to create the perfect timetable for your institution." />
            </div>
          </section>

          <section id="how-it-works" className="bg-slate-900/50 py-24 sm:py-32 scroll-mt-16">
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

          <section id="testimonials" className="container mx-auto px-4 py-24 sm:py-32 scroll-mt-16">
             <h3 className="text-3xl font-bold text-center mb-2">Trusted by Educators</h3>
            <p className="text-slate-400 text-center mb-12">See what school administrators are saying about SchedulAI.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TestimonialCard quote="SchedulAI saved us over 40 hours of manual work. The final timetable had zero conflicts. A complete game-changer." author="Jane Doe" title="Principal, Techville High" />
              <TestimonialCard quote="The ability to set soft constraints is incredible. We finally have a schedule that not only works but also makes our teachers happier." author="John Smith" title="Academic Coordinator, Innovate Academy" />
              <TestimonialCard quote="I was skeptical about an AI doing this, but the results are flawless. The UI is intuitive and the support is fantastic." author="Emily White" title="Administrator, Future Minds School" />
            </div>
          </section>

          {!isLoading && !user && (
            <section className="container mx-auto px-4 pb-24 sm:pb-32 text-center">
               <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12">
                <h3 className="text-3xl font-bold mb-4">Ready to Revolutionize Your Scheduling?</h3>
                <p className="text-slate-400 max-w-2xl mx-auto mb-8">Stop wrestling with spreadsheets. Start building intelligent, conflict-free timetables today.</p>
                <Button onClick={() => openAuthModal('signup')} size="lg" className="group px-8 py-6 text-base font-semibold shadow-blue-500/20 shadow-[0_8px_30px] transition-transform hover:scale-105">
                  Get Started for Free <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </section>
          )}
        </main>

         <footer className="border-t border-slate-800/50">
          <div className="container mx-auto py-6 text-center text-slate-500 text-sm">&copy; {new Date().getFullYear()} SchedulAI. All rights reserved.</div>
        </footer>
      </div>
      <AuthModal isOpen={isModalOpen} onClose={setIsModalOpen} initialMode={modalMode} />
    </div>
  );
}

// --- Sub-components ---
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
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mr-4"><UserIcon className="w-6 h-6 text-slate-400"/></div>
        <div>
          <p className="font-semibold text-slate-100">{author}</p>
          <p className="text-sm text-slate-400">{title}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);