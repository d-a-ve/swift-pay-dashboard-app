
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { Wallet, Send, History, User, LogOut, Store, Package, Users, Settings } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavigation = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Admin Dashboard', href: '/admin', icon: Users },
          { name: 'Transactions', href: '/transactions', icon: History },
          { name: 'Profile', href: '/profile', icon: User },
        ];
      case 'vendor':
        return [
          { name: 'Vendor Dashboard', href: '/vendor', icon: Store },
          { name: 'Transactions', href: '/transactions', icon: History },
          { name: 'Fund Wallet', href: '/fund-wallet', icon: Wallet },
          { name: 'Profile', href: '/profile', icon: User },
        ];
      case 'client':
      default:
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Wallet },
          { name: 'Send Money', href: '/send-money', icon: Send },
          { name: 'Marketplace', href: '/marketplace', icon: Store },
          { name: 'Transactions', href: '/transactions', icon: History },
          { name: 'Profile', href: '/profile', icon: User },
        ];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SwiftPay</span>
              {user?.role && (
                <span className="text-sm text-gray-500 capitalize">
                  ({user.role})
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              {user?.role === 'vendor' && user?.vendorInfo && (
                <span className="text-xs text-gray-500">
                  {user.vendorInfo.businessName}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
