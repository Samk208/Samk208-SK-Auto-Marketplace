'use client';

import React, { useMemo, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Car, ToastMessage } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import Image from 'next/image';

interface ListCarPageProps {
  carToEdit?: Car;
  onSubmit: (car: Car) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
}

type CarSpecifications = {
  engine: string;
  mileage: string;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  bodyType: 'Sedan' | 'SUV' | 'Truck' | 'Hatchback' | 'Coupe';
};

type EditableCar = Omit<Car, 'id' | 'dealer_id' | 'specifications'> & {
  specifications: CarSpecifications;
};

const DEFAULT_SPECIFICATIONS: CarSpecifications = {
  engine: '',
  mileage: '',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  bodyType: 'Sedan',
};

const MAX_IMAGES = 10;

const createEmptyCar = (): EditableCar => ({
  make: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  currency: 'USD',
  location: { city: '', country: '' },
  imageUrls: [''],
  specifications: { ...DEFAULT_SPECIFICATIONS },
  description: '',
  status: 'Active',
});

const normalizeSpecifications = (specs: Car['specifications']): CarSpecifications => {
  if (!specs || typeof specs !== 'object') {
    return { ...DEFAULT_SPECIFICATIONS };
  }
  const candidate = specs as Record<string, unknown>;
  return {
    engine: String(candidate.engine ?? DEFAULT_SPECIFICATIONS.engine),
    mileage: String(candidate.mileage ?? DEFAULT_SPECIFICATIONS.mileage),
    transmission:
      (candidate.transmission as CarSpecifications['transmission']) ??
      DEFAULT_SPECIFICATIONS.transmission,
    fuelType:
      (candidate.fuelType as CarSpecifications['fuelType']) ??
      DEFAULT_SPECIFICATIONS.fuelType,
    bodyType:
      (candidate.bodyType as CarSpecifications['bodyType']) ??
      DEFAULT_SPECIFICATIONS.bodyType,
  };
};

const toEditableCar = (car?: Car): EditableCar => {
  if (!car) {
    return createEmptyCar();
  }
  const { id: _id, dealer_id: _dealerId, ...rest } = car;
  void _id;
  void _dealerId;
  return {
    ...rest,
    location: { ...rest.location },
    imageUrls: [...rest.imageUrls],
    specifications: normalizeSpecifications(rest.specifications),
  };
};

const cloneEditableCar = (car: EditableCar): EditableCar => ({
  ...car,
  location: { ...car.location },
  imageUrls: [...car.imageUrls],
  specifications: { ...car.specifications },
});

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9a6 6 0 0 0-9-9Z" />
    <path d="M5 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
    <path d="M19 15a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
  </svg>
);

const UploadCloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

interface AiWriterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
}

const AiWriterModal: React.FC<AiWriterModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={() => onOpenChange(false)}>
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

interface ListCarFormProps {
  initialCar: EditableCar;
  carToEdit?: Car;
  onSubmit: (car: Car) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
}

const ListCarForm: React.FC<ListCarFormProps> = ({ initialCar, carToEdit, onSubmit, showToast }) => {
  const { t } = useTranslation();
  const [car, setCar] = useState<EditableCar>(() => cloneEditableCar(initialCar));
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCar((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleSelectChange = (name: keyof EditableCar, value: string) => {
    setCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecSelectChange = <K extends keyof EditableCar['specifications']>(
    name: K,
    value: EditableCar['specifications'][K],
  ) => {
    setCar((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCar((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setCar((prev) => {
      const next = [...prev.imageUrls];
      next[index] = value;
      return { ...prev, imageUrls: next };
    });
  };

  const addImageUrl = () => {
    setCar((prev) => {
      if (prev.imageUrls.length >= MAX_IMAGES) {
        showToast('Maximum of 10 image URLs allowed.', 'info');
        return prev;
      }
      return { ...prev, imageUrls: [...prev.imageUrls, ''] };
    });
  };

  const removeImageUrl = (index: number) => {
    setCar((prev) => {
      if (prev.imageUrls.length <= 1) {
        return prev;
      }
      return {
        ...prev,
        imageUrls: prev.imageUrls.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Car = {
      ...car,
      id: carToEdit?.id ?? crypto.randomUUID(),
      dealer_id: carToEdit?.dealer_id ?? '',
    };
    onSubmit(payload);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        {carToEdit ? t('form_update_listing') : t('list_a_car')}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>{t('form_basic_info')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="make">{t('form_make')}</Label>
                <Input id="make" name="make" value={car.make} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">{t('form_model')}</Label>
                <Input id="model" name="model" value={car.model} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="year">{t('form_year')}</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={car.year}
                  onChange={handleChange}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t('form_price')}</Label>
                <Input id="price" name="price" type="number" value={car.price} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t('form_currency')}</Label>
                <Select value={car.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="KRW">KRW</SelectItem>
                    <SelectItem value="GHS">GHS</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('form_details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">{t('form_description')}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAiModalOpen(true)}>
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  {t('generate_with_ai')}
                </Button>
              </div>
              <Textarea
                id="description"
                name="description"
                value={car.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">{t('form_location_country')}</Label>
                <Input
                  id="country"
                  name="country"
                  value={car.location.country}
                  onChange={handleLocationChange}
                  placeholder="e.g., KE"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t('form_location_city')}</Label>
                <Input
                  id="city"
                  name="city"
                  value={car.location.city}
                  onChange={handleLocationChange}
                  placeholder="e.g., Nairobi"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t('form_status')}</Label>
                <Select value={car.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">{t('active')}</SelectItem>
                    <SelectItem value="Pending">{t('pending')}</SelectItem>
                    <SelectItem value="Sold">{t('sold')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('form_specifications')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="engine">{t('form_engine')}</Label>
              <Input id="engine" name="engine" value={car.specifications.engine} onChange={handleSpecChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">{t('form_transmission')}</Label>
              <Select
                value={car.specifications.transmission}
                onValueChange={(value) =>
                  handleSpecSelectChange('transmission', value as EditableCar['specifications']['transmission'])
                }
              >
                <SelectTrigger id="transmission">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">{t('form_mileage')}</Label>
              <Input id="mileage" name="mileage" value={car.specifications.mileage} onChange={handleSpecChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelType">{t('form_fuel_type')}</Label>
              <Select
                value={car.specifications.fuelType}
                onValueChange={(value) =>
                  handleSpecSelectChange('fuelType', value as EditableCar['specifications']['fuelType'])
                }
              >
                <SelectTrigger id="fuelType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyType">{t('form_body_type')}</Label>
              <Select
                value={car.specifications.bodyType}
                onValueChange={(value) =>
                  handleSpecSelectChange('bodyType', value as EditableCar['specifications']['bodyType'])
                }
              >
                <SelectTrigger id="bodyType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('form_images')}</CardTitle>
            <CardDescription>
              Add up to 10 image URLs. The first image will be the main one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 border-2 border-dashed rounded-lg text-center bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60">
              <UploadCloudIcon className="mx-auto h-12 w-12" />
              <p className="mt-2 font-semibold">{t('direct_image_upload_soon')}</p>
              <p className="text-sm">For now, please add images via URL below.</p>
            </div>
            {car.imageUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder={t('form_image_url')}
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImageUrl(index)}
                  disabled={car.imageUrls.length <= 1}
                  aria-label="Remove image"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {car.imageUrls.length < MAX_IMAGES && (
              <Button type="button" variant="secondary" onClick={addImageUrl}>
                {t('form_add_image')}
              </Button>
            )}
            {car.imageUrls[0] && (
              <div className="relative mt-4 w-full max-w-sm overflow-hidden rounded-lg aspect-[4/3]">
                <Image
                  src={car.imageUrls[0]}
                  alt="Main image preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 320px"
                  unoptimized
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            {carToEdit ? t('form_update_listing') : t('form_submit_listing')}
          </Button>
        </div>
      </form>
      <AiWriterModal
        open={isAiModalOpen}
        onOpenChange={setIsAiModalOpen}
        title={t('ai_writer_modal_title')}
        description={t('ai_writer_modal_desc')}
        confirmLabel="OK"
      />
    </div>
  );
};

export const ListCarPage: React.FC<ListCarPageProps> = ({ carToEdit, onSubmit, showToast }) => {
  const initialCar = useMemo(() => toEditableCar(carToEdit), [carToEdit]);
  const formKey = carToEdit?.id ?? 'new';
  return (
    <ListCarForm
      key={formKey}
      initialCar={initialCar}
      carToEdit={carToEdit}
      onSubmit={onSubmit}
      showToast={showToast}
    />
  );
};
