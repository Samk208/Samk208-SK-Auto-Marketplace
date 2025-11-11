'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import {
  useSellerListings,
  useDeleteListing,
  useToggleListingStatus,
} from '@/hooks/use-seller-listings';
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  TrendingUp,
  MessageSquare,
  MoreVertical,
} from 'lucide-react';
import type { Tables } from '@/types/database.types';

type Car = Tables<'cars'>;

interface ListingsTableProps {
  onCreateNew?: () => void;
}

const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-16 w-24 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
};

const EmptyState: React.FC<{ onCreateNew?: () => void }> = ({ onCreateNew }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-muted flex items-center justify-center">
        <Plus className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        You haven't created any car listings yet. Start by creating your first listing to reach
        potential buyers.
      </p>
      <Button onClick={onCreateNew}>
        <Plus className="h-4 w-4 mr-2" />
        Create First Listing
      </Button>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
    published: 'success',
    draft: 'secondary',
    sold: 'default',
    archived: 'warning',
  };

  return (
    <Badge variant={variants[status] || 'default'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const ListingsTable: React.FC<ListingsTableProps> = ({ onCreateNew }) => {
  const router = useRouter();
  const { data: listings, isLoading, isError, error } = useSellerListings();
  const deleteMutation = useDeleteListing();
  const toggleStatusMutation = useToggleListingStatus();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const handleDelete = (car: Car) => {
    setSelectedCar(car);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCar) return;

    try {
      await deleteMutation.mutateAsync(selectedCar.id);
      setDeleteDialogOpen(false);
      setSelectedCar(null);
    } catch (error) {
      console.error('Failed to delete listing:', error);
      // Error will be shown via toast in parent component
    }
  };

  const handleToggleStatus = async (car: Car) => {
    const newStatus = car.status === 'published' ? 'draft' : 'published';
    try {
      await toggleStatusMutation.mutateAsync({
        carId: car.id,
        newStatus,
      });
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleEdit = (carId: string) => {
    // Navigate to edit page (to be implemented)
    router.push(`/seller-dashboard/listings/${carId}/edit`);
  };

  const handleViewAnalytics = (carId: string) => {
    // Navigate to analytics page (to be implemented)
    router.push(`/seller-dashboard/listings/${carId}/analytics`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Listings</CardTitle>
          <CardDescription>Manage your car listings</CardDescription>
        </CardHeader>
        <CardContent>
          <TableSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error Loading Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error?.message || 'Failed to load listings'}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState onCreateNew={onCreateNew} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>My Listings</CardTitle>
            <CardDescription>
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'} total
            </CardDescription>
          </div>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Button>
        </CardHeader>
        <CardContent>
          {/* Mobile view - Card list */}
          <div className="block md:hidden space-y-4">
            {listings.map((car) => (
              <Card key={car.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={car.images[0] || '/placeholder-car.jpg'}
                      alt={`${car.make} ${car.model}`}
                      className="w-24 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {car.year} {car.make} {car.model}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        ${car.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={car.status} />
                        <span className="text-xs text-muted-foreground">
                          {car.view_count} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(car.id)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleToggleStatus(car)}
                      disabled={toggleStatusMutation.isPending}
                    >
                      {car.status === 'published' ? (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Publish
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(car)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop view - Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Views</TableHead>
                  <TableHead className="text-center">Inquiries</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={car.images[0] || '/placeholder-car.jpg'}
                          alt={`${car.make} ${car.model}`}
                          className="w-16 h-12 object-cover rounded-md"
                        />
                        <div>
                          <div className="font-medium">
                            {car.year} {car.make} {car.model}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {car.mileage.toLocaleString()} km
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={car.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${car.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span>{car.view_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquare className="h-3 w-3 text-muted-foreground" />
                        <span>{car.inquiry_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(car.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(car)}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {car.status === 'published' ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {car.status === 'published' ? 'Unpublish' : 'Publish'}
                          </span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewAnalytics(car.id)}
                        >
                          <TrendingUp className="h-4 w-4" />
                          <span className="sr-only">Analytics</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(car)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedCar?.year} {selectedCar?.make}{' '}
              {selectedCar?.model}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedCar(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
