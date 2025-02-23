import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import LiveCard from "./LiveCard";

const TwitchCard = ({ user }) => {
	const [isLive, setIsLive] = useState(false);
	const [streamData, setStreamData] = useState({});
  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3008/api/twitch/islive/${user.login}`);
        const data = await response.json();
        // Si "data" contient un tableau vide, le streamer n'est pas en live
        setIsLive(data.message.data.length > 0);
				setStreamData(data?.message?.data[0]);
				
      } catch (error) {
        console.error("Erreur lors de la récupération du statut live :", error);
      }
    };
    checkLiveStatus();
				const interval = setInterval(checkLiveStatus, 60000);
				return () => clearInterval(interval);
		}, [user.id]);

  return (
		<div className="flex">
    <Card className="w-64 shadow-lg rounded-xl p-4 " style={{backgroundColor:"oklch(0.967 0.001 286.375)"}}>
      <CardContent className="flex flex-col items-center">
        {/* Affichage en cercle pour les "partner" */}
          <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-700">
            <img src={user.profile_image_url} alt={user.display_name} className="w-full h-full object-cover" />
          </div>
        <p className="mt-3 text-lg font-semibold">{user.display_name}</p>
				{isLive && (
					<>
						<div className="mt-2 w-4 h-4 rounded-full shadow-2xl animate-pulse" style={{backgroundColor:'red', boxShadow: "0px 0px 12px red"}}></div>
						<p className="mt-3 text-lg font-semibold overflow-auto">{streamData.title}</p>
						<p className="mt-1 text-sm">{streamData.game_name}</p>
						<p className="mt-1 text-sm">{streamData.viewer_count} viewers</p>
					</>
        )}
        {/* Espace vide pour ajouter d'autres infos plus tard */}
        <div className="h-10">
					
				</div>
				
        
      </CardContent>
    </Card>
		<LiveCard liveData={streamData} username={user.login}/>
	</div>
  );
};

export default TwitchCard;
