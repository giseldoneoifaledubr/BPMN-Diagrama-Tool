import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user || !profile) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <div className="text-left flex-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {profile.full_name || 'Usuário'}
          </div>
          <div className="text-xs text-gray-500 truncate">{profile.email}</div>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-3 border-b border-gray-200">
              <div className="font-medium text-gray-900 truncate">
                {profile.full_name || 'Usuário'}
              </div>
              <div className="text-sm text-gray-500 truncate">{profile.email}</div>
            </div>
            
            <div className="py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Implementar modal de configurações
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} />
                <span>Configurações</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};