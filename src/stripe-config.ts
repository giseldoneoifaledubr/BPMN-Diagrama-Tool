export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: string;
  currency: string;
  features: string[];
  popular?: boolean;
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_SaE4RAmzl6sUL4',
    priceId: 'price_1Rf3c6RVXYdc2KoBNlsEVtFU',
    name: 'Assinatura Readability Metrics',
    description: 'Acesso completo aos recursos de análise de legibilidade e métricas avançadas',
    mode: 'subscription',
    price: 'R$ 1,00',
    currency: 'BRL',
    features: [
      'Salvamento na nuvem',
      'Acesso multi-dispositivo',
      'Backup automático',
      'Sincronização em tempo real',
      'Histórico de versões',
      'Suporte prioritário',
      'Análise de legibilidade',
      'Métricas avançadas'
    ],
    popular: true
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};