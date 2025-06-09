
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, DollarSign, Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    // Load users and transactions
    const allUsers = JSON.parse(localStorage.getItem('swift-pay-users') || '[]');
    const allTransactions = JSON.parse(localStorage.getItem('swift-pay-transactions') || '[]');
    setUsers(allUsers);
    setTransactions(allTransactions);
  }, []);

  const handleVerifyVendor = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, vendorInfo: { ...u.vendorInfo, isVerified: true } }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('swift-pay-users', JSON.stringify(updatedUsers));
  };

  const handleSuspendUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, suspended: !u.suspended }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('swift-pay-users', JSON.stringify(updatedUsers));
  };

  const stats = {
    totalUsers: users.length,
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    pendingVendors: users.filter(u => u.role === 'vendor' && u.vendorInfo && !u.vendorInfo.isVerified).length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Badge variant="secondary">Administrator</Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalVolume.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVendors}</div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and vendor verifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{u.name}</p>
                      <Badge variant={u.role === 'admin' ? 'default' : u.role === 'vendor' ? 'secondary' : 'outline'}>
                        {u.role}
                      </Badge>
                      {u.suspended && <Badge variant="destructive">Suspended</Badge>}
                      {u.role === 'vendor' && u.vendorInfo?.isVerified && (
                        <Badge variant="default" className="bg-green-500">Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{u.email}</p>
                    {u.role === 'vendor' && u.vendorInfo && (
                      <p className="text-sm text-gray-500">{u.vendorInfo.businessName} - {u.vendorInfo.category}</p>
                    )}
                    <p className="text-sm text-gray-500">Balance: ${u.balance?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="flex space-x-2">
                    {u.role === 'vendor' && u.vendorInfo && !u.vendorInfo.isVerified && (
                      <Button
                        size="sm"
                        onClick={() => handleVerifyVendor(u.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    {u.id !== user?.id && (
                      <Button
                        size="sm"
                        variant={u.suspended ? "outline" : "destructive"}
                        onClick={() => handleSuspendUser(u.id)}
                      >
                        {u.suspended ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Unsuspend
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Suspend
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Transactions</CardTitle>
            <CardDescription>Latest transactions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(-10).reverse().map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {transaction.type === 'sent' && `Transfer: ${transaction.recipient}`}
                      {transaction.type === 'received' && `Received from: ${transaction.recipient}`}
                      {transaction.type === 'utility' && 'Utility Payment'}
                      {transaction.type === 'fund' && 'Wallet Funding'}
                    </p>
                    <p className="text-sm text-gray-500">
                      User ID: {transaction.userId} | {new Date(transaction.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.type === 'received' || transaction.type === 'fund' 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${transaction.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
