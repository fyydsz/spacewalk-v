import { cn } from "../../functions/twclsx";
import { Link, LinkProps } from "react-router-dom";
import { ButtonHTMLAttributes } from "react";

interface BaseProps {
  as?: "button" | "link";
  children: React.ReactNode;
  className?: string;
}

// Props khusus untuk button
type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

// Props khusus untuk link
type LinkButtonProps = BaseProps & LinkProps;

const ButtonGlass: React.FC<ButtonProps | LinkButtonProps> = ({ as = "button", className, children, ...props }) => {
  const buttonClass = cn(
    "bg-white/20 border border-white/30 text-white text-[16px] px-5 py-2",
    "rounded-[10px] cursor-pointer transition-all duration-300 ease-in-out",
    "shadow-[0_4px_10px_rgba(255,255,255,0.2)] backdrop-blur-[10px] hover:backdrop-blur-[10px]",
    "hover:bg-white/30 hover:shadow-[0_6px_15px_rgba(255,255,255,0.3)] hover:scale-105",
    "active:bg-white/40 active:scale-98",
    className
  );

  if (as === "link") {
    // Pastikan props-nya sesuai untuk <Link>
    const { to, ...linkProps } = props as LinkButtonProps;
    return (
      <Link to={to} className={buttonClass} {...linkProps}>
        {children}
      </Link>
    );
  }

  // Pastikan props-nya sesuai untuk <button>
  return (
    <button className={buttonClass} {...(props as ButtonProps)}>
      {children}
    </button>
  );
};

export default ButtonGlass;
