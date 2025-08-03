import { FastForward, MoreHorizontal, PauseCircle, PlayCircle, Rewind, Volume2, VolumeX } from "lucide-react"
import { useAudioPlayer } from "../context/AudioPlayerContext"
import { useEffect, useRef, useState } from "react"
import { formatDuration } from "../utils/formatDuration"

const AudioPlayer = () => {
    const { currentSong, currentSongAccent, setNextSong, setPrevSong } = useAudioPlayer()
    const audioRef = useRef<HTMLAudioElement>(null)
    const progressBarRef = useRef<HTMLDivElement>(null)
    
    // Audio state
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.5) // Volume level (0-1)
    const [isMuted, setIsMuted] = useState(false)
    const [previousVolume, setPreviousVolume] = useState(0.5) // For unmuting
    const [isDragging, setIsDragging] = useState(false)


    // Update audio source when song changes
    useEffect(() => {
        if (audioRef.current && currentSong) {
            audioRef.current.src = currentSong.url;
            audioRef.current.load();

            //play the song
            audioRef.current.play().catch(console.error);
            setCurrentTime(0);
        }
    }, [currentSong])

    // Audio event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (!isDragging) {
                setCurrentTime(audio.currentTime);
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        
        const handleEnded = () => {
            setIsPlaying(false);
            setNextSong(); // Auto advance to next song
        };

        //the timeupdate event fires continuously every 250ms as the audio plays.
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [isDragging, setNextSong]);

    // Sync audio volume with state
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const togglePlayPause = () => {
        if (!currentSong || !audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!currentSong || !audioRef.current || !duration || !progressBarRef.current) return;
        
        const rect = progressBarRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = percent * duration;
        
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!currentSong) return;
        
        e.preventDefault();
        setIsDragging(true);
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!audioRef.current || !duration || !progressBarRef.current) return;
            
            const rect = progressBarRef.current.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
            const newTime = percent * duration;
            
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Volume control functions
    const toggleMute = () => {
        if (!currentSong) return;
        
        if (isMuted) {
            setIsMuted(false);
            setVolume(previousVolume);
        } else {
            setPreviousVolume(volume);
            setIsMuted(true);
        }
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) {
            return "VolumeX";
        } else {
            return "Volume1";
        }
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="w-full h-full flex flex-col px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-8 smooth-bg-transition"
             style={{ backgroundColor: currentSongAccent || '#000000' }}>

           <div className=" flex items-center justify-center">
             {/* Song Info - Fixed at top */}
             <div className="w-full max-w-lg lg:max-w-xl space-y-2">
                <h1 className="text-white text-left text-2xl md:text-3xl font-bold leading-tight">
                    {currentSong?.name || "No song selected"}
                </h1>
                <p className="text-white/60 text-lg md:text-sm font-medium">
                    {currentSong?.artist || "Choose a song to play"}
                </p>
            </div>
           </div>
            
            {/* Center content area with image */}
            <div className="py-8 flex items-center justify-center min-h-0">
                <div className="relative w-full max-w-lg lg:max-w-xl h-80 lg:h-96">
                    {currentSong ? (
                        <>
                            <img 
                                src={`https://cms.samespace.com/assets/${currentSong.cover}`} 
                                alt="song-cover"
                                className="w-full h-full object-cover rounded-xl lg:rounded-lg shadow-2xl 
                                         border border-white/10 backdrop-blur-sm"
                            />
                            <div className="absolute inset-0 rounded-xl lg:rounded-lg bg-gradient-to-t from-black/20 to-transparent"></div>
                        </>
                    ) : (
                        <div className="w-full h-full rounded-xl lg:rounded-lg shadow-2xl 
                                      border border-white/10 backdrop-blur-sm aspect-square
                                      bg-white/10 flex items-center justify-center">
                            <div className="text-white/40 text-4xl md:text-5xl lg:text-6xl">
                                ♪
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom controls area */}
            <div className="space-y-4 lg:space-y-6">
                {/* Hidden audio element */}
                <audio ref={audioRef} />

                {/* Custom Seeker */}
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-lg lg:max-w-xl space-y-2 lg:space-y-3">
                        <div 
                            ref={progressBarRef}
                            className={`relative h-2 lg:h-1.5 bg-white/20 rounded-full group 
                                     transition-all duration-200 ease-in-out ${
                                         currentSong 
                                             ? 'cursor-pointer hover:h-3 lg:hover:h-2.5' 
                                             : 'cursor-not-allowed opacity-50'
                                     }`}
                            onClick={handleSeek}
                            onMouseDown={handleMouseDown}
                        >
                            {/* Progress bar */}
                            <div 
                                className="h-full bg-white rounded-full transition-all duration-100 
                                         shadow-lg group-hover:shadow-white/20"
                                style={{ width: `${progress}%` }}
                            />
                            
                            {/* Seeker thumb */}
                            <div 
                                className="absolute top-1/2 w-4 h-4 lg:w-3 lg:h-3 bg-white rounded-full 
                                         transform -translate-y-1/2 opacity-0 group-hover:opacity-100 
                                         transition-all duration-200 shadow-lg border-2 border-white/20"
                                style={{ left: `calc(${progress}% - ${progress > 0 ? '8px' : '0px'})` }}
                            />
                        </div>
                        
                        {/* Time display */}
                        <div className="flex justify-between text-sm lg:text-sm text-white/60">
                            <span>{formatDuration(currentTime)}</span>
                            <span>{formatDuration(duration)}</span>
                        </div>
                    </div>
                </div>

                {/* Control buttons */}
                <div className="w-full flex justify-center">
                    <div className="flex justify-between items-center w-full max-w-lg lg:max-w-xl">
               <button 
                 disabled={!currentSong}
                 className={`rounded-full transition-all duration-200 
                           group flex items-center justify-center ${
                               currentSong 
                                   ? 'hover:bg-white/10 cursor-pointer' 
                                   : 'cursor-not-allowed opacity-50'
                           }`}>
                 <MoreHorizontal className={`w-6 h-6 lg:w-5 lg:h-5 transition-colors duration-200 ${
                     currentSong 
                         ? 'text-white/80 group-hover:text-white' 
                         : 'text-white/40'
                 }`} />
               </button>

               <div className="flex items-center gap-4 lg:gap-3">
                 <button 
                   onClick={() => setPrevSong()}
                   disabled={!currentSong}
                   className={`p-3 lg:p-2 rounded-full transition-all duration-200 
                            group flex items-center justify-center ${
                                currentSong 
                                    ? 'hover:bg-white/10 cursor-pointer' 
                                    : 'cursor-not-allowed opacity-50'
                            }`}>
                   <Rewind className={`w-7 h-7 lg:w-6 lg:h-6 transition-colors duration-200 ${
                       currentSong 
                           ? 'text-white/80 group-hover:text-white' 
                           : 'text-white/40'
                   }`} />
                 </button>
                
                 <button 
                   onClick={togglePlayPause}
                   disabled={!currentSong}
                   className={`p-4 lg:p-3 rounded-full backdrop-blur-sm border transition-all duration-200 
                            shadow-lg group flex items-center justify-center ${
                                currentSong 
                                    ? 'bg-white/20 border-white/20 hover:bg-white/30 hover:scale-105 cursor-pointer' 
                                    : 'bg-white/10 border-white/10 cursor-not-allowed opacity-50'
                            }`}>
                   {isPlaying ? (
                       <PauseCircle className={`w-10 h-10 lg:w-8 lg:h-8 transition-colors duration-200 ${
                           currentSong 
                               ? 'text-white group-hover:text-white/90' 
                               : 'text-white/40'
                       }`} />
                   ) : (
                       <PlayCircle className={`w-10 h-10 lg:w-8 lg:h-8 transition-colors duration-200 ${
                           currentSong 
                               ? 'text-white group-hover:text-white/90' 
                               : 'text-white/40'
                       }`} />
                   )}
                 </button>
                
                 <button 
                   onClick={() => setNextSong()}
                   disabled={!currentSong}
                   className={`p-3 lg:p-2 rounded-full transition-all duration-200 
                            group flex items-center justify-center ${
                                currentSong 
                                    ? 'hover:bg-white/10 cursor-pointer' 
                                    : 'cursor-not-allowed opacity-50'
                            }`}>
                   <FastForward className={`w-7 h-7 lg:w-6 lg:h-6 transition-colors duration-200 ${
                       currentSong 
                           ? 'text-white/80 group-hover:text-white' 
                           : 'text-white/40'
                   }`} />
                 </button>
               </div>
                
                {/* Volume Control */}
                <button 
                  onClick={toggleMute}
                  disabled={!currentSong}
                  className={` rounded-full transition-all duration-200 
                           group flex items-center justify-center ${
                               currentSong 
                                   ? 'hover:bg-white/10 cursor-pointer' 
                                   : 'cursor-not-allowed opacity-50'
                           }`}>
                    {getVolumeIcon() === "VolumeX" ? (
                        <VolumeX className={`w-6 h-6 lg:w-5 lg:h-5 transition-colors duration-200 ${
                            currentSong 
                                ? 'text-white/80 group-hover:text-white' 
                                : 'text-white/40'
                        }`} />
                    ) : (
                        <Volume2 className={`w-6 h-6 lg:w-5 lg:h-5 transition-colors duration-200 ${
                            currentSong 
                                ? 'text-white/80 group-hover:text-white' 
                                : 'text-white/40'
                        }`} />
                    )}
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer