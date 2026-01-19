import { useCart } from "@/lib/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert cents to units for display
  const displayTotal = cartTotal / 100;
  const shippingCost = 49; // Fixed shipping cost for example
  const finalTotal = displayTotal + shippingCost;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      navigate("/order-success");
      toast.success("Objednávka byla úspěšně odeslána!");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Váš košík je prázdný</h2>
        <p className="text-muted-foreground">Před dokončením objednávky musíte přidat nějaké zboží.</p>
        <Link to="/">
            <Button>Zpět na nákup</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <Link to="/" className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm mb-4">
            <ChevronLeft className="h-4 w-4" />
            Zpět na nákup
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Dokončení objednávky</h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-3 space-y-6">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kontaktní údaje</CardTitle>
                        <CardDescription>Kam vám máme zaslat potvrzení o objednávce?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name">Jméno</Label>
                                <Input id="first-name" placeholder="Jan" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name">Příjmení</Label>
                                <Input id="last-name" placeholder="Novák" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="jan.novak@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input id="phone" type="tel" placeholder="+420 777 123 456" required />
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doručovací adresa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Ulice a číslo popisné</Label>
                            <Input id="address" placeholder="Ulice 123" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Město</Label>
                                <Input id="city" placeholder="Praha" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip">PSČ</Label>
                                <Input id="zip" placeholder="110 00" required />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Method */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doprava</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="standard" className="space-y-3">
                            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-accent/50">
                                <RadioGroupItem value="standard" id="r1" />
                                <Label htmlFor="r1" className="flex-1 flex items-center justify-between cursor-pointer font-normal">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="font-medium block">Standardní doručení</span>
                                            <span className="text-muted-foreground text-xs">Doručení do 2 hodin</span>
                                        </div>
                                    </div>
                                    <span className="font-medium">{formatPrice(shippingCost)}</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle>Platba</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="card" className="space-y-3">
                            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-accent/50">
                                <RadioGroupItem value="card" id="p1" />
                                <Label htmlFor="p1" className="flex-1 flex items-center justify-between cursor-pointer font-normal">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="font-medium block">Platba kartou online</span>
                                            <span className="text-muted-foreground text-xs">Bezpečně přes platební bránu</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">Doporučeno</span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-accent/50">
                                <RadioGroupItem value="apple" id="p2" />
                                <Label htmlFor="p2" className="flex-1 flex items-center justify-between cursor-pointer font-normal">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center">
                                            <span className="text-xl font-bold"></span>
                                        </div>
                                        <div>
                                            <span className="font-medium block">Apple Pay</span>
                                            <span className="text-muted-foreground text-xs">Rychlá platba mobilem</span>
                                        </div>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
            </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-2">
            <div className="sticky top-24">
                <Card className="border-2 border-primary/10 shadow-lg">
                    <CardHeader className="bg-muted/30">
                        <CardTitle>Shrnutí objednávky</CardTitle>
                        <CardDescription>{items.length} položek v košíku</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4 max-h-[300px] overflow-auto pr-2 mb-4 custom-scrollbar">
                            {items.map(({ product, quantity }) => (
                                <div key={product.id} className="flex justify-between gap-4 text-sm">
                                    <div className="flex gap-3">
                                        <div className="h-12 w-12 rounded border bg-white flex-shrink-0 overflow-hidden">
                                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain p-1" />
                                        </div>
                                        <div>
                                            <p className="font-medium line-clamp-2">{product.name}</p>
                                            <p className="text-muted-foreground text-xs">{quantity} ks</p>
                                        </div>
                                    </div>
                                    <div className="font-medium text-right">
                                        {formatPrice(((product.price ?? 0) * quantity) / 100)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Mezisoučet</span>
                                <span>{formatPrice(displayTotal)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Doprava</span>
                                <span>{formatPrice(shippingCost)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Celkem k úhradě</span>
                                <span className="text-primary">{formatPrice(finalTotal)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground text-right mt-1">Včetně DPH</p>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 p-6">
                        <Button 
                            type="submit" 
                            form="checkout-form"
                            className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all" 
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>Zpracovávám...</>
                            ) : (
                                <>
                                    Zaplatit {formatPrice(finalTotal)}
                                    <CheckCircle2 className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
                
                <div className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <div className="flex gap-1 opacity-50">
                        <div className="h-6 w-10 bg-gray-200 rounded" />
                        <div className="h-6 w-10 bg-gray-200 rounded" />
                        <div className="h-6 w-10 bg-gray-200 rounded" />
                    </div>
                    <span>Bezpečná platba SSL</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;