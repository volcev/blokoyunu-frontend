import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import Login from "./Login";
import "./App.css";

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
  };

  return (
    <div className="app-container">
      <h1>⛏ Block Mining Game</h1>
      {username ? (
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
          <Grid username={username} />
        </>
      ) : (
        <Login onLogin={setUsername} />
      )}
    </div>
  );
};

export default App;
