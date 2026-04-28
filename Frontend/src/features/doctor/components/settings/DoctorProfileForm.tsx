'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { updateUserAction, updateDoctorProfileAction } from '@/src/features/settings/actions/settings-actions';

export function DoctorProfileForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    name: initialData?.user?.name || '',
    phone: initialData?.user?.phone || '',
    specialty: initialData?.specialty || '',
    location: initialData?.location || '',
    bio: initialData?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // 1. Update User fields (name, phone)
      const userRes = await updateUserAction({ 
        name: formData.name, 
        phone: formData.phone 
      });

      // 2. Update Doctor fields (specialty, bio, location)
      const doctorRes = await updateDoctorProfileAction({
        specialty: formData.specialty,
        bio: formData.bio,
        location: formData.location,
      });

      if (userRes.success && doctorRes.success) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMessage({ text: userRes.error || doctorRes.error || 'Failed to update', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Profile</CardTitle>
        <CardDescription>
          This information will be displayed publicly on the booking page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Dr. John Doe"
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+1 (555) 000-0000" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Input 
                name="specialty" 
                value={formData.specialty} 
                onChange={handleChange} 
                placeholder="Cardiology" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                placeholder="Floor 3, Room 302" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Biography</label>
            <Textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              placeholder="Tell patients a little about your experience..."
              className="min-h-[120px]"
            />
          </div>

          {message.text && (
            <p className={`text-sm font-semibold ${message.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
              {message.text}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
