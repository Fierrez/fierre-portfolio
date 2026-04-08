
import { useEffect, useState } from 'react';

const Social = () => {
  const DISCORD_USER_ID = import.meta.env.VITE_DISCORD_USER_ID;
  const UPDATE_INTERVAL = parseInt(import.meta.env.VITE_UPDATE_INTERVAL) || 10000;

  const [lanyardData, setLanyardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let intervalId;

    async function fetchLanyard() {
      if (!DISCORD_USER_ID) {
        setError('VITE_DISCORD_USER_ID not set in .env.local');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (!mounted) return;
        if (json && json.data) {
          setLanyardData(json.data);
          setError(null);
        } else {
          setError('Unexpected Lanyard response');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch Lanyard');
      } finally {
        setLoading(false);
      }
    }

    fetchLanyard();
    intervalId = setInterval(fetchLanyard, UPDATE_INTERVAL);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [DISCORD_USER_ID, UPDATE_INTERVAL]);

  // derived values for rendering
  const discordUser = lanyardData?.discord_user || null;
  const displayName = discordUser ? (discordUser.global_name || discordUser.display_name || discordUser.username) : '';
  const status = lanyardData?.discord_status || 'offline';
  const statusColor = status === 'online' ? 'bg-green-400' : status === 'idle' ? 'bg-yellow-400' : status === 'dnd' ? 'bg-red-500' : 'bg-gray-500';
  const borderColor = status === 'online' ? 'border-green-400' : status === 'idle' ? 'border-yellow-400' : status === 'dnd' ? 'border-red-500' : 'border-gray-500';
  const activities = (lanyardData?.activities || []).filter((a) => a.type !== 'Spotify');

  // Spotify data (from Lanyard 'spotify' object if available, otherwise from activities)
  const spotifyRaw = lanyardData?.spotify || (lanyardData?.activities || []).find((a) => a.type === 'Spotify');
  const spotify = spotifyRaw
    ? {
        title: spotifyRaw.song || spotifyRaw.details || spotifyRaw.name || '',
        artist: spotifyRaw.artist || spotifyRaw.state || '',
        albumArt: spotifyRaw.album_art_url || spotifyRaw.assets?.large_image || '',
      }
    : null;

  return (
    <div className="p-6 text-white h-full overflow-auto">
      <section className="mb-6">
        <h2 className="font-semibold mb-2">Discord</h2>
        {!DISCORD_USER_ID && <div className="text-yellow-300 mb-2">Please set VITE_DISCORD_USER_ID in `.env.local`</div>}
        {loading && <div className="text-gray-300">Loading Discord presence…</div>}
        {error && <div className="text-red-400">{error}</div>}

        {lanyardData && (
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 ${borderColor}`}>
              <img
                src={
                  lanyardData.discord_user.avatar
                    ? `https://cdn.discordapp.com/avatars/${lanyardData.discord_user.id}/${lanyardData.discord_user.avatar}.png?size=128`
                    : `https://cdn.discordapp.com/embed/avatars/${parseInt(lanyardData.discord_user.discriminator || '0') % 5}.png`
                }
                alt="Discord avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-block w-3 h-3 rounded-full ${statusColor}`} title={status} />
                  <div>
                    <div className="font-semibold text-lg">{displayName}</div>
                    <div className="text-xs text-gray-400">#{discordUser?.discriminator}</div>
                  </div>
                </div>
              </div>

              {activities && activities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {activities.map((act, i) => (
                    <div key={i} className="bg-gray-900 text-gray-200 text-sm px-3 py-2 rounded-md shadow-sm">
                      <div className="font-medium">{act.name}</div>
                      {act.details && <div className="text-xs text-gray-400 mt-1">{act.details}</div>}
                    </div>
                  ))}
                </div>
              )}

              {spotify && (
                <div className="mt-4 bg-gray-900 p-3 rounded-md flex items-center gap-4 shadow-sm">
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                    {spotify.albumArt ? (
                      <img src={spotify.albumArt} alt="album" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-400">🔊</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-emerald-400 font-semibold uppercase">Listening to Spotify...</div>
                    <div className="font-medium text-white mt-1">{spotify.title}</div>
                    <div className="text-sm text-gray-400">{spotify.artist}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Spotify section intentionally removed — showing Spotify info from Lanyard inside the Discord card */}
    </div>
  );
};

export default Social;
  