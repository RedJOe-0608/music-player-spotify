import { useAudioPlayer } from "../context/AudioPlayerContext"

const Sidebar = () => {
  const {currentSongAccent} = useAudioPlayer()
  return (
    <div className="flex lg:flex-col lg:py-4 lg:pb-14 py-3 flex-row px-4 lg:px-6 justify-between min-w-[8rem] lg:h-screen items-center 
                   border-b lg:border-b-0 lg:border-r border-white/10 smooth-bg-transition"
         style={{ backgroundColor: currentSongAccent || '#000000' }}>
      
      {/* Spotify Logo */}
      <div className="flex justify-center">
        <img 
          src={'/spotify-logo.png'} 
          className="w-16 h-16 lg:w-20 lg:h-20 object-contain 
                   hover:scale-105 transition-transform duration-200 ease-in-out" 
          alt="Spotify Logo" 
        />
      </div>
      
      {/* Profile Picture */}
      <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                     hover:bg-white/20 transition-all duration-200 ease-in-out 
                     shadow-lg hover:shadow-xl">
        <img 
          src={'/profile-pic.png'} 
          className="w-6 h-6 lg:w-10 lg:h-10 object-cover rounded-full" 
          alt="Profile Picture"
        />
      </div>
    </div>
  )
}

export default Sidebar
