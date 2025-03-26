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
    <div>
      <header>
      <h1 className="p-3 text-center font-bold text-purple-200 border-purple-900 rounded-t-md" style={{backgroundColor:"#a300cc"}}>Twitch API</h1>
      </header>
      <div className="p-4" style={{backgroundColor:"#eeccff"}}>
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
      <footer className="p-5 text-purple-200 border-purple-900 rounded-b-md" style={{backgroundColor:"#a300cc"}}>
        <ul>
          <li>Anthropophobe</li>
          <li>Suto</li>
        </ul>
      </footer>
    </div>
  );
}

export default App;
