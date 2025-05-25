
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Wallet } from "lucide-react";

const FundWallet = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    if (!user) return;

    if (amountNum <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update user balance
      const newBalance = user.balance + amountNum;
      updateUser({ balance: newBalance });

      // Save transaction
      const transactions = JSON.parse(localStorage.getItem('swift-pay-transactions') || '[]');
      const newTransaction = {
        id: Date.now().toString(),
        userId: user.id,
        type: 'fund',
        amount: amountNum,
        description: `Wallet funding via ${method}`,
        date: new Date().toISOString(),
        status: 'completed'
      };
      transactions.push(newTransaction);
      localStorage.setItem('swift-pay-transactions', JSON.stringify(transactions));

      toast({
        title: "Wallet funded successfully!",
        description: `$${amountNum} has been added to your wallet.`,
      });

      // Reset form
      setAmount('');
      setMethod('');
    } catch (error) {
      toast({
        title: "Funding failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [10, 25, 50, 100, 200, 500];

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-green-600" />
            <CardTitle>Fund Wallet</CardTitle>
          </div>
          <CardDescription>
            Add money to your SwiftPay wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={method} onValueChange={setMethod} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Quick Amount Selection</Label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(quickAmount.toString())}
                    className={amount === quickAmount.toString() ? 'border-blue-500 bg-blue-50' : ''}
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Custom Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Current Balance</h4>
              <p className="text-2xl font-bold text-blue-700">
                ${user?.balance?.toLocaleString() || '0'}
              </p>
              {amount && (
                <p className="text-sm text-blue-600 mt-2">
                  After funding: ${((user?.balance || 0) + parseFloat(amount || '0')).toLocaleString()}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !user}
            >
              {isLoading ? "Processing Payment..." : "Fund Wallet"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default FundWallet;
