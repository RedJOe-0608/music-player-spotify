import { createContext, useContext, useState } from "react";
import type { Song } from "../types/types";

type AudioPlayerContextType = {
   currentSong: Song | null,
   setCurrentSong: (song: Song) => void,
   currentSongAccent: string | null
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export const AudioPlayerProvider = ({children}: {children: React.ReactNode}) => {
    const [currentSong,setCurrentSong] = useState<Song | null>(null)

    return (
        <AudioPlayerContext.Provider value={{currentSong,setCurrentSong,currentSongAccent: currentSong?.accent || null}}>
            {children}
        </AudioPlayerContext.Provider>
    )
}

export function useAudioPlayer(){
    const context = useContext(AudioPlayerContext)
    if(!context) throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
    return context
}