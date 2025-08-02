import AudioPlayer from "./components/AudioPlayer"
import MusicList from "./components/MusicList"
import Sidebar from "./components/Sidebar"
import { AudioPlayerProvider } from "./context/AudioPlayerContext"
import { SongsDataProvider } from "./context/SongsDataContext"

function App() {
  return (
    <SongsDataProvider>
      <AudioPlayerProvider>
      <div className="flex">
        <Sidebar />
        <MusicList />
        <AudioPlayer />
      </div>
      </AudioPlayerProvider>
    </SongsDataProvider>
  )
}

export default App
