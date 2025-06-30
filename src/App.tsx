import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import Login from "./Login";
import "./App.css";

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [userColor, setUserColor] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
      const savedColor = localStorage.getItem(`color_${storedName}`);
      if (savedColor) setUserColor(savedColor);
    }
  }, []);

  const handleLogin = (name: string, color: string) => {
    localStorage.setItem("username", name);
    localStorage.setItem(`color_${name}`, color);
    setUsername(name);
    setUserColor(color);
  };

  const handleLogout = () => {
    if (username) {
      localStorage.removeItem("username");
      // Renk silinmez, kullanıcı geri gelirse aynı renkle devam eder
    }
    setUsername(null);
    setUserColor(null);
  };

  return (
    <div className="app-container">
      <h1>⛏ Block Mining Game</h1>
      {username && userColor ? (
        <>
          <button
            onClick={handleLogout}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              padding: "8px 12px",
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Çıkış Yap
          </button>
          <Grid username={username} userColor={userColor} />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
