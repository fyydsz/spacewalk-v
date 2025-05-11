import { cn } from "@/lib/utils";
import { ButtonGlass } from "@/components/ui/custom-button-glass";

const About: React.FC = () => {
  return (
    <section id="about" className={cn(
      'about-sections',
      'h-screen flex items-center justify-center text-center',
      'bg-gradient-to-b from-black via-[#0f0f1e] to-[#1a1a2e]',
      'text-white relative overflow-hidden'
    )}>
      <div className={cn('about-container', 'max-w-[49rem]', 'p-[20px]')}>
        <h1 className={cn(
          'about-title',
          'text-5xl font-bold uppercase tracking-wide',
          'mb-2.5'
        )}>
          About Space Walk
        </h1>
        <p className={cn(
          'description',
          'text-lg leading-relaxed',
          'mb-4'
        )}>
          Space Walk adalah platform eksplorasi virtual yang membawa Anda ke luar angkasa.
          Jelajahi dunia luar angkasa dengan pengalaman terbaik di Spacewalk Discord Server.
        </p>

        <ButtonGlass
          onClick={() => window.location.href = "https://discord.gg/DpNdCKqJtH"}
        >
          Join us
        </ButtonGlass>

      </div>
    </section>
  );
};

export default About;

