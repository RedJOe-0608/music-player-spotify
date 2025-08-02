import { useAudioPlayer } from "../context/AudioPlayerContext"

const Sidebar = () => {
  const {currentSongAccent} = useAudioPlayer()
  console.log(currentSongAccent);
  return (
    <div className={`flex flex-col py-10 px-4  justify-between max-w-[15rem] h-screen`}
    style={{ backgroundColor: currentSongAccent || '#000000' }}
    >
    <img src={'/spotify-logo.png'} width={100} height={100} alt="logo" />
    <img src={'/profile-pic.png'} width={40} height={40} alt="logo"
     className="rounded-full"
    />
    
    </div>
  )
}

export default Sidebar
