import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ThemeToggle } from '../components/ThemeToggle';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (user && user.emailVerified) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerError, setRegisterError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            if (!userCredential.user.emailVerified) {
                setLoginError('Please verify your email before logging in.');
                setIsLoggingIn(false);
                return;
            }
            navigate('/dashboard');
        } catch (error: any) {
            // Firebase v9+ consolidates not-found and wrong-password into invalid-credential
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setLoginError("Account not found. Please create an account and verify your email to log in.");
            } else if (error.code === 'auth/wrong-password') {
                setLoginError('Incorrect password. Please try again.');
            } else {
                setLoginError('Failed to sign in. Please try again later.');
            }
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError('');
        setIsRegistering(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
            await sendEmailVerification(userCredential.user);
            // We NO LONGER sign them out here. We let the AuthContext hold them in state
            // and LandingPage will show the "Waiting for Verification" UI.
            setRegisterError('');
        } catch (error: any) {
            setRegisterError(error.message || 'Failed to create account');
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center p-6 lg:p-12 overflow-hidden transition-colors duration-300">
            <div className="absolute top-6 right-6 lg:top-8 lg:right-12 z-50">
                <ThemeToggle />
            </div>

            {user && !user.emailVerified ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full relative z-10"
                >
                    <Card className="w-full border-border shadow-xl rounded-[2.5rem] bg-card/95 dark:bg-muted/20 backdrop-blur-sm overflow-hidden py-12">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-3">Verify Your Email</h2>
                            <p className="text-muted-foreground mb-8">
                                We've sent a verification link to <span className="font-semibold text-foreground">{user.email}</span>.
                                Please click the link to activate your account.
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium bg-muted/50 px-4 py-2 rounded-full mb-8">
                                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                                Waiting for verification...
                            </div>
                            <Button variant="outline" onClick={() => signOut(auth)} className="w-full h-10 border-border text-foreground hover:bg-muted bg-background rounded-lg font-medium transition-all">
                                Sign In with Different Account
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* ... existing two-column layout ... */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        <div className="flex items-center mb-8">
                            <span className="font-bold text-xl md:text-2xl text-foreground tracking-tight">FleetFlow</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
                            Manage Your Fleet. <br />Optimize Every Mile.
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mt-4 mb-8">
                            FleetFlow is a modular fleet and logistics management system designed to streamline operations, track performance, and improve decision-making.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 rounded-lg font-medium text-base shadow-sm hover:shadow-md transition-all duration-200 active:scale-95" onClick={() => setIsFlipped(false)}>
                                Sign In
                            </Button>
                            <Button variant="outline" className="h-12 px-8 border-border text-foreground hover:bg-muted bg-background rounded-lg font-medium text-base shadow-sm hover:shadow-md transition-all duration-200 active:scale-95" onClick={() => setIsFlipped(true)}>
                                Register Now
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        className="relative w-full max-w-md mx-auto perspective-[1000px] h-[580px] z-10"
                    >
                        <div className={`relative w-full h-full text-left transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? "rotate-y-180" : ""}`}>
                            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                                <Card className="w-full h-full border-border shadow-md hover:shadow-lg transition-shadow duration-300 rounded-[2.5rem] bg-card/95 dark:bg-muted/20 backdrop-blur-sm overflow-hidden flex flex-col justify-center">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Welcome Back</h2>
                                            <p className="text-sm text-muted-foreground mt-2">Sign in to your fleet command center.</p>
                                        </div>
                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-foreground">Email Address</Label>
                                                <Input required type="email" placeholder="name@company.com" className="h-10 border-border hover:border-border/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent rounded-lg bg-background" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-foreground">Password</Label>
                                                <Input required type="password" placeholder="••••••••" className="h-10 border-border hover:border-border/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent rounded-lg bg-background" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                                            </div>
                                            {loginError && <p className="text-sm text-red-600 font-medium px-1">{loginError}</p>}
                                            <Button type="submit" disabled={isLoggingIn} className="w-full h-10 rounded-lg font-medium bg-gray-900 text-white hover:bg-black focus-visible:ring-2 focus-visible:ring-gray-900/80 transition-all mt-4 shadow-sm hover:shadow-md active:scale-95">
                                                {isLoggingIn ? 'Signing In...' : 'Sign In'}
                                            </Button>
                                        </form>
                                        <p className="text-center text-sm text-muted-foreground mt-8">
                                            Don't have an account?{' '}
                                            <button type="button" onClick={() => setIsFlipped(true)} className="font-semibold text-foreground hover:text-foreground/80 transition-colors hover:underline">
                                                Register here
                                            </button>
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                <Card className="w-full h-full border-border shadow-md hover:shadow-lg transition-shadow duration-300 rounded-[2.5rem] bg-card/95 dark:bg-muted/20 backdrop-blur-sm overflow-hidden flex flex-col justify-center">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Create Account</h2>
                                            <p className="text-sm text-muted-foreground mt-2">Set up your profile for unified fleet access.</p>
                                        </div>
                                        <form onSubmit={handleRegister} className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-foreground">Full Name</Label>
                                                <Input required placeholder="John Doe" className="h-10 border-border hover:border-border/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent rounded-lg bg-background" value={regName} onChange={e => setRegName(e.target.value)} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-foreground">Email Address</Label>
                                                <Input required type="email" placeholder="name@company.com" className="h-10 border-border hover:border-border/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent rounded-lg bg-background" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-sm font-medium text-foreground">Password</Label>
                                                <Input required type="password" placeholder="••••••••" className="h-10 border-border hover:border-border/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent rounded-lg bg-background" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                                            </div>
                                            {registerError && <p className="text-sm text-destructive font-medium px-1">{registerError}</p>}
                                            <Button type="submit" disabled={isRegistering} className="w-full h-10 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring transition-all mt-6 shadow-sm hover:shadow-md active:scale-95">
                                                {isRegistering ? 'Creating Account...' : 'Create Account'}
                                            </Button>
                                        </form>
                                        <p className="text-center text-sm text-muted-foreground mt-6">
                                            Already have an account?{' '}
                                            <button type="button" onClick={() => setIsFlipped(false)} className="font-semibold text-foreground hover:text-foreground/80 transition-colors hover:underline">
                                                Sign in
                                            </button>
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
