import React from 'react';
import { X, Mail, Github, Linkedin, Heart, Zap, Users, Shield } from 'lucide-react';

interface AboutPageProps {
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">BPMN Designer</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Uma ferramenta moderna e intuitiva para criar diagramas BPMN com o poder da Inteligência Artificial
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-12">
          {/* About the Tool */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Zap className="text-blue-600" size={32} />
              Sobre a Ferramenta
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  O BPMN Designer é uma aplicação web avançada que revoluciona a criação de diagramas BPMN (Business Process Model and Notation). 
                  Combinando uma interface intuitiva com o poder da inteligência artificial, oferece uma experiência única para modelagem de processos.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  Com integração ao Groq AI, você pode criar e modificar diagramas usando linguagem natural, 
                  tornando a modelagem de processos mais acessível e eficiente para todos os níveis de usuários.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Principais Recursos</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Interface drag-and-drop intuitiva</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Chat com IA para modificação de diagramas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Exportação para Mermaid e BPMN 2.0</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Gerenciamento de múltiplos diagramas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Armazenamento local automático</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Por que escolher o BPMN Designer?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">IA Integrada</h3>
                <p className="text-gray-600">
                  Modifique diagramas usando linguagem natural com a integração do Groq AI
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fácil de Usar</h3>
                <p className="text-gray-600">
                  Interface intuitiva que permite criar diagramas profissionais sem curva de aprendizado
                </p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Seguro e Privado</h3>
                <p className="text-gray-600">
                  Seus dados ficam no seu navegador. Nenhuma informação é enviada para servidores externos
                </p>
              </div>
            </div>
          </section>

          {/* Author Section */}
          <section className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <Heart className="text-red-500" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Sobre o Autor</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Giseldo Neo</h3>
                  <p className="text-lg text-blue-600 font-medium mb-4">Desenvolvedor & Arquiteto de Software</p>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  Desenvolvedor apaixonado por criar soluções inovadoras que simplificam processos complexos. 
                  Com experiência em desenvolvimento web moderno e integração de IA, Giseldo criou o BPMN Designer 
                  para democratizar a modelagem de processos de negócio.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  Acredita que a tecnologia deve ser uma ferramenta que empodera as pessoas, 
                  não uma barreira que as limita.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Entre em Contato</h4>
                
                <div className="space-y-4">
                  <a
                    href="mailto:giseldo@gmail.com"
                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                      <Mail className="text-white" size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-blue-600 text-sm">giseldo@gmail.com</div>
                    </div>
                  </a>
                  
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Sugestões, feedback ou colaborações são sempre bem-vindos!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Tecnologias Utilizadas</h2>
            
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <div className="font-medium text-gray-900">React</div>
                  <div className="text-sm text-gray-600">Interface moderna</div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-cyan-600 rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div className="font-medium text-gray-900">TypeScript</div>
                  <div className="text-sm text-gray-600">Código robusto</div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div className="font-medium text-gray-900">Tailwind CSS</div>
                  <div className="text-sm text-gray-600">Design responsivo</div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <div className="font-medium text-gray-900">Groq AI</div>
                  <div className="text-sm text-gray-600">IA conversacional</div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-xl text-blue-100 mb-6">
              Crie seu primeiro diagrama BPMN e experimente o poder da IA
            </p>
            <button
              onClick={onClose}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
            >
              Começar Agora
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};