import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface BridgeConfigContextType {
	l1BridgeAddress: `0x${string}` | undefined;
	isLoading: boolean;
	error: string | null;
}

const BridgeConfigContext = createContext<BridgeConfigContextType | undefined>(undefined);

interface BridgeConfigProviderProps {
	children: ReactNode | ReactNode[];
}

interface HealthResponse {
	l1_watcher?: {
		bridge_address?: string;
	};
}

export const BridgeConfigProvider = ({ children }: BridgeConfigProviderProps) => {
	const [l1BridgeAddress, setL1BridgeAddress] = useState<`0x${string}` | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		const fetchBridgeAddress = async () => {
			try {
				const response = await fetch('/api/health');

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data: HealthResponse = await response.json();
				const bridgeAddress = data?.l1_watcher?.bridge_address;

				if (!bridgeAddress) {
					throw new Error("Bridge address not found in health response");
				}

				console.log("L1 Bridge address:", bridgeAddress);

				setL1BridgeAddress(bridgeAddress as `0x${string}`);
				setIsLoading(false);
				setError(null);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
				console.log(`Failed to fetch bridge address (attempt ${retryCount + 1}):`, errorMessage);
				setError(errorMessage);

				// Calculate exponential backoff: 2s, 4s, 8s, then max at 10s
				const backoffDelay = Math.min(2000 * Math.pow(2, retryCount), 10000);

				setTimeout(() => {
					setRetryCount(prev => prev + 1);
				}, backoffDelay);
			}
		};

		if (!l1BridgeAddress) {
			fetchBridgeAddress();
		}
	}, [retryCount, l1BridgeAddress]);

	return (
		<BridgeConfigContext.Provider value={{ l1BridgeAddress, isLoading, error }}>
			{children}
		</BridgeConfigContext.Provider>
	);
};

export const useBridgeConfig = (): BridgeConfigContextType => {
	const context = useContext(BridgeConfigContext);

	if (context === undefined) {
		throw new Error("useBridgeConfig must be used within a BridgeConfigProvider");
	}

	return context;
};

