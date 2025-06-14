import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bridge } from "./pages/Bridge";
import { Header } from "./components/Header";
import { AccountAbstraction } from "./pages/AccountAbstraction";
import { Deposit } from "./components/Deposit";
import { Withdraw } from "./components/Withdraw";


const App: React.FC = () =>
  <div className="min-h-screen bg-gray-100 flex flex-col">
    <Router>
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <Routes>
          <Route path="/" element={<>Welcome</>} />
          <Route path="/bridge/deposit" element={<Deposit />} />
          <Route path="/bridge/withdraw" element={<Withdraw />} />
          <Route path="/passkey_demo" element={<AccountAbstraction />} />
        </Routes>
      </main>
    </Router>
  </div >

export default App;
