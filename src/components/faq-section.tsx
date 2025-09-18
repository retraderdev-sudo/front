'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface FAQSectionProps {
    className?: string;
}

export function FAQSection({ className }: FAQSectionProps) {
    const t = useTranslations('faq');

    const faqItems: FAQItem[] = React.useMemo(
        () => [
            {
                id: 'what-is-retrader',
                question: t('items.whatIsRetrader.question'),
                answer: t('items.whatIsRetrader.answer'),
            },
            {
                id: 'how-to-start',
                question: t('items.howToStart.question'),
                answer: t('items.howToStart.answer'),
            },
            {
                id: 'trading-fees',
                question: t('items.tradingFees.question'),
                answer: t('items.tradingFees.answer'),
            },
            {
                id: 'security',
                question: t('items.security.question'),
                answer: t('items.security.answer'),
            },
            {
                id: 'supported-cryptocurrencies',
                question: t('items.supportedCryptocurrencies.question'),
                answer: t('items.supportedCryptocurrencies.answer'),
            },
            {
                id: 'customer-support',
                question: t('items.customerSupport.question'),
                answer: t('items.customerSupport.answer'),
            },
        ],
        [t]
    );

    return (
        <section className={className}>
            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-foreground">
                            {t('title')}
                        </h2>
                        <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
                    </div>

                    <Accordion allowMultiple={false} className="space-y-4">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                id={item.id}
                                title={item.question}
                                className="bg-card"
                            >
                                <p className="leading-relaxed">{item.answer}</p>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
