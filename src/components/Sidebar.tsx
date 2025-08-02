import { useAudioPlayer } from "../context/AudioPlayerContext"

const Sidebar = () => {
  const {currentSongAccent} = useAudioPlayer()
  console.log(currentSongAccent);
  return (
    <div className={`flex lg:flex-col flex-row py-10 px-4 justify-between min-w-[12rem] lg:h-screen h-10 items-center`}
    style={{ backgroundColor: currentSongAccent || '#000000' }}
    >
    <img src={'/spotify-logo.png'} className="lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] object-contain" alt="logo" />
    <img src={'/profile-pic.png'} className="lg:w-[40px] lg:h-[40px] w-[20px] h-[20px] object-contain rounded-full" alt="logo"
    />
    
    </div>
  )
}

export default Sidebar
