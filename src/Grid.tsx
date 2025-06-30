import React, { useEffect, useState } from "react";
import "./Grid.css";

type Props = {
  username: string;
};

type Block = {
  index: number;
  dugBy: string | null;
};

type BlockState = "idle" | "digging" | "dug";

const TOTAL_BLOCKS = 100;
const BLOCKS_PER_ROW = 10;

const API_BASE = "https://blokoyunu-backend.onrender.com";

const Grid: React.FC<Props> = ({ username }) => {
  const [blockStates, setBlockStates] = useState<BlockState[]>([]);
  const [blockData, setBlockData] = useState<Block[]>([]);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

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
    const interval = setInterval(fetchGrid, 5000);
    return () => clearInterval(interval);
  }, [username]);

  const handleClick = async (index: number) => {
    if (blockStates[index] !== "idle" || isMining) return;

    setIsMining(true);
    const newStates = [...blockStates];
    newStates[index] = "digging";
    setBlockStates(newStates);

    setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/grid/${index}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dugBy: username }),
        });

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
          body: JSON.stringify({ dugBy: null }),
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
        <div
          className="banner"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <a
            href="https://openai.com/chatgpt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4b/OpenAI_Logo.svg"
              alt="OpenAI"
              style={{
                width: "728px",
                height: "90px",
                objectFit: "contain",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                padding: "8px",
              }}
            />
          </a>
        </div>

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
        {blockStates.map((state, index) => (
          <div
            key={index}
            className={`grid-block ${state}`}
            onClick={() => handleClick(index)}
            title={`Blok #${index}${
              blockData[index]?.dugBy ? ` – ${blockData[index]?.dugBy}` : ""
            }`}
            style={{
              pointerEvents: isMining && state === "idle" ? "none" : "auto",
            }}
          >
            {state === "digging" ? "⏳" : state === "dug" ? "⛏" : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;
