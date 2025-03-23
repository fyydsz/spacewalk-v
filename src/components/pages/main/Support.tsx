import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { SocialMediaButtons } from "@/components/ui/custom-socialmedia-buttons";
const Support: React.FC = () => {
  return (
    <section
      id="support"
      className={cn(
        "support",
        "relative h-screen flex items-center",
        "bg-[url('/src/assets/img/bg.webp')] bg-cover bg-[position:center_bottom] bg-no-repeat bg-fixed",
        "before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:z-[1]"
      )}
    >
      <motion.div
        className={cn(
          "support-headers",
          "absolute inline-flex max-w-[1200px] ml-auto flex-col",
          "text-white",
          "z-[2] px-5",
        )}
        style={{
          transform: "translateX(calc(50vw - 50%))" // Geser ke kiri saat layar kecil
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      >
        <h1 className={cn("text-6xl font-sans font-bold mb-2")}>Support us</h1>
        <p className={cn("text-[1.2rem] mb-2")}>
          Terima kasih telah mengunjungi Spacewalk! Kamu bisa mendukung kami
          lewat{" "}
          <a href="https://www.tako.id/fyyyy" className="underline">
            Tako.id
          </a>
          . Bisa juga dengan membagikan konten kami kepada teman-temanmu! 🚀
          Setiap dukungan dari kamu membantu kami terus menghadirkan cerita
          roleplay yang menarik seputar luar angkasa. <br />
          <br />
          Jangan lupa follow juga media sosial kami untuk update terbaru!
        </p>
        <SocialMediaButtons />
      </motion.div>
    </section>
  );
};

export default Support;
