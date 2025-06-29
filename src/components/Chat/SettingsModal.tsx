import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, ExternalLink, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { GroqSettings } from '../../types/chat';
import { GroqService, GroqModel } from '../../services/groqService';

interface SettingsModalProps {
  settings: GroqSettings;
  onSave: (settings: GroqSettings) => void;
  onClose: () => void;
}

const DEFAULT_MODELS: GroqModel[] = [
  { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B (Versatile)', description: 'Best balance of speed and capability - Recommended' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Instant)', description: 'Fastest response times with good quality' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Excellent for complex reasoning tasks' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: 'Efficient and capable instruction-tuned model' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [availableModels, setAvailableModels] = useState<GroqModel[]>(DEFAULT_MODELS);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    onSave({ apiKey: apiKey.trim(), model });
    onClose();
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key first' });
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      const groqService = new GroqService({ apiKey: apiKey.trim(), model });
      const result = await groqService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleUpdateModels = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key first to fetch models' });
      return;
    }

    setIsLoadingModels(true);
    setTestResult(null);

    try {
      const groqService = new GroqService({ apiKey: apiKey.trim(), model });
      const result = await groqService.getAvailableModels();
      
      if (result.success && result.models) {
        setAvailableModels(result.models);
        setTestResult({ success: true, message: `Successfully loaded ${result.models.length} models` });
        
        // If current model is not in the new list, select the first available model
        if (!result.models.some(m => m.id === model) && result.models.length > 0) {
          setModel(result.models[0].id);
        }
      } else {
        setTestResult({ success: false, message: result.message || 'Failed to load models' });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Failed to load models: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  // Clear test result when API key changes
  useEffect(() => {
    setTestResult(null);
  }, [apiKey]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Groq AI Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Key size={18} className="text-blue-600" />
              <label className="text-sm font-medium text-gray-700">
                Groq API Key
              </label>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Groq API key..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Test Connection Button */}
              <div className="flex gap-2">
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !apiKey.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isTestingConnection ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Test Connection
                </button>
                
                <button
                  onClick={handleUpdateModels}
                  disabled={isLoadingModels || !apiKey.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isLoadingModels ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  Update Models
                </button>
              </div>

              {/* Test Result */}
              {testResult && (
                <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                  testResult.success 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {testResult.success ? (
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              <p>Get your free API key from{' '}
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  Groq Console
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-green-600" />
                <label className="text-sm font-medium text-gray-700">
                  AI Model
                </label>
              </div>
              <span className="text-xs text-gray-500">
                {availableModels.length} models available
              </span>
            </div>
            
            <div className="space-y-3">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {availableModels.map((modelOption) => (
                  <option key={modelOption.id} value={modelOption.id}>
                    {modelOption.name}
                  </option>
                ))}
              </select>
              
              {/* Model Description */}
              {(() => {
                const selectedModel = availableModels.find(m => m.id === model);
                return selectedModel ? (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-700">
                      {selectedModel.description}
                    </div>
                    {selectedModel.context_window && (
                      <div className="text-xs text-gray-500 mt-1">
                        Context window: {selectedModel.context_window.toLocaleString()} tokens
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Chat with AI to modify your BPMN diagram</li>
              <li>• AI understands natural language instructions</li>
              <li>• Changes are applied automatically to your diagram</li>
              <li>• Your API key is stored locally and never shared</li>
              <li>• Test your connection before using the chat</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};