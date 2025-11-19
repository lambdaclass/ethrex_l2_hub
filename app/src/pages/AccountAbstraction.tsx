import { useEffect, useState, useRef } from "react";
import { useSwitchChain } from "wagmi";
import { type Address } from "viem";
import { type CreateCredentialReturnType } from "webauthn-p256";
import Auth from "../components/AccountAbstraction/Auth";
import Dashboard, { type DashboardRef } from "../components/AccountAbstraction/Dashboard";
import MintModal from "../components/AccountAbstraction/MintModal";
import TransferModal from "../components/AccountAbstraction/TransferModal";

export const AccountAbstraction: React.FC = () => {
  const [address, setAddress] = useState<Address | null>(null);
  const [credential, setCredential] =
    useState<CreateCredentialReturnType | null>(null);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const dashboardRef = useRef<DashboardRef>(null);

  const { switchChain } = useSwitchChain();

  useEffect(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_L2_CHAIN_ID) });
  }, []);

  const handleAuthSuccess = (
    newAddress: Address,
    newCredential: CreateCredentialReturnType,
    newUsername?: string
  ) => {
    setAddress(newAddress);
    setCredential(newCredential);
    setUsername(newUsername);

    // Save to localStorage
    localStorage.setItem("passkey_address", newAddress);
    if (newUsername) {
      localStorage.setItem("passkey_username", newUsername);
    }
  };

  const handleLogout = () => {
    setAddress(null);
    setCredential(null);
    setUsername(undefined);

    // Keep username in localStorage for next login, but remove address
    localStorage.removeItem("passkey_address");
  };

  const handleMintSuccess = async () => {
    // Refresh balance and history after minting
    if (dashboardRef.current) {
      await dashboardRef.current.refreshBalance();
      dashboardRef.current.refreshHistory();
    }
  };

  const handleTransferSuccess = async () => {
    // Refresh balance and history after transfer
    if (dashboardRef.current) {
      await dashboardRef.current.refreshBalance();
      dashboardRef.current.refreshHistory();
    }
  };

  // Show Auth screen if not logged in
  if (!address || !credential) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Show Dashboard if logged in
  return (
    <>
      <Dashboard
        ref={dashboardRef}
        address={address}
        username={username}
        onLogout={handleLogout}
        onMintClick={() => setIsMintModalOpen(true)}
        onTransferClick={() => setIsTransferModalOpen(true)}
      />

      <MintModal
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
        address={address}
        credentialId={credential.id}
        onMintSuccess={handleMintSuccess}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        address={address}
        credentialId={credential.id}
        onTransferSuccess={handleTransferSuccess}
      />
    </>
  );
};
