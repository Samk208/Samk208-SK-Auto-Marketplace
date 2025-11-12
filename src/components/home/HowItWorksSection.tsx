import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const MessageCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
);
const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);
const ListPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/></svg>
);
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const HandshakeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/><path d="M13 17a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-5"/><path d="M12 12v3"/><path d="M12 10.5V9"/></svg>
);

interface Step {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const StepColumn: React.FC<{title: string; steps: Step[]}> = ({ title, steps }) => (
    <div>
        <h3 className="text-2xl font-semibold mb-8 text-center md:text-left">{title}</h3>
        <div className="space-y-10">
            {steps.map((step, index) => (
                <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full bg-background border shadow-sm">
                        {step.icon}
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg">{`${index + 1}. ${step.title}`}</h4>
                        <p className="text-muted-foreground mt-1 max-w-sm">{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const HowItWorksSection: React.FC = () => {
    const { t } = useTranslation();
    
    const buyerSteps: Step[] = [
        { icon: <SearchIcon className="h-6 w-6 text-primary" />, title: t('how_buyers_1_title'), description: t('how_buyers_1_desc') },
        { icon: <MessageCircleIcon className="h-6 w-6 text-primary" />, title: t('how_buyers_2_title'), description: t('how_buyers_2_desc') },
        { icon: <ShieldCheckIcon className="h-6 w-6 text-primary" />, title: t('how_buyers_3_title'), description: t('how_buyers_3_desc') }
    ];

    const sellerSteps: Step[] = [
        { icon: <ListPlusIcon className="h-6 w-6 text-primary" />, title: t('how_sellers_1_title'), description: t('how_sellers_1_desc') },
        { icon: <UsersIcon className="h-6 w-6 text-primary" />, title: t('how_sellers_2_title'), description: t('how_sellers_2_desc') },
        { icon: <HandshakeIcon className="h-6 w-6 text-primary" />, title: t('how_sellers_3_title'), description: t('how_sellers_3_desc') }
    ];

    return (
        <section className="py-16 sm:py-24 bg-muted/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        {t('how_it_works')}
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                    <StepColumn title={t('for_buyers')} steps={buyerSteps} />
                    <StepColumn title={t('for_sellers')} steps={sellerSteps} />
                </div>
            </div>
        </section>
    );
};