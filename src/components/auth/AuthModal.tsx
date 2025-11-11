'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  initialRole?: 'buyer' | 'seller';
}

const CarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 16H8a4 4 0 0 0-4 4v1h16v-1a4 4 0 0 0-4-4Z" />
    <path d="M4 16V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8" />
    <circle cx="8" cy="20" r="2" />
    <circle cx="16" cy="20" r="2" />
  </svg>
);

const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'buyer'
}) => {
  const [activeTab, setActiveTab] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>(initialRole);
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, isSigningIn, isSigningUp } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setError(null);
      if (initialMode === 'signup') {
        setRole(initialRole);
      }
    }
  }, [isOpen, initialMode, initialRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await signIn({ email, password });

      if (result.success) {
        // Success - close modal and let useAuth handle the state update
        onClose();
        // Reset form
        setEmail('');
        setPassword('');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await signUp({
        email,
        password,
        fullName: fullName || email,
        role
      });

      if (result.success) {
        // Success - close modal and let useAuth handle the state update
        onClose();
        // Reset form
        setEmail('');
        setPassword('');
        setFullName('');
      } else {
        setError(result.error || 'Sign up failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An unexpected error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('login')}</TabsTrigger>
            <TabsTrigger value="signup">{t('signup')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <DialogHeader className="text-left mt-4">
              <DialogTitle>{t('auth_modal_login_title')}</DialogTitle>
              <DialogDescription>{t('auth_modal_login_subtitle')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="login-email">{t('email_label')}</Label>
                  <Input id="login-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="login-password">{t('password_label')}</Label>
                  <Input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSigningIn}>
                {isSigningIn ? t('loading') : t('login_cta')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {t('login_toggle')}{' '}
              <button onClick={() => setActiveTab('signup')} className="underline">
                {t('signup')}
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup">
            <DialogHeader className="text-left mt-4">
              <DialogTitle>{t('auth_modal_signup_title')}</DialogTitle>
              <DialogDescription>{t('auth_modal_signup_subtitle')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignUp}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>{t('choose_your_role')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input type="radio" id="buyer-role" name="role" value="buyer" className="sr-only peer" checked={role === 'buyer'} onChange={() => setRole('buyer')} />
                      <Label htmlFor="buyer-role" className="flex flex-col items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 transition-colors">
                        <CarIcon className="w-8 h-8 mb-2" />
                        <span className="font-semibold">{t('i_want_to_buy')}</span>
                      </Label>
                    </div>
                    <div>
                      <input type="radio" id="seller-role" name="role" value="seller" className="sr-only peer" checked={role === 'seller'} onChange={() => setRole('seller')} />
                      <Label htmlFor="seller-role" className="flex flex-col items-center justify-center text-center p-4 border-2 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5 transition-colors">
                        <TagIcon className="w-8 h-8 mb-2" />
                        <span className="font-semibold">{t('i_want_to_sell')}</span>
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="signup-fullname">{t('fullname_label')}</Label>
                    <Input id="signup-fullname" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">{t('email_label')}</Label>
                  <Input id="signup-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">{t('password_label')}</Label>
                  <Input id="signup-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSigningUp}>
                {isSigningUp ? t('loading') : t('signup_cta')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                {t('signup_toggle')}{' '}
              <button onClick={() => setActiveTab('login')} className="underline">
                {t('login')}
              </button>
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
};