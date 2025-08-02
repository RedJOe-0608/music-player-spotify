import AudioPlayer from "./components/AudioPlayer"
import MusicList from "./components/MusicList"
import Sidebar from "./components/Sidebar"
import { AudioPlayerProvider } from "./context/AudioPlayerContext"
import { SongsDataProvider } from "./context/SongsDataContext"

function App() {
  return (
    <SongsDataProvider>
      <AudioPlayerProvider>
        <div className="flex flex-col lg:flex-row min-h-screen bg-black">
          
          {/* Sidebar */}
          <div className="order-1 w-full lg:w-auto lg:min-w-[120px]">
            <Sidebar />
          </div>

          {/* Main content area: MusicList and AudioPlayer */}
          <div className="order-2 flex flex-col md:flex-row flex-1 min-h-0">
            
            {/* Music List */}
            <div className="order-3 md:order-1 w-full md:w-1/3 lg:w-[400px] lg:min-w-[350px] lg:max-w-[450px]">
              <MusicList />
            </div>

            {/* Audio Player */}
            <div className="order-2 md:order-2 lg:order-3 w-full md:w-2/3 flex-1 min-h-0">
              <AudioPlayer />
            </div>
          </div>

        </div>
      </AudioPlayerProvider>
    </SongsDataProvider>
  )
}

export default App