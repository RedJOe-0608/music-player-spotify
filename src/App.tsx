import MusicList from "./components/MusicList"
import Sidebar from "./components/Sidebar"
import { SongsProvider } from "./context/SongsContext"

function App() {

  return (
    <SongsProvider>
      <div className="flex">
        <Sidebar />
        <MusicList />
      </div>
    </SongsProvider>
  )
}

export default App
