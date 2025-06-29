import { useState, useEffect } from 'react';
import { BPMNDiagram } from '../types/bpmn';

const STORAGE_KEY = 'bpmn-diagrams';

export const useDiagrams = () => {
  const [diagrams, setDiagrams] = useState<BPMNDiagram[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<BPMNDiagram | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedDiagrams = JSON.parse(stored).map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
          pools: d.pools || [], // Ensure pools array exists
        }));
        setDiagrams(parsedDiagrams);
        if (parsedDiagrams.length > 0) {
          setCurrentDiagram(parsedDiagrams[0]);
        }
      } catch (error) {
        console.error('Error loading diagrams:', error);
      }
    }
  }, []);

  const saveDiagrams = (updatedDiagrams: BPMNDiagram[]) => {
    setDiagrams(updatedDiagrams);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDiagrams));
  };

  const createDiagram = (name: string): BPMNDiagram => {
    const newDiagram: BPMNDiagram = {
      id: crypto.randomUUID(),
      name,
      elements: [],
      connections: [],
      pools: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedDiagrams = [newDiagram, ...diagrams];
    saveDiagrams(updatedDiagrams);
    setCurrentDiagram(newDiagram);
    return newDiagram;
  };

  const updateDiagram = (diagram: BPMNDiagram) => {
    const updatedDiagram = { ...diagram, updatedAt: new Date() };
    const updatedDiagrams = diagrams.map(d => 
      d.id === diagram.id ? updatedDiagram : d
    );
    saveDiagrams(updatedDiagrams);
    setCurrentDiagram(updatedDiagram);
  };

  const renameDiagram = (id: string, newName: string) => {
    const updatedDiagrams = diagrams.map(d => 
      d.id === id ? { ...d, name: newName, updatedAt: new Date() } : d
    );
    saveDiagrams(updatedDiagrams);
    
    // Update current diagram if it's the one being renamed
    if (currentDiagram?.id === id) {
      setCurrentDiagram({ ...currentDiagram, name: newName, updatedAt: new Date() });
    }
  };

  const deleteDiagram = (id: string) => {
    const updatedDiagrams = diagrams.filter(d => d.id !== id);
    saveDiagrams(updatedDiagrams);
    
    if (currentDiagram?.id === id) {
      setCurrentDiagram(updatedDiagrams.length > 0 ? updatedDiagrams[0] : null);
    }
  };

  const selectDiagram = (diagram: BPMNDiagram) => {
    setCurrentDiagram(diagram);
  };

  return {
    diagrams,
    currentDiagram,
    createDiagram,
    updateDiagram,
    renameDiagram,
    deleteDiagram,
    selectDiagram,
  };
};