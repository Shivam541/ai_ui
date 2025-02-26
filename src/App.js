import React from 'react';
import './App.css';
function App() {
  const [cards, setCards] = React.useState([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioURL, setAudioURL] = React.useState('');
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [activeCard, setActiveCard] = React.useState(null);
  const mediaRecorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);

  const addCard = () => {
    const newCard = {
      id: `r${cards.length + 1}`,
      title: `R${cards.length + 1}`
    };
    setCards([...cards, newCard]);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const deleteCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard(null);
    }
    setActiveCard(null);
  };

  const duplicateCard = (card) => {
    const newCard = {
      id: `r${cards.length + 1}`,
      title: `${card.title} (copy)`
    };
    setCards([...cards, newCard]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        chunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const downloadAudio = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = 'recorded-audio.webm';
      a.click();
    }
  };

  return (
    <div className="app-container">
      {/* Main Container */}
      <div className="main-container">
        {/* Add Card Button */}
        <button 
          onClick={addCard}
          style={{
            padding: '10px 20px',
            marginBottom: '20px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Card
        </button>

        {/* Row of chat windows */}
        <div className="chat-windows-row">
          {/* Dynamic Chat Windows */}
          {cards.map(card => (
            <div 
              key={card.id} 
              className="chat-window" 
              id={card.id}
              style={{ position: 'relative' }}
              onClick={() => setActiveCard(card.id)}
            >
              <div className="window-header">{card.title}</div>
              <div className="window-content"></div>
              {activeCard === card.id && (
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  left: '5px',
                  right: '5px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  gap: '5px'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(card);
                    }}
                    style={{
                      padding: '5px',
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Expand
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCard(card.id);
                    }}
                    style={{
                      padding: '5px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateCard(card);
                    }}
                    style={{
                      padding: '5px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Duplicate
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {/* Voice Recording Element */}
          <div className="voice-element">
            {!isRecording ? (
              <button 
                className="voice-circle"
                onClick={startRecording}
                style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Start Recording
              </button>
            ) : (
              <button
                className="voice-circle"
                onClick={stopRecording}
                style={{ backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Stop Recording
              </button>
            )}
            {audioURL && (
              <button
                onClick={downloadAudio}
                style={{
                  marginLeft: '10px',
                  padding: '10px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Download Audio
              </button>
            )}
          </div>
        </div>
        
        {/* Expanded Chat Window */}
        <div className="expanded-chat-window">
          <div className="window-header">
            {selectedCard ? selectedCard.title : 'Select a card above'}
          </div>
          <div className="window-content">
            {/* Content will be added here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;