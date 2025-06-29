import React, { useState } from 'react';
import { X, Circle, Square, Diamond, CircleDot, Layers, MousePointer, Move, Link, Edit3, Trash2, MessageCircle, Download, Save, ChevronRight, ChevronDown, HelpCircle, Lightbulb, Zap, Users } from 'lucide-react';

interface HelpPageProps {
  onClose: () => void;
}

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const sections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      icon: Lightbulb,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Bem-vindo ao BPMN Designer!</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              O BPMN Designer é uma ferramenta moderna para criar diagramas BPMN (Business Process Model and Notation) 
              de forma intuitiva e profissional. Com integração de IA, você pode criar e modificar diagramas usando linguagem natural.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🚀 Para começar:</h4>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Crie seu primeiro diagrama clicando em "New Diagram"</li>
              <li>Arraste elementos da barra de ferramentas para o canvas</li>
              <li>Conecte os elementos clicando nos pontos de conexão</li>
              <li>Use o chat com IA para modificações avançadas</li>
            </ol>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Recursos Principais</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Interface drag-and-drop</li>
                <li>• Chat com IA integrado</li>
                <li>• Exportação para múltiplos formatos</li>
                <li>• Pools e lanes para organização</li>
                <li>• Armazenamento automático</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">💡 Dicas Rápidas</h4>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Duplo clique para editar labels</li>
                <li>• Use pools para diferentes participantes</li>
                <li>• Conecte elementos pelos pontos azuis</li>
                <li>• Delete com a tecla Delete</li>
                <li>• Salve automaticamente</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'elements',
      title: 'Elementos BPMN',
      icon: Square,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Elementos Disponíveis</h3>
            <p className="text-gray-700 mb-6">
              O BPMN Designer oferece os principais elementos para modelagem de processos de negócio:
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: Circle,
                name: 'Start Event',
                color: 'text-green-600 bg-green-50 border-green-200',
                description: 'Marca o início de um processo. Use para indicar onde o fluxo começa.',
                usage: 'Arraste para o canvas e posicione no início do seu processo.'
              },
              {
                icon: Square,
                name: 'Task',
                color: 'text-blue-600 bg-blue-50 border-blue-200',
                description: 'Representa uma atividade ou tarefa que deve ser executada.',
                usage: 'Use para representar trabalho que precisa ser realizado por uma pessoa ou sistema.'
              },
              {
                icon: Diamond,
                name: 'Gateway',
                color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                description: 'Ponto de decisão no fluxo. Permite dividir ou unir caminhos.',
                usage: 'Use quando o processo precisa tomar uma decisão ou quando fluxos se encontram.'
              },
              {
                icon: CircleDot,
                name: 'End Event',
                color: 'text-red-600 bg-red-50 border-red-200',
                description: 'Marca o fim de um processo ou caminho do fluxo.',
                usage: 'Posicione onde o processo termina ou um caminho específico se encerra.'
              },
              {
                icon: Layers,
                name: 'Pool',
                color: 'text-purple-600 bg-purple-50 border-purple-200',
                description: 'Container que representa um participante ou organização.',
                usage: 'Use para separar responsabilidades entre diferentes participantes do processo.'
              }
            ].map((element, index) => (
              <div key={index} className={`border rounded-lg p-4 ${element.color}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg border ${element.color}`}>
                    <element.icon size={24} className={element.color.split(' ')[0]} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{element.name}</h4>
                    <p className="text-gray-700 text-sm mb-2">{element.description}</p>
                    <div className="text-xs text-gray-600 bg-white bg-opacity-50 rounded px-2 py-1">
                      <strong>Como usar:</strong> {element.usage}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'interactions',
      title: 'Interações',
      icon: MousePointer,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Como Interagir com o Canvas</h3>
            <p className="text-gray-700 mb-6">
              Aprenda todas as formas de interagir com os elementos do seu diagrama:
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Move,
                title: 'Arrastar Elementos',
                description: 'Clique e arraste elementos da barra de ferramentas para o canvas',
                steps: ['Selecione um elemento na barra superior', 'Arraste para a posição desejada no canvas', 'Solte para criar o elemento']
              },
              {
                icon: MousePointer,
                title: 'Mover Elementos',
                description: 'Reposicione elementos já criados no canvas',
                steps: ['Clique no elemento que deseja mover', 'Arraste para a nova posição', 'Solte para finalizar o movimento']
              },
              {
                icon: Link,
                title: 'Conectar Elementos',
                description: 'Crie fluxos entre elementos usando conexões',
                steps: ['Passe o mouse sobre um elemento', 'Clique em um dos pontos azuis que aparecem', 'Clique no elemento de destino para conectar']
              },
              {
                icon: Edit3,
                title: 'Editar Labels',
                description: 'Modifique o texto dos elementos e conexões',
                steps: ['Dê duplo clique no elemento ou label', 'Digite o novo texto', 'Pressione Enter para confirmar ou Esc para cancelar']
              },
              {
                icon: Trash2,
                title: 'Deletar Elementos',
                description: 'Remova elementos e conexões do diagrama',
                steps: ['Selecione o elemento clicando nele', 'Pressione a tecla Delete', 'Ou clique no botão X vermelho que aparece']
              }
            ].map((interaction, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <interaction.icon size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{interaction.title}</h4>
                    <p className="text-gray-700 text-sm mb-3">{interaction.description}</p>
                    <div className="bg-white rounded border p-3">
                      <div className="text-xs font-medium text-gray-600 mb-2">Passos:</div>
                      <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
                        {interaction.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'pools-lanes',
      title: 'Pools e Lanes',
      icon: Layers,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Organizando com Pools e Lanes</h3>
            <p className="text-gray-700 mb-6">
              Pools e lanes ajudam a organizar seu diagrama por participantes e responsabilidades:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="text-purple-600" size={20} />
                <h4 className="font-semibold text-purple-900">Pools</h4>
              </div>
              <p className="text-purple-800 text-sm mb-3">
                Representam diferentes participantes, organizações ou sistemas no processo.
              </p>
              <div className="bg-white bg-opacity-50 rounded p-3">
                <div className="text-xs font-medium text-purple-900 mb-2">Exemplos de uso:</div>
                <ul className="text-xs text-purple-800 space-y-1">
                  <li>• Cliente e Empresa</li>
                  <li>• Departamentos diferentes</li>
                  <li>• Sistemas internos e externos</li>
                  <li>• Fornecedores e parceiros</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="text-blue-600" size={20} />
                <h4 className="font-semibold text-blue-900">Lanes</h4>
              </div>
              <p className="text-blue-800 text-sm mb-3">
                Subdivisões dentro de um pool que representam papéis ou responsabilidades específicas.
              </p>
              <div className="bg-white bg-opacity-50 rounded p-3">
                <div className="text-xs font-medium text-blue-900 mb-2">Exemplos de uso:</div>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Gerente e Funcionário</li>
                  <li>• Vendas e Suporte</li>
                  <li>• Aprovador e Executor</li>
                  <li>• Diferentes níveis hierárquicos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Como usar Pools e Lanes:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Criando Pools:</h5>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                  <li>Arraste o elemento "Pool" para o canvas</li>
                  <li>Redimensione conforme necessário</li>
                  <li>Duplo clique para renomear</li>
                  <li>Arraste elementos para dentro do pool</li>
                </ol>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Gerenciando Lanes:</h5>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                  <li>Selecione um pool</li>
                  <li>Clique no botão "+" para adicionar lane</li>
                  <li>Duplo clique no nome da lane para editar</li>
                  <li>Use o botão lixeira para remover lanes</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ai-chat',
      title: 'Chat com IA',
      icon: MessageCircle,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Modificando Diagramas com IA</h3>
            <p className="text-gray-700 mb-6">
              Use o poder da inteligência artificial para criar e modificar seus diagramas usando linguagem natural:
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="text-blue-600" size={20} />
              <h4 className="font-semibold text-blue-900">Configuração Inicial</h4>
            </div>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2">
              <li>Clique no ícone de chat no canto inferior direito</li>
              <li>Clique no ícone de configurações (engrenagem)</li>
              <li>Insira sua chave API do Groq (gratuita)</li>
              <li>Teste a conexão e atualize os modelos</li>
              <li>Comece a conversar com a IA!</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Exemplos de Comandos:</h4>
            
            <div className="grid gap-3">
              {[
                {
                  category: 'Criação de Elementos',
                  examples: [
                    'Adicione um evento de início chamado "Receber Pedido"',
                    'Crie uma tarefa "Processar Pagamento" após o gateway',
                    'Adicione um evento de fim "Pedido Concluído"'
                  ]
                },
                {
                  category: 'Conexões',
                  examples: [
                    'Conecte o evento de início com a primeira tarefa',
                    'Adicione uma conexão do gateway para a tarefa de aprovação',
                    'Remova a conexão entre essas duas tarefas'
                  ]
                },
                {
                  category: 'Pools e Organização',
                  examples: [
                    'Crie um pool chamado "Cliente" na parte superior',
                    'Mova a tarefa de pagamento para o pool do sistema',
                    'Adicione uma lane "Gerente" no pool da empresa'
                  ]
                },
                {
                  category: 'Modificações',
                  examples: [
                    'Renomeie a tarefa "Task 1" para "Validar Dados"',
                    'Remova o gateway desnecessário',
                    'Limpe todo o diagrama e comece novamente'
                  ]
                }
              ].map((section, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">{section.category}:</h5>
                  <ul className="space-y-1">
                    {section.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2 border-l-2 border-blue-300">
                        "{example}"
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">💡 Dicas para usar a IA:</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Seja específico sobre posições e nomes</li>
              <li>• Use linguagem natural e clara</li>
              <li>• Mencione elementos existentes para referência</li>
              <li>• Peça para explicar mudanças complexas</li>
              <li>• Experimente diferentes modelos de IA</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'export-save',
      title: 'Exportar e Salvar',
      icon: Download,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Salvamento e Exportação</h3>
            <p className="text-gray-700 mb-6">
              Seus diagramas são salvos automaticamente e podem ser exportados em diferentes formatos:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Save className="text-green-600" size={20} />
                <h4 className="font-semibold text-green-900">Salvamento Automático</h4>
              </div>
              <p className="text-green-800 text-sm mb-3">
                Seus diagramas são salvos automaticamente no navegador a cada modificação.
              </p>
              <div className="bg-white bg-opacity-50 rounded p-3">
                <div className="text-xs font-medium text-green-900 mb-2">Características:</div>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>• Salvamento instantâneo</li>
                  <li>• Armazenamento local seguro</li>
                  <li>• Histórico de modificações</li>
                  <li>• Múltiplos diagramas</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Download className="text-blue-600" size={20} />
                <h4 className="font-semibold text-blue-900">Exportação</h4>
              </div>
              <p className="text-blue-800 text-sm mb-3">
                Exporte seus diagramas em formatos padrão da indústria.
              </p>
              <div className="bg-white bg-opacity-50 rounded p-3">
                <div className="text-xs font-medium text-blue-900 mb-2">Formatos disponíveis:</div>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• BPMN 2.0 (XML padrão)</li>
                  <li>• Mermaid (para documentação)</li>
                  <li>• Compatível com outras ferramentas</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Como exportar:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Clique em "Export" na barra superior</p>
                  <p className="text-xs text-gray-600">Localizado ao lado do botão Save</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Escolha o formato desejado</p>
                  <p className="text-xs text-gray-600">BPMN 2.0 para ferramentas profissionais, Mermaid para documentação</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">O arquivo será baixado automaticamente</p>
                  <p className="text-xs text-gray-600">Pronto para usar em outras ferramentas ou compartilhar</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">📋 Casos de uso para exportação:</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• <strong>BPMN 2.0:</strong> Importar em Camunda, Bizagi, ou outras ferramentas BPM</li>
              <li>• <strong>Mermaid:</strong> Incluir em documentação técnica, README, ou wikis</li>
              <li>• <strong>Backup:</strong> Manter cópias dos seus diagramas fora do navegador</li>
              <li>• <strong>Colaboração:</strong> Compartilhar com equipe ou stakeholders</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'shortcuts',
      title: 'Atalhos e Dicas',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Atalhos e Dicas Avançadas</h3>
            <p className="text-gray-700 mb-6">
              Maximize sua produtividade com estes atalhos e dicas profissionais:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">⌨️ Atalhos de Teclado</h4>
              <div className="space-y-2">
                {[
                  { key: 'Delete', action: 'Deletar elemento selecionado' },
                  { key: 'Enter', action: 'Confirmar edição de label' },
                  { key: 'Esc', action: 'Cancelar edição ou conexão' },
                  { key: 'Duplo clique', action: 'Editar label do elemento' },
                  { key: 'Ctrl + Enter', action: 'Salvar configurações (modais)' }
                ].map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-blue-800 font-mono">
                      {shortcut.key}
                    </kbd>
                    <span className="text-blue-700 text-xs">{shortcut.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">🎯 Dicas de Produtividade</h4>
              <ul className="text-green-800 text-sm space-y-2">
                <li>• Use pools para separar responsabilidades claramente</li>
                <li>• Nomeie elementos de forma descritiva e consistente</li>
                <li>• Mantenha fluxos da esquerda para direita</li>
                <li>• Use gateways para decisões e paralelismo</li>
                <li>• Teste regularmente com a IA para validação</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-3">🏆 Melhores Práticas BPMN</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-purple-800 mb-2">Estrutura:</h5>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Sempre comece com um Start Event</li>
                  <li>• Termine com um End Event</li>
                  <li>• Use um gateway para cada decisão</li>
                  <li>• Mantenha fluxos simples e claros</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-purple-800 mb-2">Nomenclatura:</h5>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Use verbos para tarefas ("Processar", "Validar")</li>
                  <li>• Use substantivos para eventos ("Pedido Recebido")</li>
                  <li>• Seja específico e claro</li>
                  <li>• Evite jargões técnicos desnecessários</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-3">⚡ Dicas Avançadas</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-yellow-800 mb-1">Organização Visual:</h5>
                <p className="text-yellow-700 text-sm">
                  Use cores consistentes para pools, mantenha espaçamento uniforme entre elementos, 
                  e agrupe elementos relacionados visualmente.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-yellow-800 mb-1">Colaboração:</h5>
                <p className="text-yellow-700 text-sm">
                  Exporte regularmente para backup, use nomes descritivos para diagramas, 
                  e documente decisões importantes nos labels.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-yellow-800 mb-1">Performance:</h5>
                <p className="text-yellow-700 text-sm">
                  Evite diagramas muito complexos em uma única tela, use sub-processos quando necessário, 
                  e mantenha a hierarquia clara.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    }
  ];

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Ajuda</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Guia completo para usar o BPMN Designer
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                    <span className="font-medium">{section.title}</span>
                    {isActive && <ChevronRight size={16} className="ml-auto text-blue-600" />}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Precisa de mais ajuda?
              </p>
              <a
                href="mailto:giseldo@gmail.com"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Entre em contato
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              {currentSection && (
                <>
                  <currentSection.icon className="text-blue-600" size={24} />
                  <h1 className="text-2xl font-bold text-gray-900">{currentSection.title}</h1>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentSection?.content}
          </div>
        </div>
      </div>
    </div>
  );
};