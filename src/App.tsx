import MusicList from "./components/MusicList"
import Sidebar from "./components/Sidebar"
import { SongsDataProvider } from "./context/SongsDataContext"

function App() {

  return (
    <SongsDataProvider>
      <div className="flex">
        <Sidebar />
        <MusicList />
      </div>
    </SongsDataProvider>
  )
}

export default App
