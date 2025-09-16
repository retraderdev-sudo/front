'use client';

import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  const t = useTranslations('header');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">{t('navigation.contact')}</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with our team. We&apos;re here to help with any
            questions or support you need.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Reach out to us through any of these channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-muted-foreground">support@retrader.com</p>
              </div>
              <div>
                <h4 className="font-medium">Phone</h4>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div>
                <h4 className="font-medium">Address</h4>
                <p className="text-muted-foreground">
                  123 Trading Street
                  <br />
                  Financial District
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  className="min-h-[100px] w-full rounded-md border border-input bg-background p-3"
                  placeholder="Your message..."
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
