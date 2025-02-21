import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:3008/api/twitch/islive")
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
    // Init call
    fetchData();
    // Refresh every minutes
    const interval = setInterval(fetchData, 60000);
    // Cleanup 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: 300, padding: 20 }}>
      <h2>📡 Données API</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data.length === 0 ? (
        <p>Aucune donnée disponible pour le moment.</p>
      ) : (
        <pre style={{ background: "#f4f4f4", padding: 10, borderRadius: 5 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
