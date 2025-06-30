import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp, resetPassword } = useAuth();

  const getErrorMessage = (error: string) => {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'Email inválido',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
      'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
      'User not found': 'Usuário não encontrado',
      'Signup disabled': 'Cadastro desabilitado',
    };
    
    return errorMessages[error] || error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validações básicas
    if (!email) {
      setError('Por favor, informe o email');
      setLoading(false);
      return;
    }

    if (mode === 'forgot') {
      try {
        const { error } = await resetPassword(email.trim());
        if (error) {
          setError(getErrorMessage(error.message));
        } else {
          setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
          setEmail('');
          setTimeout(() => {
            setMode('signin');
            setSuccess(null);
          }, 3000);
        }
      } catch (error) {
        setError('Ocorreu um erro inesperado. Tente novamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setError('Por favor, informe a senha');
      setLoading(false);
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('Por favor, informe seu nome completo');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email.trim(), password, fullName.trim());
        if (error) {
          setError(getErrorMessage(error.message));
        } else {
          setSuccess('Conta criada com sucesso! Verifique seu email para confirmar.');
          setEmail('');
          setPassword('');
          setFullName('');
          setTimeout(() => {
            setMode('signin');
            setSuccess(null);
          }, 3000);
        }
      } else {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          setError(getErrorMessage(error.message));
        } else {
          setSuccess('Login realizado com sucesso!');
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      }
    } catch (error) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setSuccess(null);
    setShowPassword(false);
  };

  const changeMode = (newMode: typeof mode) => {
    setMode(newMode);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    setMode('signin');
    onClose();
  };

  if (!isOpen) return null;

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Criar Conta';
      case 'forgot': return 'Recuperar Senha';
      default: return 'Entrar';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return 'Crie sua conta para salvar seus diagramas na nuvem';
      case 'forgot': return 'Digite seu email para receber o link de recuperação';
      default: return 'Entre para acessar seus diagramas salvos';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {mode !== 'signin' && (
              <button
                onClick={() => changeMode('signin')}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
              <p className="text-sm text-gray-600 mt-1">{getSubtitle()}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Seu nome completo"
                    required={mode === 'signup'}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Sua senha"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo de 6 caracteres
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {mode === 'signup' ? 'Criando conta...' : mode === 'forgot' ? 'Enviando...' : 'Entrando...'}
                </>
              ) : (
                mode === 'signup' ? 'Criar Conta' : mode === 'forgot' ? 'Enviar Email' : 'Entrar'
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 space-y-3 text-center">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => changeMode('forgot')}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Esqueceu sua senha?
                </button>
                <div>
                  <p className="text-gray-600 text-sm">
                    Não tem uma conta?
                    <button
                      onClick={() => changeMode('signup')}
                      disabled={loading}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Criar conta
                    </button>
                  </p>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <p className="text-gray-600 text-sm">
                Já tem uma conta?
                <button
                  onClick={() => changeMode('signin')}
                  disabled={loading}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Entrar
                </button>
              </p>
            )}
          </div>

          {/* Info sobre modo local */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Sobre o login</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>Com login:</strong> seus diagramas são salvos na nuvem</li>
              <li>• <strong>Sem login:</strong> diagramas salvos apenas no navegador</li>
              <li>• Acesse de qualquer dispositivo com sua conta</li>
              <li>• Seus dados estão seguros e privados</li>
              <li>• Confirmação por email para maior segurança</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};