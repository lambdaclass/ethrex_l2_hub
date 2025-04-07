import { useEffect, useState } from "react";
import { useSwitchChain } from "wagmi";
import { client } from "../config/passkey_config";
import { type Address } from "viem";
import { type CreateCredentialReturnType } from "webauthn-p256";
import MintCard from "../components/AccountAbstraction/MintCard";
import TransferCard from "../components/AccountAbstraction/TransferCard";
import AccountCard from "../components/AccountAbstraction/AccountCard";

export const AccountAbstraction: React.FC = () => {
  const [address, setAddress] = useState<Address | null>(null);
  const [credential, setCredential] =
    useState<CreateCredentialReturnType | null>(null);

  const { switchChain } = useSwitchChain();
  useEffect(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_L2_CHAIN_ID) });
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl my-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Passkey Demo</h2>
      <p className="text-lg text-gray-800">
        This page demonstrates the use of the Account Abstraction feature on
        Ethrex.
      </p>
      <br />
      <AccountCard
        address={address}
        setAddress={setAddress}
        credential={credential}
        setCredential={setCredential}
      />
      <br />
      <MintCard client={client} address={address} />
      <br />
      <TransferCard
        address={address}
        client={client}
        credentialId={credential?.id || null}
      />
    </div>
  );
};
