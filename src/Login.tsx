import React, { useState } from "react";

type Props = {
  onLogin: (username: string, userColor: string) => void;
};

const colorOptions = [
  "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9",
  "#BBDEFB", "#B2EBF2", "#C8E6C9", "#DCEDC8", "#FFF9C4"
];

const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = username.trim();
    const color = selectedColor || colorOptions[Math.floor(Math.random() * colorOptions.length)];
    if (!name) return;

    localStorage.setItem("username", name);
    localStorage.setItem("userColor", color);
    onLogin(name, color); // ← Buradaki tek değişiklik bu satır
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

      <div style={{ marginTop: "20px" }}>
        <p>Bir renk seçin:</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
          {colorOptions.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: color,
                border: selectedColor === color ? "3px solid black" : "1px solid #888",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
