import { cn } from "@/lib/utils";
import { ButtonGlass } from "@/components/ui/custom-button-glass";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";


const About: React.FC = () => {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchMemberCount() {
      try {
        const res = await axios.get("https://api.spacewalk.my.id/guild/stats?guildId=938696676909121546");
        const responseData = res.data;
        if (responseData.success) {
          setMemberCount(responseData.data.guildMembersCount);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(true);
      }
    }

    fetchMemberCount();
  }, []);

  return (
    <section id="about" className={cn(
      'about-sections',
      'min-h-screen flex flex-col justify-center',
      'bg-gradient-to-b from-black via-[#0f0f1e] to-[#1a1a2e]',
      'text-white relative overflow-hidden',
      'py-20'
    )}>
      <div className={cn('about-container', 'max-w-[49rem]', 'p-[20px] mx-auto text-center')}>
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

        <div className="mt-6 flex flex-col lg:flex-row justify-center lg:justify-between lg:items-start items-center gap-8">
          {/* Team Section - Left */}
          <div className="flex-1 lg:max-w-[50%] text-center">
            <h2 className="text-2xl font-semibold mb-3">Our Team</h2>
            <ul className="space-y-2">
              <li>
                <span className="font-bold">Fyy</span> <span className="text-white/70">- Developer</span>
              </li>
              <li>
                <span className="font-bold">Joji</span> <span className="text-white/70">- Director</span>
              </li>
              <li>
                <span className="font-bold">Wasabee</span> <span className="text-white/70">- QA & QC</span>
              </li>
              <li>
                <span className="font-bold">L</span> <span className="text-white/70">- Story Development</span>
              </li>
            </ul>
          </div>

          {/* Total Members and Join Button - Right */}
          <div className="flex-1 lg:max-w-[50%] flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 bg-[#1f1f2e]/100 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 shadow-md">
              <div className="p-2 bg-white/10 rounded-full">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left text-white">
                <div className="text-sm font-semibold">Total Members</div>
                <div className="flex items-center text-xs text-white/70">
                  <User className="text-white" size={13} />
                  <span className="ml-1">{error ? "Bot is offline" : memberCount !== null ? `${memberCount} Members` : "Loading..."}</span>
                </div>
              </div>
            </div>
            <ButtonGlass onClick={() => window.location.href = "https://discord.gg/HUPEC4KD2m"}>
              Join us
            </ButtonGlass>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

