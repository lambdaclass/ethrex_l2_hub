import { createRoot } from 'react-dom/client'
import { Web3Provider } from "./config/Web3Provider.tsx";
import { BridgeConfigProvider, useBridgeConfig } from "./components/BridgeConfigContext.tsx";
import { BridgeConfigLoading } from "./components/BridgeConfigLoading.tsx";
import App from './App.tsx'
import './index.css'

const AppWithBridgeConfig = () => {
  const { l1BridgeAddress, isLoading, error } = useBridgeConfig();

  if (isLoading || !l1BridgeAddress) {
    return <BridgeConfigLoading error={error} />;
  }

  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <Web3Provider>
    <BridgeConfigProvider>
      <AppWithBridgeConfig />
    </BridgeConfigProvider>
  </Web3Provider>,
)
