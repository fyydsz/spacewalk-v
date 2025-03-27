import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./navbar.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const handleLogin = async () => {
    try {
      // Your async code here, e.g., fetching data
      const res = await axios.get('https://api.spacewalk.my.id/auth/me', { withCredentials: true });
      if (res.status === 401) {
        console.warn("User not authenticated, skipping user setup.");
        return;
      }

      if (res.data.success) {
        window.location.href = "/dashboard"
      } else {
        window.location.href = "https://api.spacewalk.my.id/auth/discord";
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      window.location.href = "https://api.spacewalk.my.id/auth/discord";
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar-home ${scrolled || menuOpen ? "scrolled" : ""}`}>
      <Link
        to="/"
        className="title"
        onClick={(e) => {
          if (location.pathname === "/") {
            e.preventDefault(); // Hindari reload yang tidak perlu
            navigate("/");
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
        <li>
          {location.pathname === "/" ? (
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
                navigate("#about");
              }}
            >
              About
            </a>
          ) : (
            <Link to="/#about">About</Link>
          )}
        </li>

        <li>
          <Link to="/contact">Our Team</Link>
        </li>

        <li>
          <Link to="/support">Support</Link>
        </li>

        <li>
          <Button variant="glass" onClick={handleLogin} className={cn("buttonglass ml-3")}>
            Dashboard
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
