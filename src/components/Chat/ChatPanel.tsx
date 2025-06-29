import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Settings, X, Loader2 } from 'lucide-react';
import { ChatMessage, GroqSettings } from '../../types/chat';
import { SettingsModal } from './SettingsModal';

interface ChatPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  settings: GroqSettings;
  onUpdateSettings: (settings: GroqSettings) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onToggle,
  messages,
  onSendMessage,
  isLoading,
  settings,
  onUpdateSettings,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-50"
        title="Open AI Chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">AI Diagram Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={onToggle}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Start a conversation to modify your diagram!</p>
              <p className="text-xs text-gray-400 mt-2">
                Try: "Add a start event and a task called 'Process Data'"
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span>AI is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={settings.apiKey ? "Describe what you want to do..." : "Configure API key in settings first"}
              disabled={isLoading || !settings.apiKey}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading || !settings.apiKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
          {!settings.apiKey && (
            <p className="text-xs text-red-500 mt-2">
              Please configure your Groq API key in settings to start chatting.
            </p>
          )}
        </form>
      </div>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={onUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
};