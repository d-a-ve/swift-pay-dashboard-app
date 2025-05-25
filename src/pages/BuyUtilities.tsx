
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

const BuyUtilities = () => {
  const [airtimeAmount, setAirtimeAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState('');
  const [electricityAmount, setElectricityAmount] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const handleAirtimePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(airtimeAmount);

    if (!user || amount <= 0 || amount > user.balance) {
      toast({
        title: "Transaction failed",
        description: amount > user.balance ? "Insufficient balance" : "Invalid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newBalance = user.balance - amount;
      updateUser({ balance: newBalance });

      // Save transaction
      const transactions = JSON.parse(localStorage.getItem('swift-pay-transactions') || '[]');
      const newTransaction = {
        id: Date.now().toString(),
        userId: user.id,
        type: 'utility',
        amount,
        description: `Airtime - ${provider} (${phoneNumber})`,
        date: new Date().toISOString(),
        status: 'completed'
      };
      transactions.push(newTransaction);
      localStorage.setItem('swift-pay-transactions', JSON.stringify(transactions));

      toast({
        title: "Airtime purchased!",
        description: `$${amount} airtime sent to ${phoneNumber}`,
      });

      setAirtimeAmount('');
      setPhoneNumber('');
      setProvider('');
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleElectricityPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(electricityAmount);

    if (!user || amount <= 0 || amount > user.balance) {
      toast({
        title: "Transaction failed",
        description: amount > user.balance ? "Insufficient balance" : "Invalid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newBalance = user.balance - amount;
      updateUser({ balance: newBalance });

      // Save transaction
      const transactions = JSON.parse(localStorage.getItem('swift-pay-transactions') || '[]');
      const newTransaction = {
        id: Date.now().toString(),
        userId: user.id,
        type: 'utility',
        amount,
        description: `Electricity - Meter ${meterNumber}`,
        date: new Date().toISOString(),
        status: 'completed'
      };
      transactions.push(newTransaction);
      localStorage.setItem('swift-pay-transactions', JSON.stringify(transactions));

      toast({
        title: "Electricity purchased!",
        description: `$${amount} units added to meter ${meterNumber}`,
      });

      setElectricityAmount('');
      setMeterNumber('');
    } catch (error) {
      toast({
        title: "Purchase failed",
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
          <CardTitle>Buy Utilities</CardTitle>
          <CardDescription>
            Purchase airtime and electricity units
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="airtime" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="airtime">Airtime</TabsTrigger>
              <TabsTrigger value="electricity">Electricity</TabsTrigger>
            </TabsList>

            <TabsContent value="airtime" className="space-y-4">
              <form onSubmit={handleAirtimePurchase} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Network Provider</Label>
                  <Select value={provider} onValueChange={setProvider} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verizon">Verizon</SelectItem>
                      <SelectItem value="att">AT&T</SelectItem>
                      <SelectItem value="tmobile">T-Mobile</SelectItem>
                      <SelectItem value="sprint">Sprint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="airtimeAmount">Amount ($)</Label>
                  <Input
                    id="airtimeAmount"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Enter amount"
                    value={airtimeAmount}
                    onChange={(e) => setAirtimeAmount(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Available balance: ${user?.balance?.toLocaleString() || '0'}
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Buy Airtime"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="electricity" className="space-y-4">
              <form onSubmit={handleElectricityPurchase} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meterNumber">Meter Number</Label>
                  <Input
                    id="meterNumber"
                    type="text"
                    placeholder="Enter meter number"
                    value={meterNumber}
                    onChange={(e) => setMeterNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="electricityAmount">Amount ($)</Label>
                  <Input
                    id="electricityAmount"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Enter amount"
                    value={electricityAmount}
                    onChange={(e) => setElectricityAmount(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Available balance: ${user?.balance?.toLocaleString() || '0'}
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Buy Electricity"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default BuyUtilities;
