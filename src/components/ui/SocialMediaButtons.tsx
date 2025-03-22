import { FaInstagram, FaGithub, FaDiscord } from "react-icons/fa";
import { cn } from "../../functions/twclsx";
import { Link } from "react-router-dom";
import takoIcon from "../../assets/icons/tako.png";

const socialLinks = [
  { href: "https://tako.id/fyyyy", icon: <img src={takoIcon} alt="Tako" className="w-6 h-6" />, label: "Tako" },
  { href: "https://github.com/fyydsz", icon: <FaGithub />, label: "GitHub" },
  { href: "https://instagram.com/fyydsz_", icon: <FaInstagram />, label: "Instagram" },
  { href: "https://discord.com/users/497748439770333184", icon: <FaDiscord />, label: "Discord",  },
];

const SocialButton = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <Link
      to={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 bg-white/20 border border-white/30 text-white px-4 py-2",
        "rounded-[10px] cursor-pointer transition-all duration-300 ease-in-out",
        "shadow-[0_4px_10px_rgba(255,255,255,0.2)] backdrop-blur-[10px] hover:backdrop-blur-[10px]",
        "hover:bg-white/30 hover:shadow-[0_6px_15px_rgba(255,255,255,0.3)] hover:scale-105",
        "active:bg-white/40 active:scale-98"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const SocialMediaButtons = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {socialLinks.map((link, index) => (
        <SocialButton key={index} {...link} />
      ))}
    </div>
  );
};

export default SocialMediaButtons;
