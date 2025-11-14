import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { AccountAbstraction } from "./pages/AccountAbstraction";
import { Deposit } from "./components/Deposit";
import { Withdraw } from "./components/Withdraw";
import { Footer } from "./components/Footer";

const App: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<>Welcome</>} />
        <Route path="/bridge/deposit" element={<Deposit />} />
        <Route path="/bridge/withdraw" element={<Withdraw />} />
        <Route path="/passkey_demo" element={<AccountAbstraction />} />
      </Routes>

      <Footer />
    </Router>
  </div>
);

export default App;
