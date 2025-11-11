
import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Button } from '../ui/Button';
import type { Car, Page, ToastMessage } from '../../types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/AlertDialog';
import { Badge } from '../ui/Badge';

interface MyListingsTabProps {
    listings: Car[];
    onNavigate: (page: Page, context?: any) => void;
    onDeleteCar: (carId: string) => void;
    showToast: (message: string, type?: ToastMessage['type']) => void;
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);


export const MyListingsTab: React.FC<MyListingsTabProps> = ({ listings, onNavigate, onDeleteCar }) => {
    const { t } = useTranslation();
    const [carToDelete, setCarToDelete] = useState<Car | null>(null);

    const getStatusBadge = (status: Car['status']) => {
        switch(status) {
            case 'Active': return <Badge variant="success">{t('active')}</Badge>;
            case 'Sold': return <Badge variant="secondary">{t('sold')}</Badge>;
            case 'Pending': return <Badge variant="warning">{t('pending')}</Badge>;
            default: return null;
        }
    }

    const handleDeleteConfirm = () => {
        if (carToDelete) {
            onDeleteCar(carToDelete.id);
            setCarToDelete(null);
        }
    }

    return (
        <>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('my_listings')}</CardTitle>
                <Button onClick={() => onNavigate('list-car')}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {t('list_new_car')}
                </Button>
            </CardHeader>
            <CardContent>
                {listings.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Car</TableHead>
                                <TableHead>{t('status')}</TableHead>
                                <TableHead className="hidden md:table-cell">{t('views')}</TableHead>
                                <TableHead className="text-right">{t('actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listings.map(car => (
                                <TableRow key={car.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <img src={car.imageUrls[0]} alt={car.model} className="w-16 h-12 object-cover rounded-md" />
                                            <div>
                                                <div className="font-medium">{car.make} {car.model}</div>
                                                <div className="text-sm text-muted-foreground">{car.currency} {car.price.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(car.status)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {Math.floor(Math.random() * 2000 + 500)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => onNavigate('list-car', { carId: car.id })}>
                                                <EditIcon className="h-4 w-4" />
                                                <span className="sr-only">{t('edit')}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setCarToDelete(car)}>
                                                <TrashIcon className="h-4 w-4" />
                                                <span className="sr-only">{t('delete')}</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg font-medium">You haven't listed any cars yet.</p>
                        <p className="text-muted-foreground mt-2">Click the button below to get started and sell your first car!</p>
                        <Button className="mt-4" onClick={() => onNavigate('list-car')}>
                            {t('list_new_car')}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>

        <AlertDialog open={!!carToDelete} onOpenChange={(open) => !open && setCarToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('delete_confirmation_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('delete_confirmation_text')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setCarToDelete(null)}>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} variant="destructive">{t('delete_listing')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}
