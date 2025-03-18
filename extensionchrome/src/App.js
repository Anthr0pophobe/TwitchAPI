import React, { useState, useEffect } from "react";
import TwitchCard from "./components/TwitchCard";

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:3008/api/twitch/users")
      .then((response) => response.json())
      .then((json) => {
        if (json.success && json.message.data.length === 0) {
          setData([]);  
        } else {
          setData(json.message.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors de la récupération des données");
        setLoading(false);
      });
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  

  return (
    <div className="p-4" style={{backgroundColor:"#FEF3E2"}}>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data.length === 0 ? (
        <p>Aucune donnée disponible pour le moment.</p>
      ) : (
        data.map((elem)=><TwitchCard user={elem}/>)
      )}
    </div>
  );
}

export default App;
