import { createContext, useContext, useEffect, useState } from "react";

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

type SongsContextType = Song[]

const SongsContext = createContext<SongsContextType | undefined>(undefined)

export const SongsProvider = ({children}: {children: React.ReactNode}) => {
    const [musicList,setMusicList] = useState<SongsContextType>([])

    useEffect(() => {
        const fetchMusicList = async() => {
            const res = await fetch('https://cms.samespace.com/items/songs')
            const data = await res.json()
            setMusicList(data?.data)
        }
        fetchMusicList()
    },[])

    return (
        <SongsContext.Provider value={musicList}>
            {children}
        </SongsContext.Provider>
    )

}

export function useSongs(){
    const context = useContext(SongsContext)
    if(!context){
        throw new Error("useSongs must be used within a SongsProvider")
    }
    return context
}