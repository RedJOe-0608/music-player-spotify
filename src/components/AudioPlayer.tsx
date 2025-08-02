import { PauseCircle, PlayCircle, SkipBack, SkipForward, Volume } from "lucide-react"
import { useAudioPlayer } from "../context/AudioPlayerContext"
import { useEffect, useRef } from "react"

const AudioPlayer = () => {
    const {currentSong,currentSongAccent,setNextSong,setPrevSong} = useAudioPlayer()
    const audioRef = useRef<HTMLAudioElement>(null)

    // Update audio source when song changes
    useEffect(() => {
        if (audioRef.current && currentSong) {
            audioRef.current.src = currentSong.url;
            audioRef.current.load(); // Reload the audio element
        }
    }, [currentSong])
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
        <audio controls autoPlay ref={audioRef}></audio>
        <div className="flex gap-4">
            <SkipBack className="text-white text-2xl" onClick={()=> setPrevSong()} />
            <PlayCircle className="text-white text-2xl" onClick={()=> audioRef.current?.play()} />
            <PauseCircle className="text-white text-2xl" onClick={()=> audioRef.current?.pause()} />
            <SkipForward className="text-white text-2xl" onClick={()=> setNextSong()} />
            <Volume className="text-white text-2xl" />
            {/* <Repeat className="text-white text-2xl" /> */}
        </div>
    </div>
  )
}

export default AudioPlayer
