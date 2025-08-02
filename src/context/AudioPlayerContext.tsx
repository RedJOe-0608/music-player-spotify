import { createContext, useContext, useState } from "react";
import type { Song } from "../types/types";
import { useSongs } from "./SongsDataContext";

type AudioPlayerContextType = {
   currentSong: Song | null,
   setCurrentSong: (song: Song) => void,
   currentSongAccent: string | null,
   setNextSong: () => void,
   setPrevSong: () => void,
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export const AudioPlayerProvider = ({children}: {children: React.ReactNode}) => {
    const [currentSong,setCurrentSong] = useState<Song | null>(null)
    const {songs} = useSongs()
    
    const setNextSong = () => {
        if(!currentSong) return;
        
        const currentIndex = songs.findIndex(song => song.id === currentSong.id);
        
        if(currentIndex === -1) return;
        
        if(currentIndex === songs.length - 1){
            setCurrentSong(songs[0]) // Loop to first song
        }
        else{
            setCurrentSong(songs[currentIndex + 1])
        }
    }

    const setPrevSong = () => {
        if(!currentSong) return;
        
        const currentIndex = songs.findIndex(song => song.id === currentSong.id);
        
        if(currentIndex === -1) return;
        
        if(currentIndex === 0){
            setCurrentSong(songs[songs.length - 1]) // Loop to last song
        }
        else{
            setCurrentSong(songs[currentIndex - 1])
        }
    }

    const value = {
        currentSong,
        setCurrentSong,
        currentSongAccent: currentSong?.accent || null,
        setNextSong,
        setPrevSong,
    }

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    )
}

export function useAudioPlayer(){
    const context = useContext(AudioPlayerContext)
    if(!context) throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
    return context
}