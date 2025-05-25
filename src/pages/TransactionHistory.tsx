
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { History, Search } from "lucide-react";

interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  recipient?: string;
  description?: string;
  date: string;
  status: string;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const allTransactions = JSON.parse(localStorage.getItem('swift-pay-transactions') || '[]');
      const userTransactions = allTransactions.filter((t: Transaction) => t.userId === user.id);
      setTransactions(userTransactions);
      setFilteredTransactions(userTransactions);
    }
  }, [user]);

  useEffect(() => {
    let filtered = transactions;

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterType]);

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sent':
        return 'text-red-600';
      case 'received':
        return 'text-green-600';
      case 'utility':
        return 'text-blue-600';
      case 'fund':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionPrefix = (type: string) => {
    return type === 'received' || type === 'fund' ? '+' : '-';
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <History className="h-6 w-6 text-blue-600" />
            <CardTitle>Transaction History</CardTitle>
          </div>
          <CardDescription>
            View and filter your transaction history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="utility">Utilities</SelectItem>
                <SelectItem value="fund">Funding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No transactions found
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">
                      {transaction.type === 'sent' && `To: ${transaction.recipient}`}
                      {transaction.type === 'received' && `From: ${transaction.recipient}`}
                      {transaction.type === 'utility' && 'Utility Payment'}
                      {transaction.type === 'fund' && 'Wallet Funding'}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()} at{' '}
                      {new Date(transaction.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {getTransactionPrefix(transaction.type)}${transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TransactionHistory;
