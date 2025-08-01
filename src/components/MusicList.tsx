import { useSongs } from "../context/SongsContext"

const MusicList = () => {
    
    const songs = useSongs()
    console.log(songs);
    
  return (
    <div className="bg-gray-700 flex flex-col py-10 px-4  justify-between max-w-[15rem] h-screen border-r border-black">
      
      {/* Menu Buttons */}

      {/* Search Bar */}

      {/* Music List */}
    </div>
  )
}

export default MusicList
