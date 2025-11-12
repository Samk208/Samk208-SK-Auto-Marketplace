
import React, { useState } from 'react';
import type { User, ToastMessage } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';

interface ProfileTabProps {
  user: User;
  onUpdateUser: (user: User) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, onUpdateUser, showToast }) => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone || '');
  const [location, setLocation] = useState(user.location || '');
  const [description, setDescription] = useState(user.businessDescription || '');
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      fullName,
      phone,
      location,
      businessDescription: description,
      avatarUrl: avatar,
    };
    onUpdateUser(updatedUser);
    showToast(t('profile_updated'));
  };
  
  const handlePictureUpload = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result as string);
        }
        reader.readAsDataURL(file);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('seller_profile')}</CardTitle>
        <CardDescription>{t('update_your_profile')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="flex items-center gap-6">
            <img src={avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${fullName}`} alt={fullName} className="h-24 w-24 rounded-full object-cover" />
            <div>
                 <Button type="button" variant="secondary" outline onClick={handlePictureUpload}>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    {t('upload_picture')}
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('fullname_label')}</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone_number')}</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="location">{t('location')}</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Nairobi, Kenya" />
            </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('business_description')}</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell buyers a little about your business..." />
          </div>
          <div className="flex justify-end items-center gap-4">
            <Button type="submit">{t('update_profile')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
