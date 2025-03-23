import { Outlet } from "react-router-dom"
import NavBar from "../../navbar/NavBar"

const MainHome = () => {
  return (
    <div>
      <NavBar />
      <main>
        <Outlet /> {/* Halaman lain akan dirender di sini */}
      </main>
    </div>
  )
}

export default MainHome
