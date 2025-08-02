import { PauseCircle, PlayCircle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react"
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
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration || !progressBarRef.current) return;
        
        const rect = progressBarRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = percent * duration;
        
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
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
        if (isMuted) {
            setIsMuted(false);
            setVolume(previousVolume);
        } else {
            setPreviousVolume(volume);
            setIsMuted(true);
        }
    };

    const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        const clickableArea = e.currentTarget;
        const rect = clickableArea.getBoundingClientRect();
        
        // Account for padding (px-1 = 4px padding on each side)
        const paddingX = 4;
        const effectiveWidth = rect.width - (paddingX * 2);
        const effectiveLeft = rect.left + paddingX;
        
        const percent = Math.max(0, Math.min(1, (e.clientX - effectiveLeft) / effectiveWidth));
        
        setVolume(percent);
        setIsMuted(false);
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) {
            return "VolumeX";
        } else if (volume < 0.5) {
            return "Volume1";
        } else {
            return "Volume2";
        }
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-6"
             style={{ backgroundColor: currentSongAccent || '#000000' }}>
            
            <img 
                src={`https://cms.samespace.com/assets/${currentSong?.cover}`} 
                alt="song-cover"
                className="w-1/2 h-1/2 rounded-md shadow-lg"
            />
            
            <div className="text-center">
                <p className="text-white text-2xl font-bold">{currentSong?.name}</p>
                <p className="text-gray-400 text-lg">{currentSong?.artist}</p>
            </div>

            {/* Hidden audio element */}
            <audio ref={audioRef} />

            {/* Custom Seeker */}
            <div className="w-3/4 max-w-md">
                <div 
                    ref={progressBarRef}
                    className="relative h-2 bg-gray-600 rounded-full cursor-pointer group"
                    onClick={handleSeek}
                    onMouseDown={handleMouseDown}
                >
                    {/* Progress bar */}
                    <div 
                        className="h-full bg-white rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                    
                    {/* Seeker thumb */}
                    <div 
                        className="absolute top-1/2 w-4 h-4 bg-white rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `calc(${progress}% - 8px)` }}
                    />
                </div>
                
                {/* Time display */}
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration)}</span>
                </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-6">
                <SkipBack 
                    className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" 
                    onClick={() => setPrevSong()} 
                />
                
                {isPlaying ? (
                    <PauseCircle 
                        className="text-white text-4xl cursor-pointer hover:text-gray-300 transition-colors" 
                        onClick={togglePlayPause} 
                    />
                ) : (
                    <PlayCircle 
                        className="text-white text-4xl cursor-pointer hover:text-gray-300 transition-colors" 
                        onClick={togglePlayPause} 
                    />
                )}
                
                <SkipForward 
                    className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" 
                    onClick={() => setNextSong()} 
                />
                
                {/* Volume Control */}
                <div className="flex items-center gap-3">
                    
                    {/* Dynamic Volume Icon */}
                    {getVolumeIcon() === "VolumeX" && (
                        <VolumeX 
                            className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" 
                            onClick={toggleMute}
                        />
                    )}
                    {getVolumeIcon() === "Volume1" && (
                        <Volume1 
                            className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" 
                            onClick={toggleMute}
                        />
                    )}
                    {getVolumeIcon() === "Volume2" && (
                        <Volume2 
                            className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" 
                            onClick={toggleMute}
                        />
                    )}
                    
                    {/* Keeping it simple: Volume Slider visible always */}
                    <div className="w-20 h-6 flex items-center cursor-pointer px-1"
                         onClick={handleVolumeChange}>
                        {/* Visual slider bar */}
                        <div className="w-full h-1 bg-gray-600 rounded-full relative">
                            <div 
                                className="h-full bg-white rounded-full transition-all duration-150"
                                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                            />
                            {/* Slider thumb */}
                            <div 
                                className="absolute top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 shadow-lg transition-all duration-150"
                                style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer