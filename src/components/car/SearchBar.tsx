import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Page } from '@/types/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface HomepageSearchProps {
    onNavigate: (page: Page, context?: any) => void;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);


export const HomepageSearch: React.FC<HomepageSearchProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onNavigate('cars', { initialSearchTerm: searchTerm });
    }

    return (
        <section className="bg-muted/40 py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('find_your_perfect_car')}</h2>
                    <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-4">
                        <Input 
                            type="text"
                            placeholder="e.g., Kia Seltos 2023"
                            className="h-12 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button type="submit" size="lg" className="h-12">
                            <SearchIcon className="mr-2 h-5 w-5" />
                            {t('search_now')}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}
