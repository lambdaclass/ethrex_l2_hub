import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { AccountAbstraction } from "./pages/AccountAbstraction";
import { DepositForm } from "./components/Deposit/Form";
import { Withdraw } from "./components/Withdraw";
import { Footer } from "./components/Footer";
// import { Deposit } from "./components/Deposit/Deposit";

const App: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <Router>
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <Routes>
          <Route path="/" element={<>Welcome</>} />
          {/* <Route path="/bridge/deposit" element={<Deposit />} /> */}
          <Route path="/bridge/deposit" element={<DepositForm />} />
          <Route path="/bridge/withdraw" element={<Withdraw />} />
          <Route path="/passkey_demo" element={<AccountAbstraction />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  </div>
);

export default App;
