import { useState, useCallback } from 'react';
import { ChatMessage, GroqSettings, DiagramModification } from '../types/chat';
import { BPMNDiagram } from '../types/bpmn';
import { GroqService } from '../services/groqService';

const STORAGE_KEY_SETTINGS = 'groq-settings';
const STORAGE_KEY_MESSAGES = 'chat-messages';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (stored) {
        return JSON.parse(stored).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
    return [];
  });

  const [settings, setSettings] = useState<GroqSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading Groq settings:', error);
    }
    return {
      apiKey: '',
      model: 'llama-3.1-70b-versatile',
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const saveMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(newMessages));
  };

  const updateSettings = useCallback((newSettings: GroqSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
  }, []);

  const sendMessage = useCallback(async (
    content: string, 
    diagram: BPMNDiagram
  ): Promise<DiagramModification[]> => {
    if (!settings.apiKey) {
      throw new Error('Groq API key is required');
    }

    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    saveMessages(newMessages);

    try {
      const groqService = new GroqService(settings);
      const { response, modifications } = await groqService.sendMessage(content, diagram);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      saveMessages([...newMessages, assistantMessage]);
      return modifications;
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };

      saveMessages([...newMessages, errorMessage]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [messages, settings]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
  }, []);

  return {
    messages,
    settings,
    isLoading,
    sendMessage,
    updateSettings,
    clearMessages,
  };
};