import { createContext, useContext, useEffect, useState } from "react";
import { formatDuration } from "../components/utils/formatDuration";

type Song = {
id: number,
status: string,
sort: null,
user_created: string,
date_created: string,
user_updated: string,
date_updated: string,
name: string,
artist: string,
accent: string,
cover: string,
top_track: boolean,
url: string
}

type SongsContextType = {
    songs: Song[],
    songDurations: Record<number,string> //id: song duration
}

const SongsDataContext = createContext<SongsContextType | undefined>(undefined)

export const SongsDataProvider = ({children}: {children: React.ReactNode}) => {
    const [musicList,setMusicList] = useState<Song[]>([])
    const [songDurations,setSongDurations] = useState<Record<number,string>>({})

    useEffect(() => {
        const fetchMusicList = async() => {
            const res = await fetch('https://cms.samespace.com/items/songs')
            const data = await res.json()
            setMusicList(data?.data)
            console.log(data?.data);
            
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
        songDurations
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