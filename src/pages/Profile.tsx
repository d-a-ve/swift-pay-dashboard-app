
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Lock, Key } from "lucide-react";

const Profile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you'd verify the current password first
      const users = JSON.parse(localStorage.getItem('swift-pay-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user?.id);
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('swift-pay-users', JSON.stringify(users));
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure your PINs match.",
        variant: "destructive",
      });
      return;
    }

    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save PIN (in a real app, this would be hashed)
      const users = JSON.parse(localStorage.getItem('swift-pay-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user?.id);
      
      if (userIndex !== -1) {
        users[userIndex].pin = pin;
        localStorage.setItem('swift-pay-users', JSON.stringify(users));
      }

      toast({
        title: "PIN set successfully",
        description: "Your transaction PIN has been configured.",
      });

      setPin('');
      setConfirmPin('');
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-blue-600" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Your account details and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <p className="text-lg font-medium">{user?.name}</p>
              </div>
              <div>
                <Label>Email Address</Label>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
              <div>
                <Label>Account ID</Label>
                <p className="text-lg font-medium text-gray-600">{user?.id}</p>
              </div>
              <div>
                <Label>Wallet Balance</Label>
                <p className="text-lg font-bold text-green-600">
                  ${user?.balance?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="password">Change Password</TabsTrigger>
                <TabsTrigger value="pin">Set PIN</TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium">Change Password</h3>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="pin" className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Key className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium">Set Transaction PIN</h3>
                </div>
                <form onSubmit={handlePinSetup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pin">4-Digit PIN</Label>
                    <Input
                      id="pin"
                      type="password"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      placeholder="Enter 4-digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPin">Confirm PIN</Label>
                    <Input
                      id="confirmPin"
                      type="password"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      placeholder="Confirm 4-digit PIN"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Setting up..." : "Set PIN"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
