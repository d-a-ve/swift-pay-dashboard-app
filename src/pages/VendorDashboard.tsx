
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Store, Package, DollarSign, TrendingUp, Plus, Edit, Trash2 } from "lucide-react";

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

const VendorDashboard = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    if (user) {
      // Load vendor's products
      const allProducts = JSON.parse(localStorage.getItem('swift-pay-products') || '[]');
      const vendorProducts = allProducts.filter((p: Product) => p.vendorId === user.id);
      setProducts(vendorProducts);

      // Load vendor's transactions
      const allTransactions = JSON.parse(localStorage.getItem('swift-pay-transactions') || '[]');
      const vendorTransactions = allTransactions.filter((t: any) => t.userId === user.id);
      setTransactions(vendorTransactions);
    }
  }, [user]);

  const handleAddProduct = () => {
    if (!user || !productForm.name || !productForm.price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      vendorId: user.id,
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const allProducts = JSON.parse(localStorage.getItem('swift-pay-products') || '[]');
    allProducts.push(newProduct);
    localStorage.setItem('swift-pay-products', JSON.stringify(allProducts));
    
    setProducts([...products, newProduct]);
    setProductForm({ name: '', description: '', price: '', category: '' });
    setShowAddProduct(false);

    toast({
      title: "Product added!",
      description: "Your product has been added successfully.",
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !productForm.name || !productForm.price) return;

    const updatedProduct = {
      ...editingProduct,
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category
    };

    const allProducts = JSON.parse(localStorage.getItem('swift-pay-products') || '[]');
    const updatedProducts = allProducts.map((p: Product) => 
      p.id === editingProduct.id ? updatedProduct : p
    );
    localStorage.setItem('swift-pay-products', JSON.stringify(updatedProducts));

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', category: '' });

    toast({
      title: "Product updated!",
      description: "Your product has been updated successfully.",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const allProducts = JSON.parse(localStorage.getItem('swift-pay-products') || '[]');
    const updatedProducts = allProducts.filter((p: Product) => p.id !== productId);
    localStorage.setItem('swift-pay-products', JSON.stringify(updatedProducts));

    setProducts(products.filter(p => p.id !== productId));

    toast({
      title: "Product deleted!",
      description: "Your product has been removed successfully.",
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category
    });
    setShowAddProduct(true);
  };

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isActive).length,
    totalSales: transactions.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0),
    totalRevenue: transactions.filter(t => t.type === 'received').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-gray-600">{user?.vendorInfo?.businessName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={user?.vendorInfo?.isVerified ? "default" : "secondary"} className={user?.vendorInfo?.isVerified ? "bg-green-500" : ""}>
              {user?.vendorInfo?.isVerified ? "Verified" : "Pending Verification"}
            </Badge>
          </div>
        </div>

        {!user?.vendorInfo?.isVerified && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-yellow-600" />
                <p className="text-yellow-800">
                  Your vendor account is pending verification. Some features may be limited until verification is complete.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Product Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your products and services</CardDescription>
            </div>
            <Button onClick={() => {
              setShowAddProduct(true);
              setEditingProduct(null);
              setProductForm({ name: '', description: '', price: '', category: '' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            {showAddProduct && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productPrice">Price ($)</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Category</Label>
                    <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="services">Professional Services</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Enter product description"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                    setProductForm({ name: '', description: '', price: '', category: '' });
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{product.name}</p>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-sm text-gray-500">
                      ${product.price} • {product.category}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No products yet. Add your first product to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
