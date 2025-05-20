import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard"; // Importa la interfaz también

interface Tip {
  id: number;
  user: string;
  tip: string;
  comments?: number;
}

const DailyTips = () => {
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios.get("TU_URL_API/tips");
        setTips(response.data);
      } catch (err) {
        console.error("Error fetching tips:", err);
      }
    };

    fetchTips();
  }, []);

  return (
    <div className="daily-tips">
      <h2>Tips del día</h2>
      {tips.map((tip) => (
        <PostCard 
          key={tip.id}
          userName={tip.user}
          text={`Tip: ${tip.tip}`}
          commentCount={tip.comments}
        />
      ))}
    </div>
  );
};

export default DailyTips;