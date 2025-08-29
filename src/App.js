import React from 'react';
import './App.css';

// Components
import PlayerSelection from './components/PlayerSelection/PlayerSelection';
import CategorySelection from './components/CategorySelection/CategorySelection';
import GameBoard from './components/GameBoard/GameBoard';
import MatchModal from './components/Modals/MatchModal';
import DeckModal from './components/Modals/DeckModal';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';




// Hooks
import { useGameState } from './hooks/useGameState';
import { useModalState } from './hooks/useModalState';



function AppContent() {
  
  // Game state management
  const {
    category,
    numPlayers,
    players,
    currentPlayerIdx,
    cards,
    moves,
    loading,
    loadError,
    setNumPlayers,
    resetGame,
    startGame,
    handleCardClick,
    confirmMatch
  } = useGameState();
  
  // Modal state management
  const {
    matchModal,
    deckModal,
    setMatchModal,
    openDeckModal,
    closeDeckModal,
    navigateDeckCard,
    resetModals
  } = useModalState();

  // Reset both game and modal states
  const handleResetGame = () => {
    resetGame();
    resetModals();
  };

  // Wrapper function to handle card clicks with modal integration
  const handleCardClickWithModal = (idx) => {
    handleCardClick(idx, setMatchModal);
  };

  // Wrapper function to handle match confirmation
  const handleConfirmMatch = () => {
    confirmMatch(matchModal, setMatchModal);
  };


  
  const handleDeckModalNavigate = (direction) => {
    navigateDeckCard(direction);
  };



  

  if (!category) {
    console.log('=== APP RENDER (No Category) ===');
    console.log('NumPlayers:', numPlayers);

    
    return (
      <div className="App">
        <LanguageSwitcher />
        <header className="app-header">
          <h1><span className="brand-name">PEXEDU</span> <span className="subtitle">educational pexeso game - play and learn about animal kingdom</span></h1>
        </header>
        <div>
          <PlayerSelection 
            numPlayers={numPlayers}
            setNumPlayers={setNumPlayers}
          />
          <CategorySelection 
            numPlayers={numPlayers}
            startGame={startGame}
          />
        </div>

      </div>
    );
  }

  console.log('=== APP RENDER (Game Started) ===');
  console.log('Category:', category);
  console.log('Cards array length:', cards?.length);
  
  console.log('Cards sample:', cards?.slice(0, 2));
  console.log('Players:', players);
  console.log('Loading:', loading);
  console.log('Load Error:', loadError);
  
  return (
    <div className="App">
      <LanguageSwitcher />
      <header className="app-header">
        <h1><span className="brand-name">PEXEDU</span> <span className="subtitle">educational pexeso game - play and learn about animal kingdom</span></h1>
      </header>
      <GameBoard
        category={category}
        players={players}
        currentPlayerIdx={currentPlayerIdx}
        cards={cards}
        moves={moves}
        loading={loading}
        loadError={loadError}
        resetGame={handleResetGame}
        handleCardClick={handleCardClickWithModal}
        openDeckModal={openDeckModal}
      />
      <MatchModal
        matchModal={matchModal}
        onConfirm={handleConfirmMatch}
      />
      <DeckModal
        deckModal={deckModal}
        onNavigate={handleDeckModalNavigate}
        onClose={closeDeckModal}
      />

    </div>
  );
}

// Main App component
function App() {
  return (
    <AppContent />
  );
}

export default App;
