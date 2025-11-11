import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface StatItemProps {
    value: string;
    label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-3xl md:text-4xl font-bold text-primary">{value}</p>
        <p className="text-sm md:text-base text-muted-foreground">{label}</p>
    </div>
);

export const StatsSection: React.FC = () => {
    const { t } = useTranslation();
    
    const stats = [
        { value: '500+', label: t('stats_cars_listed') },
        { value: '200+', label: t('stats_happy_buyers') },
        { value: '50+', label: t('stats_trusted_sellers') },
        { value: '15+', label: t('stats_countries_served') },
    ];

    return (
        <section className="bg-background py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map(stat => (
                        <StatItem key={stat.label} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};
