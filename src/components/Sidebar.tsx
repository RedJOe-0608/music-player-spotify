const Sidebar = () => {
  return (
    <div className="bg-gray-700 flex flex-col py-10 px-4  justify-between max-w-[15rem] h-screen border-r border-black">
    <img src={'/spotify-logo.png'} width={100} height={100} alt="logo" />
    <img src={'/profile-pic.png'} width={40} height={40} alt="logo"
     className="rounded-full"
    />
    
    </div>
  )
}

export default Sidebar
