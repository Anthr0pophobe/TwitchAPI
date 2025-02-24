import { Card, CardContent } from "@mui/material";

const LiveCard = ({ liveData, username }) => {
  if (!liveData) return null;

  return (
    <Card className="w-1/5 bg-gray-800 text-white shadow-lg">
      <CardContent className="flex flex-col items-center">
        {/* Image du preview du stream */}
        <div className="w-full h-36 rounded-lg overflow-hidden">
        <iframe
            src={`https://player.twitch.tv/?channel=${username}&parent=localhost`}
            height="281"
            width="500"
            allowFullScreen={true}
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveCard;
