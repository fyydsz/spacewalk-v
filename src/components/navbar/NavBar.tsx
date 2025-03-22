import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ username: string; avatar: string } | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false); // Tutup menu saat route berubah
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector("nav");
      if (menuOpen && nav && !nav.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://api.spacewalk.my.id/auth/me", {
          credentials: "include", // Kirim cookie dengan request
        });

        if (res.status === 401) {
          console.warn("User not authenticated, skipping user setup.");
          return;
        }

        if (!res.ok) {
          console.error(`Failed to fetch user: ${res.status} ${res.statusText}`);
          return;
        }

        const data = await res.json();

        if (data.success) {
          setUser({
            username: data.user.username,
            avatar: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`
          });
        }
      } catch (err) {
        console.error("Network Error:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = () => {
    window.location.href = "https://api.spacewalk.my.id/auth/discord";
  };

  const handleLogout = async () => {
    await fetch("https://api.spacewalk.my.id/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav className={scrolled || menuOpen ? "scrolled" : ""}>
      <Link
        to="/"
        className="title"
        onClick={(e) => {
          if (location.pathname === "/") {
            e.preventDefault(); // Hindari reload yang tidak perlu
            navigate("/")
            window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll ke atas
          }
        }}
      >
        Home
      </Link>


      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? "open" : ""}>
        {/* Jika di halaman Home, pakai scroll. Jika di halaman lain, navigasi ke Home dulu */}
        <li>
          {location.pathname === "/" ? (
            <a href="#about" onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
              navigate("#about")
            }}>
              About
            </a>
          ) : (
            <Link to="/#about" >About</Link>
          )}
        </li>

        <li>
          <Link to="/contact">Our Team</Link>
        </li>

        <li>
          <Link to="/support">Support</Link>
        </li>

        <li>
          {user ? (
            <div className="user-info">
              <img src={user.avatar} alt="User Avatar" className="avatar" />
              <span className="user">{user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn" onClick={handleLogin}>

              Login with Discord
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
