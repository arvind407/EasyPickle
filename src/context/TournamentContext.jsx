import { createContext, useContext, useState, useEffect } from 'react';

const TournamentContext = createContext();

export function TournamentProvider({ children }) {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTournamentId = localStorage.getItem('selectedTournamentId');
    if (savedTournamentId) {
      setSelectedTournament({ tournamentId: savedTournamentId });
    }
    setIsLoading(false);
  }, []);

  const selectTournament = (tournament) => {
    setSelectedTournament(tournament);
    if (tournament) {
      localStorage.setItem('selectedTournamentId', tournament.tournamentId);
    } else {
      localStorage.removeItem('selectedTournamentId');
    }
  };

  const clearTournament = () => {
    setSelectedTournament(null);
    localStorage.removeItem('selectedTournamentId');
  };

  return (
    <TournamentContext.Provider value={{ 
      selectedTournament, 
      selectTournament, 
      clearTournament,
      isLoading 
    }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}