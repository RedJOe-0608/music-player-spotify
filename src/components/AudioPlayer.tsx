import { useAudioPlayer } from "../context/AudioPlayerContext"

const AudioPlayer = () => {
    const {currentSong,currentSongAccent} = useAudioPlayer()
  return (
    <div className="w-full h-screen  flex flex-col items-center justify-center gap-4"
    style={{ backgroundColor: currentSongAccent || '#000000' }}
    >
         <img 
            src={`https://cms.samespace.com/assets/${currentSong?.cover}`} alt="song-cover"
            className="w-1/2 h-1/2 rounded-md"
            />
        <p className="text-white text-2xl font-bold">{currentSong?.name}</p>
        <p className="text-gray-400">{currentSong?.artist}</p>
        <audio src={currentSong?.url} controls autoPlay></audio>
    </div>
  )
}

export default AudioPlayer
