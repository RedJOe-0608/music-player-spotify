import { useState } from "react";
import { useSongs } from "../context/SongsDataContext"
import useDebounce from "../hooks/useDebounce";

const MusicList = () => {
    
    const {songs,songDurations} = useSongs()
    const [searchQuery,setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery,300)

    // useEffect(() => {
    //     const audio = new Audio(songs[0]?.url)

    //     audio.load() // we need to load the audio file. This would also load the metadata of the audio file which we can access via the loadedmetadata event listener. 

    //     console.log("audio data of first song",audio.duration);
        
    // },[songs])

  return (
    <div className="bg-gray-700 flex flex-col py-10 px-4 gap-4 max-w-md h-screen border-r border-black">
      
      {/* Menu Buttons */}
      <div className="flex gap-4 text-white">
        <button>For You</button>
        <button>Top Tracks</button>
      </div>

      {/* Search Bar */}
      <input type="text"
      placeholder="Search Song, Artist"
      className="bg-gray-500 w-full p-2 rounded-md"
      value={searchQuery}
      onChange={(e)=> setSearchQuery(e.target.value)}
      />
      {/* Music List */}
      <div className="flex flex-col gap-2">
        {songs.map((song) => (
            <div key={song.id}
            className="flex items-center justify-between gap-2"
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
    </div>
  )
}

export default MusicList
