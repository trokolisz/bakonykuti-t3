'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/hooks/use-toast";
import { Users, UserPlus, Key, Shield } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: string | null;
}

export default function UserManagementClient() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create new admin user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin user created successfully",
        });
        setNewUser({ name: '', email: '', password: '', role: 'admin' });
        fetchUsers(); // Refresh the user list
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  // Change own password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch('/api/admin/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordChange.currentPassword,
          newPassword: passwordChange.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Users
        </TabsTrigger>
        <TabsTrigger value="create" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Create Admin
        </TabsTrigger>
        <TabsTrigger value="password" className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          Change Password
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Users
            </CardTitle>
            <CardDescription>
              Manage existing users and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{user.name}</h3>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.emailVerified && (
                      <p className="text-xs text-green-600">Email verified</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {user.id !== session?.user?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement password reset for other users
                          toast({
                            title: "Feature Coming Soon",
                            description: "Password reset for other users will be available soon",
                          });
                        }}
                      >
                        Reset Password
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="create" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create New Admin User
            </CardTitle>
            <CardDescription>
              Add a new administrator to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  placeholder="Enter password (min 8 characters)"
                  minLength={8}
                />
              </div>
              <Button type="submit" disabled={creating} className="w-full">
                {creating ? 'Creating...' : 'Create Admin User'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="password" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Your Password
            </CardTitle>
            <CardDescription>
              Update your current password for security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordChange.currentPassword}
                  onChange={(e) => setPasswordChange({ ...passwordChange, currentPassword: e.target.value })}
                  required
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordChange.newPassword}
                  onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                  required
                  placeholder="Enter new password (min 8 characters)"
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordChange.confirmPassword}
                  onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                  required
                  placeholder="Confirm new password"
                  minLength={8}
                />
              </div>
              <Button type="submit" disabled={changingPassword} className="w-full">
                {changingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
