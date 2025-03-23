
const DashboardHome: React.FC = () => {
  return (
    <div
      id="home"
      className="relative w-full h-screen flex items-center justify-center 
      bg-[url('/src/assets/img/bg.webp')] bg-cover bg-[position:center_bottom] bg-no-repeat bg-fixed"
    >
      {/* Overlay untuk membuat background lebih gelap */}
      <div className="absolute inset-0 bg-black/35"></div>

      {/* Konten yang ada di atas overlay */}
      <div className="relative z-10 text-white text-2xl font-bold">
       
      </div>
    </div>
  );
};

export default DashboardHome;
