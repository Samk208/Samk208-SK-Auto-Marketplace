
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const MessageCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
);

export const MessagesPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t('messages')}</h1>
            </div>
            <div className="text-center py-20 bg-muted/40 rounded-lg">
                <MessageCircleIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                <h2 className="mt-6 text-xl font-semibold">{t('messaging_coming_soon_title')}</h2>
                <p className="mt-2 text-muted-foreground">{t('messaging_coming_soon_desc')}</p>
            </div>
        </div>
    );
};
