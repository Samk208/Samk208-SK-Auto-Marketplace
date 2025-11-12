'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

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

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);


export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
             <Link href="/" className="flex items-center">
              <LogoIcon className="h-7 text-foreground" />
            </Link>
            <p className="text-sm">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2 text-sm">
                    <LockIcon className="h-4 w-4 text-green-500" />
                    <span>{t('secure_transactions')}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm">
                    <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                    <span>{t('buyer_protection')}</span>
                </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-foreground">{t('home')}</Link></li>
              <li><Link href="/cars" className="hover:text-foreground">{t('cars')}</Link></li>
              <li><Link href="/about" className="hover:text-foreground">{t('about')}</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">{t('contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" className="hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} {t('logo')}. {t('all_rights_reserved')}.
        </div>
      </div>
    </footer>
  );
};