import { motion } from "framer-motion";

function Sidebar({ collapsed }) {
  return (
    <motion.div
      animate={{ width: collapsed ? 70 : 250 }}
      className="bg-[#020617] border-r border-white/10 p-4 flex flex-col"
    >
      <h2 className="text-sm font-semibold mb-6">
        {collapsed ? "🤖" : "BotSpoof"}
      </h2>

      <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-sm">
        {collapsed ? "+" : "+ New Chat"}
      </button>
    </motion.div>
  );
}

export default Sidebar;