import { useContext } from 'react';
import { AgentContext } from './AgentContext';

export const useAgent = () => {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used within AgentProvider');
  return ctx;
};
