
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Page } from '@/types';
import { Button } from '@/components/ui/Button';

const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export const SavedSearchesPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t('my_saved_searches')}</h1>
            </div>
            <div className="text-center py-20 bg-muted/40 rounded-lg">
                <SaveIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                <h2 className="mt-6 text-xl font-semibold">{t('empty_saved_searches_title')}</h2>
                <p className="mt-2 text-muted-foreground">{t('empty_saved_searches_desc')}</p>
                <Button className="mt-6" onClick={() => onNavigate('cars')}>{t('browse_cars')}</Button>
            </div>
        </div>
    );
};
