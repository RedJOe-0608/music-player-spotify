import { useEffect, useState } from "react";
import { useSongs } from "../context/SongsDataContext"
import useDebounce from "../hooks/useDebounce";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { Search } from "lucide-react";

const MusicList = () => {
    
    const {songs,songDurations,isLoading} = useSongs()
    const {setCurrentSong,currentSongAccent} = useAudioPlayer()
    const [searchQuery,setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery,300)

    // useEffect(() => {
    //     const audio = new Audio(songs[0]?.url)

    //     audio.load() // we need to load the audio file. This would also load the metadata of the audio file which we can access via the loadedmetadata event listener. 

    //     console.log("audio data of first song",audio.duration);
        
    // },[songs])

    useEffect(() => {
      const audio = new Audio(songs[0]?.url)

      console.dir(audio); // audio properties
      // console.log(audio.volume);
      // console.log(audio.play());
      // console.log(audio.pause());
      // console.log(audio.muted);
      // console.log(audio.currentTime);

      // audio.play();
      // setTimeout(() => audio.pause(),3000)
    
    },[songs])

  return (
    <div className=" flex flex-col py-10 px-4 gap-4 min-w-md h-screen "
    style={{ backgroundColor: currentSongAccent || '#000000' }}
    >

 
      {/* Menu Buttons */}
      <div className="flex gap-4 text-white">
        <button>For You</button>
        <button>Top Tracks</button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // translucent white
        color: 'white',
        padding: '10px',
        borderRadius: '6px',
      }}
      >
        <input
          type="text"
          placeholder="Search Song, Artist"
          value={searchQuery}
          onChange={(e)=> setSearchQuery(e.target.value)}
        />
        <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-white" />
      </div>

    {isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
    </div>
    ): (
      <div className="flex flex-col gap-2">
        {songs.map((song) => (
            <div key={song.id}
            onClick={() => setCurrentSong(song)}
            className="flex items-center justify-between gap-2 cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <img 
                    src={`https://cms.samespace.com/assets/${song.cover}`} alt="song-cover"
                    className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col">
                        <p className="text-white">{song.name}</p>
                        <p className="text-gray-400">{song.artist}</p>
                    </div>
                </div>
                {songDurations[song.id] !== undefined ? (
  <p className="text-gray-400">{songDurations[song.id]}</p>
) : (
  <div className="w-10 h-4 bg-gray-500 animate-pulse rounded"></div>
)}
            </div>
        ))}
      </div>
      
    )}
     
    </div>
  )
}

export default MusicList
