import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-xl animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto h-24 w-24">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
        </div>
        
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Objednávka přijata!</h1>
            <p className="text-muted-foreground">
                Děkujeme za vaši objednávku. Potvrzení jsme odeslali na váš email.
            </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-left space-y-2">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Číslo objednávky:</span>
                <span className="font-mono font-medium">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Datum:</span>
                <span className="font-medium">{new Date().toLocaleDateString('cs-CZ')}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Odhadované doručení:</span>
                <span className="font-medium text-green-600">Dnes, do 2 hodin</span>
            </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
            <Link to="/">
                <Button className="w-full h-12 text-lg gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Nakupovat znovu
                </Button>
            </Link>
            <Link to="/">
                 <Button variant="ghost" className="w-full gap-2">
                    Zpět na úvodní stránku
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;