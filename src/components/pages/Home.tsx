import { useState, useEffect } from "react";
import ButtonGlass from "../ui/ButtonGlass";
import { cn } from "../../functions/twclsx";

const Home: React.FC = () => {
  const fullText = "Space Walk";
  const [text, setText] = useState("");
  const [showCursor] = useState(true);
  const [blurOpacity, setBlurOpacity] = useState(0);

  useEffect(() => {
    let index = 0;
    const type = () => {
      if (index < fullText.length) {
        setText(fullText.substring(0, index + 1));
        index++;
        setTimeout(type, 140);
      }
    };
    type();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const opacity = Math.min(scrollY / 300, 1);
      setBlurOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className={cn(
        "relative w-full h-screen flex items-center justify-center",
        "bg-[url('/src/assets/img/bg.webp')] bg-cover bg-[position:center_bottom] bg-no-repeat bg-fixed"
      )}
    >
      {/* Overlay Gelap Permanen (Biar Tetap Gelap di Home) */}
      <div className="absolute inset-0 bg-black/50 z-[1]"></div>

      {/* Overlay Blur yang Muncul saat Scroll */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-50  z-[2]"
        style={{
          opacity: blurOpacity,
        }}
      ></div>

      <div
        className={cn(
          "home-headers",
          "absolute inline-flex max-w-max ml-auto flex-col items-center",
          "text-white text-center top-[35vh]",
          "z-[3]" // Pastikan teks di atas semua overlay
        )}
      >
        <h1 className="text-7xl font-sans font-bold">
          {text}
          <span
            className={cn(
              "inline-block w-[2px] h-[1em] align-text-bottom",
              showCursor ? "bg-white animate-cursor-blink" : "bg-transparent"
            )}
          ></span>
        </h1>
        <p className="text-[1.2rem]! mb-4">Explore the cosmos.</p>
        <ButtonGlass onClick={() => scrollToSection("about")}>
          Learn More
        </ButtonGlass>
      </div>
    </section>
  );
};

export default Home;
