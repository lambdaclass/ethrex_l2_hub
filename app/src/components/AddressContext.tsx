import { createContext, type ReactNode } from "react";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useNavigate, useLocation } from "react-router-dom";

interface ContextType {
  address: `0x${string}` | undefined;
}

const Context = createContext<ContextType | undefined>(undefined);

interface AddressProviderProps {
  children: ReactNode | ReactNode[];
}

export const AddressContext = ({ children }: AddressProviderProps) => {
  const { isConnected, isConnecting, address } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isConnecting) return;

    if (!isConnected && location.pathname !== "/") {
      navigate("/", { replace: true });
      return;
    }

    if (isConnected && location.pathname === "/") {
      navigate("/bridge/deposit", { replace: true });
      return;
    }
  }, [address, location.pathname, navigate, isConnected, isConnecting]);

  return <Context.Provider value={{ address }}>{children}</Context.Provider>;
};
