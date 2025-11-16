
 'use client';

 import React, { useState, useEffect, useRef } from 'react';
 import Image from 'next/image';
 import Link from 'next/link';
 import { useRouter } from 'next/navigation';
 import { useTheme } from '@/hooks/useTheme';
 import { useTranslation } from '@/hooks/useTranslation';
 import type { User, Language, Page } from '@/types/types';
 import { Button } from '@/components/ui/Button';

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 160 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g>
      <path d="M14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0Z" fill="hsl(var(--primary))"/>
      <path d="M14 28C16.9815 28 19.8118 27.149 22.1441 25.6625L7.02741 2.3375C4.85096 4.18824 3.32115 6.65074 2.68456 9.5H14V28Z" fill="hsl(var(--primary-foreground))"/>
      <path d="M14 0C11.0185 0 8.18818 0.850963 5.85587 2.3375L20.9726 25.6625C23.149 23.8118 24.6788 21.3493 25.3154 18.5H14V0Z" fill="hsl(var(--primary-foreground))"/>
    </g>
    <text x="36" y="21" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="bold" fill="currentColor">
      SK <tspan fontWeight="500">AutoSphere</tspan>
    </text>
  </svg>
);


const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
    {children}
  </span>
);

interface HeaderProps {
  onLogin?: () => void;
  onSignUp?: (role?: 'buyer' | 'seller') => void;
  onLogout?: () => void;
  user?: User | null;
  onNavigate?: (page: Page, context?: unknown) => void;
  currentPage?: Page;
}

const NavLink: React.FC<{ page: Page; active: boolean; onClick: (page: Page) => void; children: React.ReactNode }>
  = ({ page, active, onClick, children }) => (
    <button onClick={() => onClick(page)} className={`transition-colors ${active ? 'text-foreground' : 'text-foreground/60 hover:text-foreground/80'}`}>{children}</button>
  );

export const Header: React.FC<HeaderProps> = ({ onLogin, onSignUp, user, onLogout, onNavigate, currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const pageToPath = (page: Page): string => {
    switch (page) {
      case 'home':
        return '/';
      case 'cars':
        return '/cars';
      case 'favorites':
        return '/favorites';
      case 'messages':
        return '/messages';
      case 'seller-dashboard':
        return '/seller-dashboard';
      case 'list-car':
        return '/seller-dashboard';
      default:
        return '/';
    }
  };

  const navigate: (page: Page) => void = onNavigate
    ? (page) => onNavigate(page)
    : (page) => router.push(pageToPath(page));
  const doLogin = onLogin ?? (() => {});
  const doSignUp = onSignUp ?? (() => {});
  const doLogout = onLogout ?? (() => {});
  const activePage = currentPage ?? ('home' as Page);

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
    { code: 'fr', name: 'Français' },
    { code: 'sw', name: 'Kiswahili' },
  ];

  // Fix hydration error: only render theme toggle on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon className="h-7 text-foreground" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink page="home" active={activePage === 'home'} onClick={navigate}>{t('home')}</NavLink>
            <NavLink page="cars" active={activePage === 'cars'} onClick={navigate}>{t('browse_cars')}</NavLink>
            
            {user?.role === 'buyer' && (
              <>
                <NavLink page="favorites" active={activePage === 'favorites'} onClick={navigate}>{t('my_favorites')}</NavLink>
                <NavLink page="messages" active={activePage === 'messages'} onClick={navigate}>{t('messages')}<Badge>{t('coming_soon')}</Badge></NavLink>
              </>
            )}

            {user?.role === 'seller' && (
               <>
                <button onClick={() => navigate('seller-dashboard')} className="text-foreground/60 transition-colors hover:text-foreground/80">{t('my_listings')}</button>
                <button onClick={() => navigate('messages')} className="text-foreground/60 transition-colors hover:text-foreground/80 flex items-center">{t('messages')}<Badge>{t('coming_soon')}</Badge></button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={langDropdownRef}>
            <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="p-2 rounded-full hover:bg-accent">
              <GlobeIcon className="h-5 w-5" />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${language === lang.code ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Theme toggle - only render on client to avoid hydration errors */}
          {mounted ? (
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-accent" aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>
          ) : (
            <div className="p-2 w-9 h-9" />
          )}

          {user ? (
            <>
              {user.role === 'seller' && (
                <Button onClick={() => navigate('list-car')} size="sm">{t('list_your_car_free')}</Button>
              )}
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2">
                  <Image src={user.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.fullName)}`}
                         alt={user.fullName}
                         width={32}
                         height={32}
                         className="h-8 w-8 rounded-full" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                     <div className="py-1">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-popover-foreground truncate">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      {user.role === 'buyer' ? (
                        <>
                          <button onClick={() => { navigate('saved-searches'); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent">{t('my_saved_searches')}</button>
                          <Link href="/settings" className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent">{t('settings')}</Link>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { navigate('seller-dashboard'); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent">{t('dashboard')}</button>
                          <Link href="/settings" className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent">{t('settings')}</Link>
                        </>
                      )}
                      <button
                        onClick={() => {
                          doLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent border-t"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signup?role=seller" className="hidden lg:inline-flex text-sm font-medium text-foreground/80 hover:text-foreground">{t('sell_your_car')}</Link>
              <Button onClick={doLogin} variant="ghost" className="hidden sm:inline-flex">{t('login')}</Button>
              <Button onClick={() => doSignUp()}> {t('signup')}</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
