import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ButtonGlass } from "@/components/ui/custom-button-glass";

const NotFound: React.FC = () => {
  const fullText = "404 - Not Found";
  const [text, setText] = useState("");
  const [showCursor] = useState(true);

  useEffect(() => {
    let index = 0;

    const type = () => {
      if (index < fullText.length) {
        setText(fullText.substring(0, index + 1));
        index++;
        setTimeout(type, 140); // Delay tiap huruf
      }
    };
    type();

    return () => { }; // Cleanup tidak perlu karena tidak ada interval
  }, []);

  return (
    <section className={cn(
      "section-not-found",
      "relative w-full h-screen flex items-center justify-center",
      "bg-[url('/src/assets/img/bg.webp')] bg-cover bg-[position:center_bottom] bg-no-repeat bg-fixed",
      "before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:z-[1]",
    )}>
      <div className={cn(
        "not-found-headers",
        "absolute inline-flex max-w-max ml-auto flex-col items-center",
        "text-white text-center top-[35vh]",
        "z-[1]"
      )}>
        <h1 className={cn(
          'text-7xl font-sans font-bold'
        )}>
          {text}
          <span className={cn(
            "inline-block w-[2px] h-[1em] align-text-bottom", showCursor
            ? "bg-white animate-cursor-blink"
            : "bg-transparent"
          )}></span>
        </h1>
        <p className={cn("text-[1.2rem]! mb-4")}>
          Oops halaman yang kamu cari tidak ditemukan.
        </p>
        <ButtonGlass as="link" to="/">Kembali ke Beranda</ButtonGlass>
      </div>
    </section>
  );
};

export default NotFound;