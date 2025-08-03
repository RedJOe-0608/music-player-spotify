import { createContext, useContext, useState, useEffect } from "react";
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

// localStorage key. We are storing the current song in localStorage so that when the user refreshes the page, the song is restored.
const CURRENT_SONG_KEY = 'musicPlayer_currentSong'

// Helper functions for localStorage
const saveToLocalStorage = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error('Failed to save to localStorage:', error)
    }
}

const getFromLocalStorage = (key: string) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
    } catch (error) {
        console.error('Failed to get from localStorage:', error)
        return null
    }
}

export const AudioPlayerProvider = ({children}: {children: React.ReactNode}) => {
    const [currentSong,setCurrentSong] = useState<Song | null>(null)
    const {songs} = useSongs()
    
    // Restore currentSong from localStorage when songs are loaded
    useEffect(() => {
        if (songs.length > 0 && !currentSong) {
            const savedSong = getFromLocalStorage(CURRENT_SONG_KEY)
                if (savedSong) {
                    setCurrentSong(savedSong)
            }
        }
    }, [songs, currentSong])
    
    // Save currentSong to localStorage whenever it changes
    useEffect(() => {
        if (currentSong) {
            saveToLocalStorage(CURRENT_SONG_KEY, currentSong)
        }
    }, [currentSong])
    
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

// Export localStorage utilities for use in AudioPlayer
export { saveToLocalStorage, getFromLocalStorage }