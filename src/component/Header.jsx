import { Menu } from "lucide-react";

function Header({ toggleSidebar, mode, setMode }) {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div>
          <p className="text-xs text-gray-400">AI WORKSPACE</p>
          <h1 className="text-sm font-semibold">Premium Assistant</h1>
        </div>
      </div>

      {/* Center - Mode Selector */}
      <div className="flex gap-2">
        {["normal", "coding", "interview"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              mode === m
                ? "bg-blue-500 text-white border border-blue-400"
                : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/15"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-sm">
            AC
          </div>
          <div className="text-xs">
            <p>Ava Carter</p>
            <p className="text-gray-400">@ava</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Header;