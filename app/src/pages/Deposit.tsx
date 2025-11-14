import { useAccount, useSwitchChain } from "wagmi";
import { Deposit } from "../components/Deposit";
import { useEffect } from "react";

export const Bridge: React.FC = () => {
  const { isConnected, isDisconnected } = useAccount();

  if (isConnected) return <Deposit />;

  if (isDisconnected)
    return (
      <p className="text-xl text-gray-600">
        Connect your wallet to get started.
      </p>
    );

  return (
    <p className="text-xl text-gray-600">
      You must be connected to a valid network
    </p>
  );
};
