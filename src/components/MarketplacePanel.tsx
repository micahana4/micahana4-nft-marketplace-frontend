import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULE_MARKET, FN_LIST, FN_BUY, FN_CANCEL } from '../configs/constants';

export default function MarketplacePanel() {
	return (
		<section className="space-y-6">
			<h2 className="text-lg font-semibold">Marketplace</h2>
			<ListForSale />
			<BuyListing />
			<CancelListing />
		</section>
	);
}

function ListForSale() {
	const account = useCurrentAccount();
	const { mutateAsync, isPending } = useSignAndExecuteTransaction();
	const [objectId, setObjectId] = useState('');
	const [priceSui, setPriceSui] = useState('');
	const [msg, setMsg] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function onList(e: React.FormEvent) {
		e.preventDefault();
		setMsg(null);
		setError(null);
		if (!account?.address) return setError('Connect wallet');
		if (!PACKAGE_ID) return setError('Set PACKAGE_ID in env');
		if (!objectId) return setError('NFT object ID is required');
		const price = Number(priceSui);
		if (!Number.isFinite(price) || price <= 0) return setError('Enter a valid positive price');
		const priceMist = BigInt(Math.floor(price * 1e9));
		const tx = new Transaction();
		tx.moveCall({ target: `${PACKAGE_ID}::${MODULE_MARKET}::${FN_LIST}`, arguments: [tx.object(objectId), tx.pure.u64(priceMist)] });
		try {
			await mutateAsync({ signer: account.address, transaction: tx });
			setMsg('Listed for sale');
		} catch (e: any) {
			setError(e?.message || 'List failed');
		}
	}

	return (
		<div className="rounded border border-neutral-800 bg-neutral-900 p-4">
			<h3 className="mb-2 font-medium">List NFT for sale</h3>
			<form className="flex flex-col gap-2 sm:flex-row" onSubmit={onList}>
				<input className="flex-1 rounded border border-neutral-700 bg-neutral-950 p-2" placeholder="NFT objectId" value={objectId} onChange={(e) => setObjectId(e.target.value)} />
				<input className="w-40 rounded border border-neutral-700 bg-neutral-950 p-2" placeholder="Price (SUI)" value={priceSui} onChange={(e) => setPriceSui(e.target.value)} />
				<button disabled={isPending} className="rounded bg-indigo-600 px-4 py-2 font-medium disabled:opacity-50">{isPending ? 'Submitting…' : 'List'}</button>
			</form>
			{msg && <div className="mt-2 text-sm text-green-400">{msg}</div>}
			{error && <div className="mt-2 text-sm text-red-400">{error}</div>}
		</div>
	);
}

function BuyListing() {
	const account = useCurrentAccount();
	const { mutateAsync, isPending } = useSignAndExecuteTransaction();
	const [listingId, setListingId] = useState('');
	const [msg, setMsg] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function onBuy(e: React.FormEvent) {
		e.preventDefault();
		setMsg(null);
		setError(null);
		if (!account?.address) return setError('Connect wallet');
		if (!PACKAGE_ID) return setError('Set PACKAGE_ID in env');
		if (!listingId) return setError('Listing object ID is required');
		const tx = new Transaction();
		tx.moveCall({ target: `${PACKAGE_ID}::${MODULE_MARKET}::${FN_BUY}`, arguments: [tx.object(listingId)] });
		try {
			await mutateAsync({ signer: account.address, transaction: tx });
			setMsg('Purchase submitted');
		} catch (e: any) {
			setError(e?.message || 'Buy failed');
		}
	}

	return (
		<div className="rounded border border-neutral-800 bg-neutral-900 p-4">
			<h3 className="mb-2 font-medium">Buy a listed NFT</h3>
			<form className="flex flex-col gap-2 sm:flex-row" onSubmit={onBuy}>
				<input className="flex-1 rounded border border-neutral-700 bg-neutral-950 p-2" placeholder="Listing objectId" value={listingId} onChange={(e) => setListingId(e.target.value)} />
				<button disabled={isPending} className="rounded bg-emerald-600 px-4 py-2 font-medium disabled:opacity-50">{isPending ? 'Submitting…' : 'Buy'}</button>
			</form>
			{msg && <div className="mt-2 text-sm text-green-400">{msg}</div>}
			{error && <div className="mt-2 text-sm text-red-400">{error}</div>}
		</div>
	);
}

function CancelListing() {
	const account = useCurrentAccount();
	const { mutateAsync, isPending } = useSignAndExecuteTransaction();
	const [listingId, setListingId] = useState('');
	const [msg, setMsg] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function onCancel(e: React.FormEvent) {
		e.preventDefault();
		setMsg(null);
		setError(null);
		if (!account?.address) return setError('Connect wallet');
		if (!PACKAGE_ID) return setError('Set PACKAGE_ID in env');
		if (!listingId) return setError('Listing object ID is required');
		const tx = new Transaction();
		tx.moveCall({ target: `${PACKAGE_ID}::${MODULE_MARKET}::${FN_CANCEL}`, arguments: [tx.object(listingId)] });
		try {
			await mutateAsync({ signer: account.address, transaction: tx });
			setMsg('Cancel submitted');
		} catch (e: any) {
			setError(e?.message || 'Cancel failed');
		}
	}

	return (
		<div className="rounded border border-neutral-800 bg-neutral-900 p-4">
			<h3 className="mb-2 font-medium">Cancel a listing</h3>
			<form className="flex flex-col gap-2 sm:flex-row" onSubmit={onCancel}>
				<input className="flex-1 rounded border border-neutral-700 bg-neutral-950 p-2" placeholder="Listing objectId" value={listingId} onChange={(e) => setListingId(e.target.value)} />
				<button disabled={isPending} className="rounded bg-amber-600 px-4 py-2 font-medium disabled:opacity-50">{isPending ? 'Submitting…' : 'Cancel'}</button>
			</form>
			{msg && <div className="mt-2 text-sm text-green-400">{msg}</div>}
			{error && <div className="mt-2 text-sm text-red-400">{error}</div>}
		</div>
	);
}

