'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
            <CardDescription>
              Your payment was cancelled. No charges have been made to your
              account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              You can try again anytime or choose a different plan.
            </p>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/plans">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/home">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
