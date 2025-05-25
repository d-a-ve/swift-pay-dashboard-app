
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DashboardLayout from '@/components/DashboardLayout';
import { Send, Wallet, History } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Send Money',
      description: 'Transfer money to friends and family',
      icon: Send,
      href: '/send-money',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Fund Wallet',
      description: 'Add money to your wallet',
      icon: Wallet,
      href: '/fund-wallet',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Buy Utilities',
      description: 'Pay for airtime and electricity',
      icon: History,
      href: '/utilities',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const recentTransactions = [
    { id: 1, type: 'Received', amount: 250, from: 'John Doe', date: '2024-01-15' },
    { id: 2, type: 'Sent', amount: -100, to: 'Jane Smith', date: '2024-01-14' },
    { id: 3, type: 'Utility', amount: -50, description: 'Electricity Bill', date: '2024-01-13' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Wallet Balance</CardTitle>
            <CardDescription className="text-blue-100">
              Available funds in your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              ${user?.balance?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </div>
            <Link to="/transactions">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {transaction.type === 'Received' && `From: ${transaction.from}`}
                      {transaction.type === 'Sent' && `To: ${transaction.to}`}
                      {transaction.type === 'Utility' && transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div className={`font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
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

export default Dashboard;
