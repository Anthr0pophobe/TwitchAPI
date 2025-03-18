import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";

const TwitchCard = ({ user }) => {
  const [isLive, setIsLive] = useState(false);
  const [streamData, setStreamData] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3008/api/twitch/islive/${user.login}`);
        const data = await response.json();

        setIsLive(data.success);
        
        if (data.success && data.stream.user_login === user.login) {
          const { stream, game } = data;
          setStreamData(stream);
          setGameData(game);
        } else {
          setStreamData(null);
          setGameData(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du statut live :", error);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 60000);
    return () => clearInterval(interval);

  }, [user.login]);

  const handleCardClick = () => {
    if (isLive) {
      window.open(`https://twitch.tv/${user.display_name}`, "_blank");
    }
  };

  return (
    <div className="flex pr-2 pb-2">
      <Card
        className={`h-20 w-full shadow-lg rounded-xl flex relative transition ${
          isHovered && isLive ? "card-hover" : "card-normal"
        }`}
        style={{
          backgroundColor: isHovered && isLive ? "#FA4032" : "#FAB12F",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <CardContent className="flex flex-row items-center space-x-3 w-full">
          <div
            className={`w-32 h-32 rounded-full overflow-hidden flex-shrink-0 relative ${isLive ? "bg-gray-700 shadow-2xl animate-pulse" : "bg-gray-700 shadow-sm"}`}
            style={isLive ? { boxShadow: "0px 0px 20px green", left: -30 } : { boxShadow: "0px 0px 20px grey", left: -30 }}
          >
            <img
              src={user.profile_image_url}
              alt={user.display_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-bold">{user.display_name}</p>
            {isLive && streamData && (
              <div className="flex flex-col">
                <p className="text-sm font-semibold truncate">{streamData.title}</p>
                <p className="text-sm justify-start">{streamData.game_name}</p>
              </div>
            )}
          </div>
          {isLive && gameData && gameData.box_art_url && (
            <div className="flex flex-1 w-32  justify-end relative overflow-hidden"
            style={{right: -30}}

            >
              <img
                src={gameData.box_art_url.replace("{width}x{height}", "300x500")} // Taille de l'image
                alt={gameData.name}
                style={{right: -30}}
                className="w-20 h-30 object-cover rounded-md"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitchCard;
