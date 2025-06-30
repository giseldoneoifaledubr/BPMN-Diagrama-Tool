import React from 'react';
import { Star, Crown, Calendar, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { STRIPE_PRODUCTS } from '../../stripe-config';

export const SubscriptionCard: React.FC = () => {
  const { 
    subscription, 
    loading, 
    hasActiveSubscription, 
    getSubscriptionProduct,
    isSubscriptionCanceled,
    getSubscriptionEndDate,
    createCheckoutSession 
  } = useSubscription();

  const handleUpgrade = async () => {
    try {
      const product = STRIPE_PRODUCTS[0]; // Assinatura Readability Metrics
      await createCheckoutSession(product.priceId, product.mode);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      // You might want to show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (hasActiveSubscription()) {
    const product = getSubscriptionProduct();
    const endDate = getSubscriptionEndDate();
    const isCanceled = isSubscriptionCanceled();

    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <Crown className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-green-900">
                {product?.name || 'Plano Pro'}
              </h3>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-green-700">ATIVO</span>
              </div>
            </div>
            
            <p className="text-sm text-green-700 mb-2">
              Acesso completo a todos os recursos premium
            </p>

            {isCanceled && endDate && (
              <div className="flex items-center gap-2 text-orange-700 bg-orange-100 rounded-lg px-3 py-2 mb-2">
                <AlertTriangle size={16} />
                <span className="text-sm">
                  Cancelada - válida até {endDate.toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-green-600">
              {endDate && !isCanceled && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Renova em {endDate.toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {subscription?.payment_method_brand && subscription?.payment_method_last4 && (
                <div className="flex items-center gap-1">
                  <CreditCard size={12} />
                  <span>
                    {subscription.payment_method_brand.toUpperCase()} ****{subscription.payment_method_last4}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Star className="text-white" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">
            Upgrade para Pro
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Desbloqueie salvamento na nuvem e recursos avançados por apenas R$ 1,00/mês
          </p>
          
          <button
            onClick={handleUpgrade}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Crown size={16} />
            Fazer Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};