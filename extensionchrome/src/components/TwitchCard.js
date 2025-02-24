import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";

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

    const handleCardClick = () =>{
      if(isLive){
        window.open(`https://twitch.tv/${user.display_name}`, '_blank');
      }
    }
  return (
		<div className="flex pr-2 pb-2">
      <Card 
        className={
          `h-20 w-2/5 shadow-lg rounded-xl flex relative transition 
          ${isLive ? "cursor-pointer hover:opacity-50 hover:shadow-sm" : ""}`}
        style={{ backgroundColor: "oklch(0.967 0.001 286.375)" }}
        onClick={handleCardClick}
      >
        <CardContent className="flex flex-row items-center space-x-3 w-full">
          {/* Image de profil en cercle */}
          {
            isLive?(
              <div 
              className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 shadow-2xl animate-pulse flex-shrink-0 relative"
              style={{ backgroundColor: 'green', boxShadow: "0px 0px 20px green", left:-30}}
              >
                <img 
                  src={user.profile_image_url} 
                  alt={user.display_name} 
                  className="w-full h-full object-cover" 
                />
            </div>
            ):
            (
              <div 
              className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 relative"
              style={{boxShadow: "0px 0px 20px grey",left:-30}}>
                <img
                  src={user.profile_image_url} 
                  alt={user.display_name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )
          }
          <div className="flex flex-col">
            <p className="text-m font-semibold">{user.display_name}</p>
            {
              isLive &&(
                <div className="flex flex-col ">
                  <p className="text-sm font-semibold truncate">{streamData.title}</p>
                  <p className="text-sm justify-start">{streamData.game_name}</p>
                </div>
              )
            }
          </div>
          {isLive && (
            <>
              <div className="flex flex-col">
                {/* <p className="text-sm">{streamData.viewer_count} viewers</p> */}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {/* Carte du Live (optionnel) */}
      {/* <LiveCard liveData={streamData} username={user.login} /> */}
  </div>
  );
};

export default TwitchCard;
