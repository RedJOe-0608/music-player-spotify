import { createContext, useContext, useEffect, useState } from "react";
import { formatDuration } from "../utils/formatDuration";
import type { Song } from "../types/types";

// we are caching the song durations in the context so that we don't have to fetch them again and again.
type SongsContextType = {
    songs: Song[],
    songDurations: Record<number,string>, //id: song duration
    isLoading: boolean
}

const SongsDataContext = createContext<SongsContextType | undefined>(undefined)

export const SongsDataProvider = ({children}: {children: React.ReactNode}) => {
    const [musicList,setMusicList] = useState<Song[]>([])
    const [songDurations,setSongDurations] = useState<Record<number,string>>({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchMusicList = async() => {
            setIsLoading(true)
            const res = await fetch('https://cms.samespace.com/items/songs')
            const data = await res.json()
            setMusicList(data?.data)
            console.log(data?.data);
            setIsLoading(false)            
        }
        fetchMusicList()
    },[])

    useEffect(() => {

        if(musicList.length === 0) return;

        let audios: {audio: HTMLAudioElement,onLoad: () => void}[] = []
        let durations: Record<number,string> = {}

        const fetchSongDurations = async() => {
    
            await Promise.all(musicList.map(song => new Promise<void>((resolve)=> {
                const audio = new Audio(song.url);
    
                const handleLoadedMetadata = () => {
                    durations[song.id] = formatDuration(audio.duration);
                    resolve();
                }
    
                audio.addEventListener("loadedmetadata",handleLoadedMetadata)
                audio.load();

                audios.push({audio,onLoad: handleLoadedMetadata});
            })))

            // once all promises are resolved, we can set the song durations
            setSongDurations(durations)
            console.log(durations);
            
        }

        fetchSongDurations()

        return () => {
            audios.forEach(({audio,onLoad}) => {
                audio.removeEventListener("loadedmetadata",onLoad)
                audio.remove()
            })
        }
       
    },[musicList])

    const value:SongsContextType = {
        songs: musicList,
        songDurations,
        isLoading
    }
    return (
        <SongsDataContext.Provider value={value}>
            {children}
        </SongsDataContext.Provider>
    )

}

export function useSongs(){
    const context = useContext(SongsDataContext)
    if(!context){
        throw new Error("useSongs must be used within a SongsProvider")
    }
    return context
}