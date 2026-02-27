import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ThemeToggle } from '../components/ThemeToggle';

export function LandingPage() {
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(false); // false = Login, true = Register

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginRole, setLoginRole] = useState('admin');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regRole, setRegRole] = useState('admin');
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerError, setRegisterError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                    role: loginRole,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setLoginError(data.message || 'Login failed');
                setIsLoggingIn(false);
                return;
            }

            if (data.accessToken && data.user) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify({
                    email: data.user.email,
                    role: data.user.role,
                    name: data.user.full_name
                }));
                navigate('/dashboard');
            } else {
                setLoginError('Invalid response from server');
                setIsLoggingIn(false);
            }
                    const handleLogin = (e: React.FormEvent) => {
                        e.preventDefault();
                        setLoginError('');
                        setIsLoggingIn(true);
                        // Mock login logic
                        const user = MOCK_USERS.find(
                            u => u.email === loginEmail && u.password === loginPassword && u.role === loginRole
                        );
                        setTimeout(() => {
                            if (user) {
                                localStorage.setItem('user', JSON.stringify({
                                    email: user.email,
                                    role: user.role,
                                    name: user.email.split('@')[0]
                                }));
                                navigate('/dashboard');
                            } else {
                                setLoginError('Invalid credentials');
                            }
                            setIsLoggingIn(false);
                        }, 800);
                    };
                setRegisterError('Invalid response from server');
                setIsRegistering(false);
            }
        } catch (err: any) {
            setRegisterError(err.message || 'An error occurred during registration');
            setIsRegistering(false);
        }
    };

                    const handleRegister = (e: React.FormEvent) => {
                        e.preventDefault();
                        setRegisterError('');
                        setIsRegistering(true);
                        // Mock register logic
                        setTimeout(() => {
                            if (regEmail && regPassword && regRole) {
                                localStorage.setItem('user', JSON.stringify({
                                    email: regEmail,
                                    role: regRole,
                                    name: regName || regEmail.split('@')[0]
                                }));
                                navigate('/dashboard');
                            } else {
                                setRegisterError('Please fill all fields');
                            }
                            setIsRegistering(false);
                        }, 800);
                    };
                >
                    <div
                        className={`relative w-full h-full text-left transition-all duration-500 transform-3d ${isFlipped ? "rotate-y-180" : ""}`}
                    >

                        {/* FRONT (LOGIN) */}
                        <div className="absolute inset-0 w-full h-full backface-hidden">
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
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-foreground">Select Role</Label>
                                            <Select value={loginRole} onValueChange={setLoginRole}>
                                                <SelectTrigger className="w-full h-10 border-border hover:border-border/80 transition-colors focus:ring-2 focus:ring-ring focus:border-transparent rounded-lg bg-background">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-lg shadow-md border-border bg-popover">
                                                    <SelectItem value="admin" className="hover:bg-muted transition-colors cursor-pointer text-popover-foreground">Admin</SelectItem>
                                                    <SelectItem value="manager" className="hover:bg-muted transition-colors cursor-pointer text-popover-foreground">Manager</SelectItem>
                                                    <SelectItem value="dispatcher" className="hover:bg-muted transition-colors cursor-pointer text-popover-foreground">Dispatcher</SelectItem>
                                                    <SelectItem value="safety_officer" className="hover:bg-muted transition-colors cursor-pointer text-popover-foreground">Safety Officer</SelectItem>
                                                </SelectContent>
                                            </Select>
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

                        {/* BACK (REGISTER) */}
                        <div className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)]">
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
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-foreground">Requested Role</Label>
                                            <Select value={regRole} onValueChange={setRegRole}>
                                                <SelectTrigger className="w-full h-10 border-border hover:border-border/80 transition-colors focus:ring-2 focus:ring-ring focus:border-transparent rounded-lg bg-background">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-lg shadow-md border-border bg-popover">
                                                    <SelectItem value="admin" className="hover:bg-muted transition-colors cursor-pointer text-popover-foreground">Admin</SelectItem>
                                                    <SelectItem value="manager" className="hover:bg-muted transition-colors cursor-pointer text-popover-foreground">Manager</SelectItem>
                                                    <SelectItem value="dispatcher" className="hover:bg-muted transition-colors cursor-pointer text-popover-foreground">Dispatcher</SelectItem>
                                                    <SelectItem value="safety_officer" className="hover:bg-muted transition-colors cursor-pointer text-popover-foreground">Safety Officer</SelectItem>
                                                </SelectContent>
                                            </Select>
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

        </div>
    );
}
