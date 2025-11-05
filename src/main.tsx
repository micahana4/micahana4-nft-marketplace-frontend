import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mysten/dapp-kit/dist/index.css';
import App from './App.tsx'
import { WalletProvider } from '@mysten/dapp-kit'
import { SuiClientProvider } from '@mysten/dapp-kit'
import { getSuiClientProviderProps } from './configs/sui'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SuiClientProvider {...getSuiClientProviderProps()}>
			<WalletProvider autoConnect>
				<App />
			</WalletProvider>
		</SuiClientProvider>
	</StrictMode>,
)
