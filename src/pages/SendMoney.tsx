
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Send } from "lucide-react";

const SendMoney = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
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

    if (amountNum > user.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this transaction.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user balance
      const newBalance = user.balance - amountNum;
      updateUser({ balance: newBalance });

      // Save transaction
      const transactions = JSON.parse(localStorage.getItem('swift-pay-transactions') || '[]');
      const newTransaction = {
        id: Date.now().toString(),
        userId: user.id,
        type: 'sent',
        amount: amountNum,
        recipient,
        description,
        date: new Date().toISOString(),
        status: 'completed'
      };
      transactions.push(newTransaction);
      localStorage.setItem('swift-pay-transactions', JSON.stringify(transactions));

      toast({
        title: "Money sent successfully!",
        description: `$${amountNum} has been sent to ${recipient}.`,
      });

      // Reset form
      setRecipient('');
      setAmount('');
      setDescription('');
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Send className="h-6 w-6 text-blue-600" />
            <CardTitle>Send Money</CardTitle>
          </div>
          <CardDescription>
            Transfer money to friends, family, or businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient (Email or Phone)</Label>
              <Input
                id="recipient"
                type="text"
                placeholder="Enter email or phone number"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                Available balance: ${user?.balance?.toLocaleString() || '0'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                type="text"
                placeholder="What's this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !user}
            >
              {isLoading ? "Processing..." : "Send Money"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SendMoney;
