import AudioPlayer from "./components/AudioPlayer"
import MusicList from "./components/MusicList"
import Sidebar from "./components/Sidebar"
import { AudioPlayerProvider } from "./context/AudioPlayerContext"
import { SongsDataProvider } from "./context/SongsDataContext"

function App() {
  return (
    <SongsDataProvider>
      <AudioPlayerProvider>
      <div className="flex lg:flex-row flex-col">
          {/* Sidebar always first */}
          <div className="order-1 lg:order-1">
            <Sidebar />
          </div>

          {/* Audio Player comes second only on small screens */}
          <div className="order-2 lg:order-3">
            <AudioPlayer />
          </div>

          {/* Music list - second on large screens, third on small */}
          <div className="order-3 lg:order-2 flex-1">
            <MusicList />
          </div>
      </div>
      </AudioPlayerProvider>
    </SongsDataProvider>
  )
}

export default App
