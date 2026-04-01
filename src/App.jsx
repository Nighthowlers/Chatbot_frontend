import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <div className="h-screen w-full bg-[#0b1020] text-white">
        <Routes>
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;