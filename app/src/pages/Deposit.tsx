import { useAccount } from "wagmi";
import { DepositForm } from "../components/Deposit/Form";

export const Bridge: React.FC = () => {
  const { isConnected, isDisconnected } = useAccount();

  if (isConnected) return <DepositForm />;

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
