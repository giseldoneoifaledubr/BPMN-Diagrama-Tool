import { useState, useEffect } from 'react';
import { BPMNDiagram } from '../types/bpmn';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useDiagrams = () => {
  const { user } = useAuth();
  const [diagrams, setDiagrams] = useState<BPMNDiagram[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<BPMNDiagram | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadDiagrams();
    } else {
      setDiagrams([]);
      setCurrentDiagram(null);
      setLoading(false);
    }
  }, [user]);

  const loadDiagrams = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diagrams')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar diagramas:', error);
        setDiagrams([]);
        return;
      }

      const parsedDiagrams = (data || []).map(d => ({
        id: d.id,
        name: d.name,
        elements: d.elements || [],
        connections: d.connections || [],
        pools: d.pools || [],
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.updated_at),
      }));

      setDiagrams(parsedDiagrams);
      
      // Só define o diagrama atual se não houver um já selecionado
      if (parsedDiagrams.length > 0 && !currentDiagram) {
        setCurrentDiagram(parsedDiagrams[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar diagramas:', error);
      setDiagrams([]);
    } finally {
      setLoading(false);
    }
  };

  const createDiagram = async (name: string): Promise<BPMNDiagram | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('diagrams')
        .insert({
          user_id: user.id,
          name,
          elements: [],
          connections: [],
          pools: [],
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar diagrama:', error);
        return null;
      }

      const newDiagram: BPMNDiagram = {
        id: data.id,
        name: data.name,
        elements: data.elements || [],
        connections: data.connections || [],
        pools: data.pools || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setDiagrams(prev => [newDiagram, ...prev]);
      setCurrentDiagram(newDiagram);
      return newDiagram;
    } catch (error) {
      console.error('Erro ao criar diagrama:', error);
      return null;
    }
  };

  const updateDiagram = async (diagram: BPMNDiagram) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('diagrams')
        .update({
          name: diagram.name,
          elements: diagram.elements,
          connections: diagram.connections,
          pools: diagram.pools,
        })
        .eq('id', diagram.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar diagrama:', error);
        return;
      }

      const updatedDiagram: BPMNDiagram = {
        ...diagram,
        updatedAt: new Date(data.updated_at),
      };

      setDiagrams(prev => prev.map(d => d.id === diagram.id ? updatedDiagram : d));
      setCurrentDiagram(updatedDiagram);
    } catch (error) {
      console.error('Erro ao atualizar diagrama:', error);
    }
  };

  const renameDiagram = async (id: string, newName: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('diagrams')
        .update({ name: newName })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao renomear diagrama:', error);
        return;
      }

      setDiagrams(prev => prev.map(d => 
        d.id === id ? { ...d, name: newName, updatedAt: new Date(data.updated_at) } : d
      ));

      if (currentDiagram?.id === id) {
        setCurrentDiagram(prev => prev ? { ...prev, name: newName, updatedAt: new Date(data.updated_at) } : null);
      }
    } catch (error) {
      console.error('Erro ao renomear diagrama:', error);
    }
  };

  const deleteDiagram = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('diagrams')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar diagrama:', error);
        return;
      }

      const updatedDiagrams = diagrams.filter(d => d.id !== id);
      setDiagrams(updatedDiagrams);
      
      if (currentDiagram?.id === id) {
        setCurrentDiagram(updatedDiagrams.length > 0 ? updatedDiagrams[0] : null);
      }
    } catch (error) {
      console.error('Erro ao deletar diagrama:', error);
    }
  };

  const selectDiagram = (diagram: BPMNDiagram) => {
    setCurrentDiagram(diagram);
  };

  return {
    diagrams,
    currentDiagram,
    loading,
    createDiagram,
    updateDiagram,
    renameDiagram,
    deleteDiagram,
    selectDiagram,
    loadDiagrams,
  };
};