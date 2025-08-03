import { useEffect, useState } from "react";
import { useSongs } from "../context/SongsDataContext"
import useDebounce from "../hooks/useDebounce";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { Search } from "lucide-react";

const MusicList = () => {
    
    const {songs,songDurations,isLoading} = useSongs()
    const {currentSong, setCurrentSong,currentSongAccent} = useAudioPlayer()
    const [searchQuery,setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<'forYou' | 'topTracks'>('forYou')
    const debouncedSearchQuery = useDebounce(searchQuery,300)

    // Filter songs based on active tab
    const tabFilteredSongs = activeTab === 'topTracks' 
        ? songs.filter(song => song.top_track)
        : songs

    // Filter songs based on search query
    const filteredSongs = tabFilteredSongs.filter(song => 
        song.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )

    // useEffect(() => {
    //     const audio = new Audio(songs[0]?.url)

    //     audio.load() // we need to load the audio file. This would also load the metadata of the audio file which we can access via the loadedmetadata event listener. 

    //     console.log("audio data of first song",audio.duration);
        
    // },[songs])

    // useEffect(() => {
    //   const audio = new Audio(songs[0]?.url)

    //   console.dir(audio); // audio properties
    //   // console.log(audio.volume);
    //   // console.log(audio.play());
    //   // console.log(audio.pause());
    //   // console.log(audio.muted);
    //   // console.log(audio.currentTime);

    //   // audio.play();
    //   // setTimeout(() => audio.pause(),3000)
    
    // },[songs])
   
  return (
    <div className="flex flex-col py-8 px-4 lg:px-6 gap-6 min-w-1/3 h-screen smooth-bg-transition"
    style={{ backgroundColor: currentSongAccent || '#000000' }}
    >
 
      {/* Menu Buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <button 
          onClick={() => setActiveTab('forYou')}
          className={`px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-200 ease-in-out font-medium ${
            activeTab === 'forYou'
              ? 'bg-white/20 text-white border border-white/10 shadow-lg hover:bg-white/30'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          For You
        </button>
        <button 
          onClick={() => setActiveTab('topTracks')}
          className={`px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-200 ease-in-out font-medium ${
            activeTab === 'topTracks'
              ? 'bg-white/20 text-white border border-white/10 shadow-lg hover:bg-white/30'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          Top Tracks
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full flex-shrink-0">
        <div className="relative bg-white/15 backdrop-blur-md rounded-xl border border-white/20 
                       shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out">
          <input
            type="text"
            placeholder="Search Song, Artist"
            value={searchQuery}
            onChange={(e)=> setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/60 
                     px-4 py-3 pr-12 rounded-xl outline-none
                     focus:ring-2 focus:ring-white/30 transition-all duration-200"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
        </div>
      </div>

      {/* Music List with overflow */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        ): (
          <div className="flex flex-col gap-3">
            {filteredSongs.map((song) => {
                const isCurrentlyPlaying = currentSong?.id === song.id;
                return (
                <div key={song.id}
                onClick={() => setCurrentSong(song)}
                className={`flex items-center justify-between gap-3 p-3 cursor-pointer 
                         rounded-xl transition-all duration-200 ease-in-out group
                         ${isCurrentlyPlaying 
                           ? 'bg-white/20 border border-white/30 shadow-lg ring-2 ring-white/40' 
                           : 'border border-transparent hover:bg-white/10 hover:border-white/10'
                         }`}
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative">
                          <img 
                          src={`https://cms.samespace.com/assets/${song.cover}`} alt="song-cover"
                          className="w-12 h-12 rounded-lg shadow-md object-cover
                                   group-hover:shadow-lg transition-shadow duration-200"
                          />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <p className="text-white font-medium truncate 
                                        group-hover:text-white/90 transition-colors duration-200">
                              {song.name}
                            </p>
                            <p className="text-white/60 text-sm truncate
                                        group-hover:text-white/70 transition-colors duration-200">
                              {song.artist}
                            </p>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                      {songDurations[song.id] !== undefined ? (
                        <p className="text-white/50 text-sm">{songDurations[song.id]}</p>
                      ) : (
                        <div className="w-12 h-4 bg-white/20 animate-pulse rounded-md"></div>
                      )}
                    </div>
                </div>
                )
            })}
          </div>
        )}
      </div>
     
    </div>
  )
}

export default MusicList
