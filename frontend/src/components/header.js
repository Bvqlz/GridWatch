export default function Header() {
  return (
    <div className="bg-[#123D5F] text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">GridWatch</h1>
            <p className="text-[#A7B6B5]">NextEra's Drone Optimizer</p>
          </div>
          <img 
            src="/NextEra_Logo.png" 
            alt="NextEra Logo" 
            className="h-20 w-auto object-contain opacity-90 -my-2"
          />
        </div>
      </div>
    </div>
  );
}