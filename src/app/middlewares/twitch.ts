const fetchScheduleForBroadcastId = async (broadcastId: string, twitchToken:string, api_client:string) => {
  const url = `https://api.twitch.tv/helix/schedule?broadcaster_id=${broadcastId}`;
  try {
    const response = await fetch(url,{
      method:"GET",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${twitchToken}`,
        "Client-Id": api_client
      },
    });
    const data = await response.json();
    if (data.error || data.status === 404) {
      return { success: false, id: broadcastId, error: data.message || "Unknown error" };
    }
    const {
      data:{
        segments,
        broadcaster_name
      }
    } = data;
    console.log(broadcaster_name, segments[0]);
    return { success: true, username: broadcaster_name, nextStream: segments[0]};
  } catch (error) {
    return { success: false, id: broadcastId, error: `Failed to fetch broadcaster ${broadcastId}` };
  }
};
  
  export const batchFetchSchedules = async (broadcastIds: string[], twitchToken:string, api_client:string) => {
    const promises = broadcastIds.map((broadcastId) => fetchScheduleForBroadcastId(broadcastId, twitchToken, api_client));
    const results = await Promise.allSettled(promises);
    return results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value; 
      } else {
        return { success: false, error: result.reason };
      }
    });
  };

// filter succes only 
export const filterSuccessfulResults = (results: any[]) => {
  return results.filter(result => result.success);
};