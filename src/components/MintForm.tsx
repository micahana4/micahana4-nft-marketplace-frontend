import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULE_NFT, FN_MINT } from '../configs/constants';

export default function MintForm() {
	const account = useCurrentAccount();
	const { mutateAsync, isPending } = useSignAndExecuteTransaction();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus(null);
		setError(null);
		if (!account?.address) return setError('Connect wallet');
		if (!PACKAGE_ID) return setError('Set PACKAGE_ID in env');
		if (!name || !imageUrl) return setError('Name and image URL are required');
		const tx = new Transaction();
		tx.moveCall({
			target: `${PACKAGE_ID}::${MODULE_NFT}::${FN_MINT}`,
			arguments: [tx.pure.string(name), tx.pure.string(description), tx.pure.string(imageUrl)],
		});
		try {
			const res = await mutateAsync({
				signer: account.address,
				transaction: tx,
				options: { showEffects: true },
			});
			setStatus('Mint submitted');
		} catch (e: any) {
			setError(e?.message || 'Mint failed');
		}
	}

	return (
		<section>
			<h2 className="mb-2 text-lg font-semibold">Mint NFT</h2>
			<form className="grid grid-cols-1 gap-3 md:grid-cols-3" onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="Name"
					className="rounded border border-neutral-700 bg-neutral-950 p-2 outline-none"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Description"
					className="rounded border border-neutral-700 bg-neutral-950 p-2 outline-none"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<input
					type="url"
					placeholder="Image URL"
					className="rounded border border-neutral-700 bg-neutral-950 p-2 outline-none"
					value={imageUrl}
					onChange={(e) => setImageUrl(e.target.value)}
				/>
				<button
					type="submit"
					disabled={isPending}
					className="rounded bg-indigo-600 px-4 py-2 font-medium disabled:opacity-50"
				>
					{isPending ? 'Submitting…' : 'Mint'}
				</button>
			</form>
			{status && <div className="mt-2 text-sm text-green-400">{status}</div>}
			{error && <div className="mt-2 text-sm text-red-400">{error}</div>}
		</section>
	);
}

