import { createRoot } from 'react-dom/client'
import { Web3Provider } from "./Web3Provider";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <Web3Provider>
    <App />
  </Web3Provider>,
)
