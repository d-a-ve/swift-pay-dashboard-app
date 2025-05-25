
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Wallet, Send, History } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SwiftPay</span>
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Fast, Secure, and Simple
            <span className="text-blue-600 block">Digital Payments</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Send money, pay bills, and manage your finances with ease. 
            Join thousands who trust SwiftPay for their daily transactions.
          </p>
          <Link to="/register">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Using SwiftPay
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Send className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Instant Transfers</CardTitle>
              <CardDescription>
                Send money to anyone, anywhere, instantly with just their email or phone number.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Wallet className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Secure Wallet</CardTitle>
              <CardDescription>
                Your money is protected with bank-level security and encryption technology.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <History className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Bill Payments</CardTitle>
              <CardDescription>
                Pay for utilities, airtime, and other services directly from your wallet.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
