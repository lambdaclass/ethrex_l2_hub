import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bridge } from "./pages/Bridge";
import { Header } from "./components/Header";
import { AccountAbstraction } from "./pages/AccountAbstraction";


const App: React.FC = () =>
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <Router>
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Bridge />} />
          <Route path="/bridge" element={<Bridge />} />
          <Route path="/passkey_demo" element={<AccountAbstraction />} />
        </Routes>
      </main>
    </Router>
  </div >

export default App;
