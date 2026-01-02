import React, { useState } from "react";
import axios from "axios";
import "./Home.css";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export default function Home() {
  const [word, setWord] = useState("");
  const [meanings, setMeanings] = useState([]);
  const [audio, setAudio] = useState("");

  const searchword = () => {
    if (!word) return;

    axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`)
      .then((res) => {
        const data = res.data[0];
        setMeanings(data.meanings);

        // 🎧 Get audio
        const audioUrl = data.phonetics.find(p => p.audio)?.audio;
        setAudio(audioUrl || "");
      })
      .catch(() => {
        alert("Word not found");
      });
  };

  const playAudio = () => {
    if (audio) {
      new Audio(audio).play();
    }
  };

  return (
    <div className="container">
      <h1 className="title">Free Dictionary</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button onClick={searchword}>Search</button>
      </div>

      {meanings.length > 0 && (
        <>
          <div className="word-row">
            <h2 className="word-title">{word}</h2>

            {audio && (
              <button className="audio-btn" onClick={playAudio}>
                PLAY <PlayCircleOutlineIcon/>
              </button>
            )}
          </div>

          {meanings.map((meaning, index) => (
            <div key={index} className="result-card">
              <p className="part">
                <span style={{color: '#6bb86b'}}>Part of Speech:</span>
              </p>
              <p>{meaning.partOfSpeech}</p>

              <p className="part" style={{marginTop: '20px'}}>
                <span style={{color: '#6bb86b'}}>Definitions:</span>
              </p>
              
              {meaning.definitions.map((def, i) => (
                <div key={i} style={{marginBottom: '18px'}}>
                  <p>{def.definition}</p>

                  {def.example && (
                    <>
                      <p className="part" style={{marginTop: '12px'}}>
                        <span style={{color: '#6bb86b'}}>Example:</span>
                      </p>
                      <p className="example">{def.example}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}