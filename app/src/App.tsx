import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AddressContext } from "./components/AddressContext";
import { Home } from "./pages/Home";
import { Deposit } from "./pages/Deposit";
import { Withdraw } from "./pages/Withdraw";
import { AccountAbstraction } from "./pages/AccountAbstraction";

const App: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Router>
      <Header />

      <AddressContext>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bridge/deposit" element={<Deposit />} />
          <Route path="/bridge/withdraw" element={<Withdraw />} />
          <Route path="/passkey_demo" element={<AccountAbstraction />} />
        </Routes>
      </AddressContext>

      <Footer />
    </Router>
  </div>
);

export default App;
