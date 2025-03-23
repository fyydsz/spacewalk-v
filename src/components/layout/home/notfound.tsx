import { Outlet } from "react-router-dom"
import NavBar from "../../navbar/NavBar"

const MainNotFound = () => {
  return (
    <div>
      <NavBar />
      <main>
        <Outlet /> {/* Halaman lain akan dirender di sini */}
      </main>
    </div>
  )
}

export default MainNotFound;
