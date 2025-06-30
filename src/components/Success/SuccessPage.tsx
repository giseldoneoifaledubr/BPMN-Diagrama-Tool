import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Home, Download, Star } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';

export const SuccessPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { refetch } = useSubscription();

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    setSessionId(sessionIdParam);

    // Refetch subscription data to get the latest status
    if (sessionIdParam) {
      // Wait a bit for webhook processing
      setTimeout(() => {
        refetch();
      }, 2000);
    }
  }, [refetch]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Realizado!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Parabéns! Sua assinatura foi ativada com sucesso.
          </p>

          {/* Features Unlocked */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="text-yellow-500 fill-current" size={20} />
              <h3 className="font-semibold text-gray-900">Recursos Desbloqueados</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1 text-left">
              <li>✅ Salvamento na nuvem</li>
              <li>✅ Acesso multi-dispositivo</li>
              <li>✅ Backup automático</li>
              <li>✅ Sincronização em tempo real</li>
              <li>✅ Histórico de versões</li>
              <li>✅ Suporte prioritário</li>
            </ul>
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-500">
                ID da Sessão: {sessionId.substring(0, 20)}...
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Ir para o App
            </button>
            
            <button
              onClick={() => window.open('mailto:giseldo@gmail.com', '_blank')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
            >
              Precisa de Ajuda?
            </button>
          </div>

          {/* Thank You Message */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Obrigado por escolher o BPMN Designer! 🎉
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Você receberá um email de confirmação em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};