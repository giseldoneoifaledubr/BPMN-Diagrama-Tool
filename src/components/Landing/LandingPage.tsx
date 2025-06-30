import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Cloud, 
  Smartphone, 
  Users, 
  BarChart3,
  MessageCircle,
  Download,
  Layers,
  Play,
  ChevronRight,
  X
} from 'lucide-react';
import { AuthModal } from '../Auth/AuthModal';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');

  const features = [
    {
      icon: Zap,
      title: 'Interface Intuitiva',
      description: 'Drag & drop simples para criar diagramas profissionais em minutos'
    },
    {
      icon: MessageCircle,
      title: 'IA Integrada',
      description: 'Modifique diagramas usando linguagem natural com Groq AI'
    },
    {
      icon: Layers,
      title: 'Pools & Lanes',
      description: 'Organize processos por participantes e responsabilidades'
    },
    {
      icon: Download,
      title: 'Exportação Múltipla',
      description: 'Exporte para BPMN 2.0, Mermaid e outros formatos padrão'
    },
    {
      icon: Shield,
      title: 'Seguro & Privado',
      description: 'Seus dados protegidos com criptografia de ponta a ponta'
    },
    {
      icon: Smartphone,
      title: 'Responsivo',
      description: 'Funciona perfeitamente em desktop, tablet e mobile'
    }
  ];

  const testimonials = [
    {
      name: 'Ana Silva',
      role: 'Analista de Processos',
      company: 'TechCorp',
      content: 'Revolucionou nossa forma de documentar processos. A IA é incrível!',
      rating: 5
    },
    {
      name: 'Carlos Santos',
      role: 'Gerente de Projetos',
      company: 'InnovaTech',
      content: 'Interface intuitiva e recursos profissionais. Recomendo!',
      rating: 5
    },
    {
      name: 'Maria Costa',
      role: 'Consultora BPM',
      company: 'ProcessPro',
      content: 'Melhor ferramenta BPMN que já usei. Vale cada centavo!',
      rating: 5
    }
  ];

  const handlePlanSelect = (plan: 'free' | 'pro') => {
    setSelectedPlan(plan);
    if (plan === 'free') {
      onGetStarted();
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BPMN Designer</h1>
                <p className="text-xs text-gray-500">Powered by AI</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAuth(true)}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => handlePlanSelect('free')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap size={16} />
              Novo: IA integrada para criação automática
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Crie Diagramas BPMN
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Profissionais</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A ferramenta mais intuitiva para modelagem de processos de negócio. 
              Com IA integrada, interface moderna e recursos profissionais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => handlePlanSelect('free')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center gap-2 shadow-lg"
              >
                <Play size={20} />
                Começar Grátis Agora
              </button>
              <button
                onClick={() => handlePlanSelect('pro')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg"
              >
                <Star size={20} />
                Upgrade por R$ 1,00
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Diagramas Criados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Empresas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">99%</div>
                <div className="text-sm text-gray-600">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Disponível</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recursos Poderosos para Profissionais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que você precisa para criar, editar e compartilhar diagramas BPMN de forma eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos Simples e Transparentes
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e faça upgrade quando precisar de mais recursos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Gratuito */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">R$ 0</div>
                <p className="text-gray-600">Para sempre</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Diagramas ilimitados</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Todos os elementos BPMN</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Exportação BPMN/Mermaid</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span>Salvamento local</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="text-gray-400" size={20} />
                  <span className="text-gray-500">Salvamento na nuvem</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="text-gray-400" size={20} />
                  <span className="text-gray-500">Acesso multi-dispositivo</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="text-gray-400" size={20} />
                  <span className="text-gray-500">Backup automático</span>
                </li>
              </ul>

              <button
                onClick={() => handlePlanSelect('free')}
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Começar Grátis
              </button>
            </div>

            {/* Plano Pro */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">R$ 1,00</div>
                <p className="text-blue-100">Pagamento único</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={20} />
                  <span>Tudo do plano gratuito</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={20} />
                  <span>Salvamento na nuvem</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={20} />
                  <span>Acesso multi-dispositivo</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={20} />
                  <span>Backup automático</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={20} />
                  <span>Sincronização em tempo real</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={20} />
                  <span>Histórico de versões</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={20} />
                  <span>Suporte prioritário</span>
                </li>
              </ul>

              <button
                onClick={() => handlePlanSelect('pro')}
                className="w-full bg-white text-blue-600 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Upgrade Agora
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              💡 <strong>Por que apenas R$ 1,00?</strong> Queremos tornar ferramentas profissionais acessíveis a todos.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
              <Shield size={16} />
              Pagamento seguro • Sem mensalidades • Sem pegadinhas
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-gray-600">
              Milhares de profissionais já confiam no BPMN Designer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-blue-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para revolucionar seus processos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de profissionais que já usam o BPMN Designer
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handlePlanSelect('free')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              Começar Grátis
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => handlePlanSelect('pro')}
              className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              Upgrade por R$ 1,00
              <Star size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold">BPMN Designer</span>
              </div>
              <p className="text-gray-400 text-sm">
                A ferramenta mais intuitiva para criar diagramas BPMN profissionais com IA integrada.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Exemplos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 BPMN Designer. Todos os direitos reservados. Desenvolvido com ❤️ por Giseldo Neo.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
};