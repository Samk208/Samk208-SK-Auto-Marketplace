
import React, { useState } from 'react';
import type { Car, Page, User, ToastMessage } from '@/types/types';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CarCard } from '../car/CarCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Label } from '../ui/Label';


interface CarDetailPageProps {
  car: Car;
  seller: User;
  otherListings: Car[];
  sellers: User[];
  onNavigate: (page: Page, context?: any) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  onOpenContact: (sellerEmail: string) => void;
  currentUser: User | null;
}

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-border/50">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-right">{value}</span>
    </div>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <path d="m9 11 3 3L22 4"/>
    </svg>
);

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

// Placeholder for cars without images (TODO: Add actual placeholder to /public)
const PLACEHOLDER_CAR_IMAGE = 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';

export const CarDetailPage: React.FC<CarDetailPageProps> = ({ car, seller, otherListings, sellers, onNavigate, showToast, onOpenContact, currentUser }) => {
    const { t } = useTranslation();
    const safeImages = car.images && Array.isArray(car.images) ? car.images : [];
    const [mainImage, setMainImage] = useState(safeImages[0] || PLACEHOLDER_CAR_IMAGE);
    const [destinationPort, setDestinationPort] = useState('');
    const [shippingEstimate, setShippingEstimate] = useState<{ shipping: number; duties: number; total: number } | null>(null);
    
    const isVerified = seller.phone && seller.location;

    const africanPorts = [
        { name: 'Lagos, Nigeria', countryCode: 'NG', baseCost: 1800, dutyRate: 0.25 },
        { name: 'Mombasa, Kenya', countryCode: 'KE', baseCost: 2200, dutyRate: 0.20 },
        { name: 'Durban, South Africa', countryCode: 'ZA', baseCost: 2500, dutyRate: 0.18 },
        { name: 'Tema, Ghana', countryCode: 'GH', baseCost: 1900, dutyRate: 0.22 },
        { name: 'Dakar, Senegal', countryCode: 'SN', baseCost: 2100, dutyRate: 0.20 },
    ];

    const handleCalculateShipping = () => {
        const port = africanPorts.find(p => p.name === destinationPort);
        if (!port || !car) return;
        const shipping = port.baseCost;
        const duties = car.price * port.dutyRate;
        setShippingEstimate({ shipping, duties, total: shipping + duties });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Image Gallery & Main Info (Left/Top) */}
                <div className="lg:col-span-2">
                    <div className="mb-4">
                        {/* TODO: Migrate to next/Image with remotePatterns for Supabase CDN and external URLs */}
                        <img
                            src={mainImage}
                            alt={mainImage !== PLACEHOLDER_CAR_IMAGE ? `${car.make} ${car.model}` : 'No image available'}
                            className="w-full h-auto object-cover rounded-lg shadow-lg bg-muted"
                            onError={(e) => { e.currentTarget.src = PLACEHOLDER_CAR_IMAGE; }}
                        />
                    </div>
                    {safeImages.length > 1 && (
                        <div className="flex gap-2">
                            {safeImages.map((url, index) => (
                                <img
                                    key={index}
                                    src={url || PLACEHOLDER_CAR_IMAGE}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-24 h-16 object-cover rounded-md cursor-pointer border-2 bg-muted ${mainImage === url ? 'border-primary' : 'border-transparent'}`}
                                    onClick={() => setMainImage(url || PLACEHOLDER_CAR_IMAGE)}
                                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_CAR_IMAGE; }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-8">
                        <h1 className="text-3xl lg:text-4xl font-bold">{car.make} {car.model}</h1>
                        <p className="text-xl text-muted-foreground mt-1">{car.year}</p>
                    </div>

                    <div className="mt-8 prose dark:prose-invert max-w-none">
                        <h3 className="font-semibold">{t('form_description')}</h3>
                        <p>{car.description}</p>
                    </div>

                </div>

                {/* Price, Seller & Specs (Right/Bottom) */}
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-4xl font-extrabold mb-4">{car.currency} {car.price.toLocaleString()}</p>
                            <Button size="lg" className="w-full" onClick={() => onOpenContact(seller.email)}>
                                {t('contact_seller')}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Seller Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <img src={seller.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${seller.fullName}`} alt={seller.fullName} className="w-16 h-16 rounded-full" />
                                <div>
                                    <p className="font-bold text-lg">{seller.fullName}</p>
                                    {isVerified && (
                                        <div className="inline-flex items-center rounded-full text-xs font-semibold text-green-700 dark:text-green-300">
                                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                                            {t('verified_seller')}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {seller.businessDescription && (
                                <p className="text-sm text-muted-foreground mt-4 italic">"{seller.businessDescription}"</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>{t('shipping_estimator_title')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="destination-port" className="text-sm">{t('destination_port')}</Label>
                                <Select value={destinationPort} onValueChange={setDestinationPort}>
                                    <SelectTrigger id="destination-port"><SelectValue placeholder={t('select_destination')} /></SelectTrigger>
                                    <SelectContent>
                                        {africanPorts.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleCalculateShipping} disabled={!destinationPort} className="w-full">{t('calculate')}</Button>
                            {shippingEstimate && (
                                <div className="space-y-2 pt-4 border-t">
                                    <InfoItem label={t('estimated_shipping')} value={`${car.currency} ${shippingEstimate.shipping.toLocaleString()}`} />
                                    <InfoItem label={t('estimated_duties')} value={`${car.currency} ${shippingEstimate.duties.toLocaleString()}`} />
                                    <div className="flex justify-between py-3 font-bold text-lg">
                                        <span>{t('total_estimate')}</span>
                                        <span>{`${car.currency} ${shippingEstimate.total.toLocaleString()}`}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-2">{t('estimate_disclaimer')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    
                    <Card>
                         <CardHeader>
                            <CardTitle>{t('form_specifications')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InfoItem label={t('form_make')} value={car.make} />
                            <InfoItem label={t('form_model')} value={car.model} />
                            <InfoItem label={t('form_year')} value={String(car.year)} />
                            <InfoItem label={t('form_engine')} value={car.specifications?.engine ?? 'N/A'} />
                            <InfoItem label={t('form_mileage')} value={String(car.specifications?.mileage ?? 'N/A')} />
                            <InfoItem label={t('form_transmission')} value={car.specifications?.transmission ?? 'N/A'} />
                            <InfoItem label={t('form_fuel_type')} value={car.specifications?.fuelType ?? 'N/A'} />
                            <InfoItem label={t('form_body_type')} value={car.specifications?.bodyType ?? 'N/A'} />
                        </CardContent>
                    </Card>
                </div>
            </div>

             {/* Reviews Section */}
             <div className="mt-16">
                 <h2 className="text-2xl font-bold mb-6">{t('reviews')}</h2>
                 <Card>
                    <CardContent className="p-10 text-center text-muted-foreground">
                        <div className="flex justify-center mb-4">
                            <StarIcon className="w-6 h-6 text-yellow-400" />
                            <StarIcon className="w-6 h-6 text-yellow-400" />
                            <StarIcon className="w-6 h-6 text-yellow-400" />
                            <StarIcon className="w-6 h-6 text-yellow-400" />
                            <StarIcon className="w-6 h-6 text-yellow-400" />
                        </div>
                        <p className="font-semibold text-foreground">{t('rating_system_launching_soon')}</p>
                        <p className="mt-1 text-sm">{t('reviews_coming_soon')}</p>
                    </CardContent>
                 </Card>
             </div>

            {/* Other listings from seller */}
            {otherListings.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">{t('more_from_this_seller')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {otherListings.map(otherCar => (
                            <CarCard key={otherCar.id} car={otherCar} sellers={sellers} onNavigate={onNavigate} showToast={showToast} currentUser={currentUser} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
