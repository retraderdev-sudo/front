'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Plan {
  id: number;
  name: string;
  description: string;
  priceId: string;
  interval: 'month' | 'year';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export default function PlansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const t = useTranslations('plans');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/plans`);
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    setSubscribing(planId);

    try {
      // Check if user is authenticated
      if (!session?.user?.email) {
        toast.error('Please sign in to subscribe to a plan');
        router.push('/login');
        setSubscribing(null);
        return;
      }

      const email = session.user.email;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/stripe/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
      setSubscribing(null);
    }
  };

  const formatPrice = (amount: number, interval: string) => {
    const price = (amount / 100).toFixed(2);
    const intervalText = interval === 'month' ? '/month' : '/year';
    return `$${price}${intervalText}`;
  };

  // Show loading while checking authentication or fetching plans
  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your needs
          </p>
          {session?.user?.email && (
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as: {session.user.email}
            </p>
          )}
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              {plan.interval === 'year' && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 transform bg-green-500">
                  Best Value
                </Badge>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-lg">
                  {plan.description}
                </CardDescription>
                <div className="text-4xl font-bold text-primary">
                  {formatPrice(plan.amount, plan.interval)}
                </div>
              </CardHeader>

              <CardContent className="text-center">
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscribing === plan.id}
                  className="w-full"
                  size="lg"
                >
                  {subscribing === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No plans available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
