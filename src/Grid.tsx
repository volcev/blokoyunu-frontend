import React, { useEffect, useState } from "react";
import "./Grid.css";

type Props = {
  username: string;
};

type Block = {
  index: number;
  dugBy: string | null;
  color?: string | null;
};

type BlockState = "idle" | "digging" | "dug";

const TOTAL_BLOCKS = 100;
const BLOCKS_PER_ROW = 10;
const API_BASE = "https://blokoyunu-backend.onrender.com";

// Pastel renkler
const COLOR_OPTIONS = [
  "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF",
  "#E0BBE4", "#D5F4E6", "#C9C9FF", "#B5EAD7", "#FFDAC1",
];

const Grid: React.FC<Props> = ({ username }) => {
  const [blockStates, setBlockStates] = useState<BlockState[]>([]);
  const [blockData, setBlockData] = useState<Block[]>([]);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [userColor, setUserColor] = useState<string>(COLOR_OPTIONS[0]);

  useEffect(() => {
    // Kullanıcıya renk seçtir
    const selected = window.prompt(
      `Renk seç (0-${COLOR_OPTIONS.length - 1}):\n` +
        COLOR_OPTIONS.map((c, i) => `${i}: ${c}`).join("\n")
    );
    const index = parseInt(selected || "0");
    if (!isNaN(index) && COLOR_OPTIONS[index]) {
      setUserColor(COLOR_OPTIONS[index]);
    }
  }, []);

  const fetchGrid = async () => {
    try {
      const response = await fetch(`${API_BASE}/grid`);
      const data: Block[] = await response.json();

      const newStates: BlockState[] = data.map((block) =>
        block.dugBy ? "dug" : "idle"
      );
      setBlockStates(newStates);
      setBlockData(data);

      const tokenCount = data.filter((block) => block.dugBy === username).length;
      setTokenBalance(tokenCount);
    } catch (error) {
      console.error("Grid verisi alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchGrid();
  }, [username]);

  const handleClick = async (index: number) => {
    if (blockStates[index] !== "idle" || isMining) return;

    setIsMining(true);
    const newStates = [...blockStates];
    newStates[index] = "digging";
    setBlockStates(newStates);

    setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE}/grid/${index}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dugBy: username, color: userColor }),
        });

        if (!response.ok) {
          const err = await response.json();
          alert(err.error || "Kazı başarısız.");
        }

        await fetchGrid();
      } catch (error) {
        console.error("Kazı kaydedilemedi:", error);
      }

      setIsMining(false);
    }, 10000);
  };

  const handleSell = async () => {
    try {
      const response = await fetch(`${API_BASE}/grid`);
      const data: Block[] = await response.json();

      const userBlocks = data.filter((block) => block.dugBy === username);

      for (const block of userBlocks) {
        await fetch(`${API_BASE}/grid/${block.index}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dugBy: null, color: null }),
        });
      }

      setTokenBalance(0);
      await fetchGrid();

      alert("Tokenlar satıldı ve bloklar sıfırlandı.");
    } catch (error) {
      console.error("Satış işlemi başarısız:", error);
    }
  };

  const dugCount = blockStates.filter((b) => b === "dug").length;
  const revenue = 100;
  const tokenPrice = dugCount > 0 ? (revenue / dugCount).toFixed(4) : "0.0000";

  return (
    <div>
      <div className="dashboard">
        <div className="banner-placeholder">{/* Banner alanı */}</div>
        <div className="info">
          <span>Kazılan Blok: {dugCount}</span>
          <span>Reklam Geliri: ${revenue}</span>
          <span>Token Fiyatı: ${tokenPrice}</span>
          <span style={{ color: "limegreen" }}>
            Senin Tokenların: {tokenBalance}
          </span>
        </div>
        <button
          onClick={handleSell}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontWeight: "bold",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Tokenları Sat 💸
        </button>
        <button
          onClick={fetchGrid}
          style={{
            marginLeft: "10px",
            marginTop: "20px",
            padding: "10px 20px",
            fontWeight: "bold",
            backgroundColor: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🔄 Grid'i Yenile
        </button>
      </div>
      <h2>Hoş geldin {username}</h2>
      <div
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BLOCKS_PER_ROW}, 40px)`,
          gridTemplateRows: `repeat(${TOTAL_BLOCKS / BLOCKS_PER_ROW}, 40px)`,
        }}
      >
        {blockStates.map((state, index) => {
          const block = blockData[index];
          const bgColor =
            state === "dug" && block.color ? block.color : "transparent";

          return (
            <div
              key={index}
              className={`grid-block ${state}`}
              onClick={() => handleClick(index)}
              title={`Blok #${index}${
                block?.dugBy ? ` – ${block.dugBy}` : ""
              }`}
              style={{
                backgroundColor: bgColor,
                pointerEvents: isMining && state === "idle" ? "none" : "auto",
              }}
            >
              {state === "digging" ? "⏳" : state === "dug" ? "⛏" : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
