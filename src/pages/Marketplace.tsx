
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Store, Search, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: string;
}

const Marketplace = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load products and vendors
    const allProducts = JSON.parse(localStorage.getItem('swift-pay-products') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('swift-pay-users') || '[]');
    
    const activeProducts = allProducts.filter((p: Product) => p.isActive);
    const verifiedVendors = allUsers.filter((u: any) => u.role === 'vendor' && u.vendorInfo?.isVerified);
    
    setProducts(activeProducts);
    setVendors(verifiedVendors);
    setFilteredProducts(activeProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterCategory]);

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.vendorInfo?.businessName || 'Unknown Vendor';
  };

  const handlePurchase = (product: Product) => {
    if (!user) return;

    if (product.price > user.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this purchase.",
        variant: "destructive",
      });
      return;
    }

    // Update buyer's balance
    const newBalance = user.balance - product.price;
    updateUser({ balance: newBalance });

    // Update vendor's balance
    const allUsers = JSON.parse(localStorage.getItem('swift-pay-users') || '[]');
    const updatedUsers = allUsers.map((u: any) => 
      u.id === product.vendorId 
        ? { ...u, balance: (u.balance || 0) + product.price }
        : u
    );
    localStorage.setItem('swift-pay-users', JSON.stringify(updatedUsers));

    // Record transactions
    const transactions = JSON.parse(localStorage.getItem('swift-pay-transactions') || '[]');
    
    // Buyer transaction
    const buyerTransaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'purchase',
      amount: product.price,
      recipient: getVendorName(product.vendorId),
      description: `Purchase: ${product.name}`,
      date: new Date().toISOString(),
      status: 'completed'
    };

    // Vendor transaction
    const vendorTransaction = {
      id: (Date.now() + 1).toString(),
      userId: product.vendorId,
      type: 'sale',
      amount: product.price,
      recipient: user.name,
      description: `Sale: ${product.name}`,
      date: new Date().toISOString(),
      status: 'completed'
    };

    transactions.push(buyerTransaction, vendorTransaction);
    localStorage.setItem('swift-pay-transactions', JSON.stringify(transactions));

    toast({
      title: "Purchase successful!",
      description: `You have purchased ${product.name} for $${product.price}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Store className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Marketplace</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="food">Food & Beverage</SelectItem>
              <SelectItem value="services">Professional Services</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      by {getVendorName(product.vendorId)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    ${product.price}
                  </div>
                  <Button 
                    onClick={() => handlePurchase(product)}
                    disabled={!user || product.price > user.balance}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
                {user && product.price > user.balance && (
                  <p className="text-sm text-red-500 mt-2">Insufficient balance</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
