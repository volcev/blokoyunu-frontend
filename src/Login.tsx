import React, { useState } from "react";

type Props = {
  onLogin: (username: string) => void;
};

const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "") return;
    localStorage.setItem("username", username);
    onLogin(username);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kullanıcı adınızı girin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "10px" }}>
          Başla
        </button>
      </form>
    </div>
  );
};

export default Login;

