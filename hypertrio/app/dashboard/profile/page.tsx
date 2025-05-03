'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/button';
import { Input } from '@/app/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/ui/card';
import { useToast } from '@/app/ui/use-toast';

interface UserProfile {
  name: string;
  email: string;
  calorie_goal: number;
  workout_goal: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!session?.user?.id) {
          throw new Error('No user session found');
        }
        const response = await fetch(`http://localhost:8000/auth/user/${session.user.id}`);
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || 'Failed to fetch profile');
        }
        const data = await response.json();
        console.log('Fetched user data:', data);
        setProfile(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive',
        });
      }
    };

    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !session?.user?.id) return;

    try {
      const response = await fetch(`http://localhost:8000/auth/user/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          calorie_goal: formData.calorie_goal,
          workout_goal: formData.workout_goal
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update profile');
      }

      const updatedData = await response.json();
      console.log('Updated user data:', updatedData);
      
      setProfile(updatedData);
      setFormData(updatedData);
      setIsEditing(false);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account settings and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                name="name"
                value={formData?.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                type="email"
                value={formData?.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Daily Calorie Goal</label>
              <Input
                name="calorie_goal"
                type="number"
                value={formData?.calorie_goal || 2000}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Weekly Workout Goal</label>
              <Input
                name="workout_goal"
                type="number"
                value={formData?.workout_goal || 5}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => {
                setFormData(profile);
                setIsEditing(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}