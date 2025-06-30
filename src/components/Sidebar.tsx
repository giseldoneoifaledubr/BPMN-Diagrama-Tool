import React, { useState } from 'react';
import { Plus, FileText, Trash2, ChevronLeft, ChevronRight, Edit2, Check, X, Info, HelpCircle, LogIn, LogOut, User, AlertTriangle, Shield, Home, Star } from 'lucide-react';
import { BPMNDiagram } from '../types/bpmn';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  diagrams: BPMNDiagram[];
  currentDiagram: BPMNDiagram | null;
  onCreateDiagram: (name: string) => void;
  onSelectDiagram: (diagram: BPMNDiagram) => void;
  onDeleteDiagram: (id: string) => void;
  onRenameDiagram: (id: string, newName: string) => void;
  onShowAbout: () => void;
  onShowHelp: () => void;
  onShowAuth: () => void;
  onBackToLanding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  diagrams,
  currentDiagram,
  onCreateDiagram,
  onSelectDiagram,
  onDeleteDiagram,
  onRenameDiagram,
  onShowAbout,
  onShowHelp,
  onShowAuth,
  onBackToLanding,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNewDiagramInput, setShowNewDiagramInput] = useState(false);
  const [newDiagramName, setNewDiagramName] = useState('');
  const [renamingDiagramId, setRenamingDiagramId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user, profile, signOut, isConfigured } = useAuth();

  const handleCreateDiagram = () => {
    if (newDiagramName.trim()) {
      onCreateDiagram(newDiagramName.trim());
      setNewDiagramName('');
      setShowNewDiagramInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateDiagram();
    } else if (e.key === 'Escape') {
      setShowNewDiagramInput(false);
      setNewDiagramName('');
    }
  };

  const startRename = (diagram: BPMNDiagram, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingDiagramId(diagram.id);
    setRenameValue(diagram.name);
  };

  const handleRename = () => {
    if (renamingDiagramId && renameValue.trim()) {
      onRenameDiagram(renamingDiagramId, renameValue.trim());
    }
    setRenamingDiagramId(null);
    setRenameValue('');
  };

  const cancelRename = () => {
    setRenamingDiagramId(null);
    setRenameValue('');
  };

  const handleRenameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      cancelRename();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowLogoutConfirm(false);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Expandir sidebar"
        >
          <ChevronRight size={20} />
        </button>
        
        {/* User indicator when collapsed */}
        {isConfigured && user && (
          <div className="mt-4 mb-auto">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        )}

        {isConfigured && user && (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col animate-slide-in">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">BPMN Designer</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={onBackToLanding}
              className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Voltar ao início"
            >
              <Home size={20} />
            </button>
            <button
              onClick={onShowHelp}
              className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Ajuda"
            >
              <HelpCircle size={20} />
            </button>
            <button
              onClick={onShowAbout}
              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Sobre"
            >
              <Info size={20} />
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Recolher sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-b border-gray-200">
        {isConfigured ? (
          user ? (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {profile?.full_name || 'Usuário'}
                  </div>
                  <div className="text-xs text-green-700 truncate">
                    {profile?.email || user.email}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-yellow-500" />
                    <span className="text-xs text-green-600 font-medium">Plano Pro</span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-200 hover:border-red-300"
              >
                <LogOut size={18} />
                Sair da Conta
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={onShowAuth}
                className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <LogIn size={20} />
                Entrar / Cadastrar
              </button>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Faça login para:</p>
                    <ul className="text-xs text-blue-700 mt-1 space-y-0.5">
                      <li>• Salvar na nuvem</li>
                      <li>• Acessar de qualquer lugar</li>
                      <li>• Backup automático</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={onBackToLanding}
                className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Star size={18} />
                Upgrade por R$ 1,00
              </button>
            </div>
          )
        ) : (
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Modo Gratuito</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Diagramas salvos apenas no navegador
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onBackToLanding}
              className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Star size={18} />
              Upgrade por R$ 1,00
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-b border-gray-200">
        {!showNewDiagramInput ? (
          <button
            onClick={() => setShowNewDiagramInput(true)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Novo Diagrama
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nome do diagrama..."
              value={newDiagramName}
              onChange={(e) => setNewDiagramName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateDiagram}
                disabled={!newDiagramName.trim()}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Criar
              </button>
              <button
                onClick={() => {
                  setShowNewDiagramInput(false);
                  setNewDiagramName('');
                }}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {diagrams.map((diagram) => (
            <div
              key={diagram.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                currentDiagram?.id === diagram.id
                  ? 'bg-blue-100 border border-blue-200'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => !renamingDiagramId && onSelectDiagram(diagram)}
            >
              <div className="flex items-start gap-3">
                <FileText size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {renamingDiagramId === diagram.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={handleRenameKeyPress}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename();
                          }}
                          className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                          title="Salvar"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelRename();
                          }}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Cancelar"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-gray-900 truncate">
                        {diagram.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {diagram.elements.length} elementos • {diagram.connections.length} conexões
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Atualizado em {diagram.updatedAt.toLocaleDateString('pt-BR')}
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {renamingDiagramId !== diagram.id && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => startRename(diagram, e)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Renomear diagrama"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDiagram(diagram.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Deletar diagrama"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {diagrams.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Nenhum diagrama ainda</p>
              <p className="text-gray-400 text-xs mt-1">Crie seu primeiro diagrama BPMN</p>
            </div>
          )}
        </div>
      </div>

      {/* Storage Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isConfigured && user ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-xs font-medium text-gray-700">
              {isConfigured && user ? 'Salvando na Nuvem' : 'Salvando Localmente'}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {diagrams.length} diagrama{diagrams.length !== 1 ? 's' : ''} armazenado{diagrams.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[90]">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Logout</h3>
                <p className="text-sm text-gray-600">Tem certeza que deseja sair da sua conta?</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800">
                <strong>Atenção:</strong> Seus diagramas continuarão salvos na nuvem e você pode acessá-los novamente fazendo login.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};