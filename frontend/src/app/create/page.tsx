'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import NFT_ABI from '@/abis/NFT.json';

// Contract addresses - update with your deployed contracts
const NFT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type MintType = 'digital' | 'existing' | 'physical';
type TxStatus = 'idle' | 'uploading' | 'approving' | 'minting' | 'saving' | 'success' | 'error';

interface FormData {
    name: string;
    ticker: string;
    description: string;
    rarity: string;
    sector: string;
    material: string;
    engine: string;
    xProfile: string;
    discord: string;
    website: string;
    royalty: number;
    contractAddress: string;
    tokenId: string;
}

export default function ProductionCreatorStudio() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [mintType, setMintType] = useState<MintType>('digital');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        ticker: '',
        description: '',
        rarity: 'Common',
        sector: 'Industrial',
        material: 'Graphene',
        engine: 'Fusion v1',
        xProfile: '',
        discord: '',
        website: '',
        royalty: 5,
        contractAddress: '',
        tokenId: '',
    });

    // Transaction state
    const [txStatus, setTxStatus] = useState<TxStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    // Read mint price from contract
    const { data: mintPrice } = useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mintPrice',
    });


    // Read payment token address from contract
    const { data: paymentTokenAddress } = useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'paymentToken',
    });

    // Check allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: paymentTokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: address && NFT_CONTRACT_ADDRESS ? [address, NFT_CONTRACT_ADDRESS] : undefined,
        query: {
            enabled: !!paymentTokenAddress && !!address && NFT_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
        },
    });

    // Approve tokens
    const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
    const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveHash,
    });

    // Mint NFT
    const { writeContract: mint, data: mintHash, isPending: isMinting } = useWriteContract();
    const { isLoading: isMintLoading, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
        hash: mintHash,
    });

    // Handle approval success
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
            handleMint();
        }
    }, [isApproveSuccess]);

    // Handle mint success
    useEffect(() => {
        if (isMintSuccess && mintHash) {
            saveToDatabase(mintHash);
        }
    }, [isMintSuccess, mintHash]);

    // Handle file selection with preview
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Create preview for images
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setFilePreview(null);
            }
        }
    };

    // Update form field
    const updateField = (field: keyof FormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Validate form
    const validateForm = (): string | null => {
        if (!formData.name.trim()) return 'Asset name is required';
        if (!formData.ticker.trim()) return 'Token symbol is required';
        if (formData.ticker.length > 10) return 'Token symbol must be 10 characters or less';
        if (mintType !== 'existing' && !file) return 'Please upload a file';
        if (mintType === 'existing') {
            if (!formData.contractAddress.trim()) return 'Contract address is required';
            if (!formData.tokenId.trim()) return 'Token ID is required';
        }
        return null;
    };

    // Upload file to backend/IPFS
    const uploadFile = async (): Promise<string> => {
        if (!file) throw new Error('No file selected');

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('name', formData.name);

        // For now, create a mock IPFS-style URL
        // In production, upload to IPFS or your storage service
        const mockIpfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        const imageUrl = `https://ipfs.io/ipfs/${mockIpfsHash}`;

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return imageUrl;
    };

    // Handle approval
    const handleApprove = async () => {
        if (!paymentTokenAddress || !mintPrice) return;

        setTxStatus('approving');
        setErrorMessage(null);

        try {
            approve({
                address: paymentTokenAddress as `0x${string}`,
                abi: erc20Abi,
                functionName: 'approve',
                args: [NFT_CONTRACT_ADDRESS, mintPrice as bigint],
            });
        } catch (error: unknown) {
            setTxStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Approval failed');
        }
    };

    // Handle mint
    const handleMint = async () => {
        setTxStatus('minting');
        setErrorMessage(null);

        try {
            mint({
                address: NFT_CONTRACT_ADDRESS,
                abi: NFT_ABI,
                functionName: 'mint',
                args: [BigInt(1)], // Mint 1 NFT
            });
        } catch (error: unknown) {
            setTxStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Minting failed');
        }
    };

    // Save to database
    const saveToDatabase = async (txHash: string) => {
        setTxStatus('saving');

        try {
            const response = await fetch(`${API_URL}/api/assets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    type: formData.sector,
                    value: mintPrice ? parseFloat((Number(mintPrice) / 1e18).toFixed(4)) : 0,
                    rarity: formData.rarity,
                    image: uploadedImageUrl || filePreview || '/tokens/placeholder.png',
                }),
            });

            if (!response.ok) {
                console.warn('Failed to save to database, but mint was successful');
            }

            // Store data for success page
            const assetData = {
                name: formData.name.toUpperCase().replace(/\s+/g, '_'),
                ticker: formData.ticker.toUpperCase(),
                hash: txHash,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                rarity: formData.rarity.toUpperCase(),
                sector: formData.sector.toUpperCase().replace(/\s+/g, '_'),
                engine: formData.engine.toUpperCase().replace(/\s+/g, '_'),
                image: uploadedImageUrl || filePreview,
            };
            localStorage.setItem('lastAsset', JSON.stringify(assetData));

            setTxStatus('success');
            router.push('/create/success');
        } catch (error) {
            // Still redirect on success even if DB save fails
            const assetData = {
                name: formData.name.toUpperCase().replace(/\s+/g, '_'),
                ticker: formData.ticker.toUpperCase(),
                hash: txHash,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                rarity: formData.rarity.toUpperCase(),
                sector: formData.sector.toUpperCase().replace(/\s+/g, '_'),
                engine: formData.engine.toUpperCase().replace(/\s+/g, '_'),
                image: uploadedImageUrl || filePreview,
            };
            localStorage.setItem('lastAsset', JSON.stringify(assetData));
            router.push('/create/success');
        }
    };

    // Main create handler
    const handleCreate = async () => {
        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        if (!isConnected) {
            setErrorMessage('Please connect your wallet first');
            return;
        }

        setErrorMessage(null);

        try {
            // Step 1: Upload file
            if (mintType !== 'existing') {
                setTxStatus('uploading');
                const imageUrl = await uploadFile();
                setUploadedImageUrl(imageUrl);
            }

            // Step 2: Check if approval is needed
            const needsApproval = mintPrice && allowance !== undefined && (allowance as bigint) < (mintPrice as bigint);

            if (needsApproval) {
                await handleApprove();
            } else {
                await handleMint();
            }
        } catch (error: unknown) {
            setTxStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Creation failed');
        }
    };

    // Get button state
    const getButtonState = () => {
        if (!isConnected) return { text: 'Connect Wallet First', disabled: true };
        if (txStatus === 'uploading') return { text: 'Uploading...', disabled: true };
        if (txStatus === 'approving' || isApproving || isApproveLoading) return { text: 'Approving...', disabled: true };
        if (txStatus === 'minting' || isMinting || isMintLoading) return { text: 'Minting...', disabled: true };
        if (txStatus === 'saving') return { text: 'Saving...', disabled: true };
        return { text: 'Create Asset', disabled: false };
    };

    const buttonState = getButtonState();
    const isLoading = txStatus !== 'idle' && txStatus !== 'error' && txStatus !== 'success';

    return (
        <main className="min-h-screen bg-black text-white pt-24 lg:pt-32 pb-20">
            <Navbar currentView="terminal" onViewChange={() => { }} />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-0 border border-white/10 bg-zinc-950">

                {/* LEFT PANEL */}
                <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-white/10 p-6 md:p-10 space-y-10">
                    <header className="flex justify-between items-start">
                        <div>
                            <h2 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-2">Asset Creator v4.0</h2>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">Create Asset</h1>
                        </div>
                        {/* Wallet Connection */}
                        <div className="shrink-0">
                            <ConnectButton.Custom>
                                {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
                                    const connected = mounted && account && chain;
                                    return (
                                        <button
                                            onClick={connected ? openAccountModal : openConnectModal}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${connected
                                                ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                                                : 'border-blue-500/30 text-blue-500 hover:bg-blue-500/10'
                                                }`}
                                        >
                                            {connected ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Connect'}
                                        </button>
                                    );
                                }}
                            </ConnectButton.Custom>
                        </div>
                    </header>

                    {/* Error Message */}
                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                            >
                                <span className="text-red-500 text-lg">!</span>
                                <span className="text-red-400 text-[11px] font-mono flex-1">{errorMessage}</span>
                                <button onClick={() => setErrorMessage(null)} className="text-zinc-500 hover:text-white">×</button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* WORKFLOW SELECTOR */}
                    <div className="flex flex-wrap gap-px bg-white/10 border border-white/10">
                        {(['digital', 'existing', 'physical'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => { setMintType(type); setFile(null); setFilePreview(null); }}
                                className={`flex-1 min-w-[120px] py-4 text-[10px] font-black uppercase tracking-widest transition-all ${mintType === type ? 'bg-blue-600 text-white' : 'bg-black text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
                            >
                                {type === 'existing' ? 'Import NFT' : type === 'physical' ? 'Physical Art' : 'New Mint'}
                            </button>
                        ))}
                    </div>

                    {/* CORE IDENTITY SECTION */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[9px] text-zinc-600 font-black uppercase">Asset Title *</label>
                            <input
                                placeholder="Void Unit 7A"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="w-full bg-black border border-white/10 p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] text-zinc-600 font-black uppercase">Token Symbol ($) *</label>
                            <input
                                placeholder="VOID"
                                value={formData.ticker}
                                onChange={(e) => updateField('ticker', e.target.value.toUpperCase())}
                                maxLength={10}
                                className="w-full bg-black border border-white/10 p-4 text-sm font-mono font-bold outline-none focus:border-blue-500 uppercase transition-all"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[9px] text-zinc-600 font-black uppercase">Description</label>
                            <textarea
                                rows={4}
                                placeholder="Describe your asset..."
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                className="w-full bg-black border border-white/10 p-4 text-xs font-medium outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                    </section>

                    {/* MEDIA INGESTION ZONE */}
                    <div className="relative border border-white/10 bg-black min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                        <AnimatePresence mode="wait">
                            {mintType === 'existing' && (
                                <motion.div key="existing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md space-y-4">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase mb-4">Import from Contract</p>
                                    <input
                                        placeholder="Contract Address (0x...)"
                                        value={formData.contractAddress}
                                        onChange={(e) => updateField('contractAddress', e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 p-4 text-xs font-mono outline-none focus:border-blue-500"
                                    />
                                    <input
                                        placeholder="Token ID"
                                        value={formData.tokenId}
                                        onChange={(e) => updateField('tokenId', e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 p-4 text-xs font-mono outline-none focus:border-blue-500"
                                    />
                                </motion.div>
                            )}
                            {mintType !== 'existing' && filePreview && (
                                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                                    <img src={filePreview} alt="Preview" className="max-h-[350px] max-w-full object-contain border border-white/10" />
                                    <button
                                        onClick={() => { setFile(null); setFilePreview(null); }}
                                        className="absolute top-2 right-2 p-2 bg-black/80 border border-white/20 text-white hover:bg-red-600 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <p className="mt-4 text-[10px] text-zinc-500 font-mono">{file?.name}</p>
                                </motion.div>
                            )}
                            {mintType !== 'existing' && !filePreview && (
                                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <div className="w-20 h-20 bg-zinc-900 border border-white/10 mx-auto flex items-center justify-center">
                                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest mb-2">
                                            Upload {mintType.charAt(0).toUpperCase() + mintType.slice(1)}
                                        </p>
                                        <p className="text-[9px] text-zinc-600 font-mono italic">JPG, PNG, GLB, MP4 // Max 100MB</p>
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-10 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        Browse Files
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*,video/*,.glb,.gltf"
                                        className="hidden"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <aside className="lg:col-span-5 p-6 md:p-10 space-y-10 bg-black">

                    {/* ASSET DETAILS */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 border-b border-white/10 pb-2">Asset Details</h3>
                        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                            <div className="bg-black p-4 space-y-1">
                                <label className="text-[8px] text-zinc-600 font-black uppercase block mb-2">Rarity</label>
                                <select
                                    value={formData.rarity}
                                    onChange={(e) => updateField('rarity', e.target.value)}
                                    className="w-full bg-transparent text-[10px] font-black uppercase outline-none text-blue-500 cursor-pointer"
                                >
                                    {['Common', 'Rare', 'Epic', 'Legendary', 'Artifact'].map(opt => (
                                        <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="bg-black p-4 space-y-1">
                                <label className="text-[8px] text-zinc-600 font-black uppercase block mb-2">Sector</label>
                                <select
                                    value={formData.sector}
                                    onChange={(e) => updateField('sector', e.target.value)}
                                    className="w-full bg-transparent text-[10px] font-black uppercase outline-none text-blue-500 cursor-pointer"
                                >
                                    {['Industrial', 'Cyber', 'Deep Void', 'Organic', 'Military'].map(opt => (
                                        <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="bg-black p-4 space-y-1">
                                <label className="text-[8px] text-zinc-600 font-black uppercase block mb-2">Material</label>
                                <select
                                    value={formData.material}
                                    onChange={(e) => updateField('material', e.target.value)}
                                    className="w-full bg-transparent text-[10px] font-black uppercase outline-none text-blue-500 cursor-pointer"
                                >
                                    {['Graphene', 'Chrome', 'Liquid Neon', 'Titanium', 'Plasma'].map(opt => (
                                        <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="bg-black p-4 space-y-1">
                                <label className="text-[8px] text-zinc-600 font-black uppercase block mb-2">Engine</label>
                                <select
                                    value={formData.engine}
                                    onChange={(e) => updateField('engine', e.target.value)}
                                    className="w-full bg-transparent text-[10px] font-black uppercase outline-none text-blue-500 cursor-pointer"
                                >
                                    {['Fusion v1', 'Warp Core', 'Quantum Drive', 'Static Pulse'].map(opt => (
                                        <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* SOCIAL LINKS */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 border-b border-white/10 pb-2">Social Links</h3>
                        <div className="space-y-3">
                            <div className="flex border border-white/10 bg-zinc-900">
                                <span className="p-3 border-r border-white/10 text-[8px] font-black text-zinc-500 w-24 flex items-center bg-black/30 shrink-0">X Profile</span>
                                <input
                                    placeholder="twitter.com/username"
                                    value={formData.xProfile}
                                    onChange={(e) => updateField('xProfile', e.target.value)}
                                    className="flex-1 bg-transparent p-3 text-[10px] font-mono outline-none focus:text-blue-400"
                                />
                            </div>
                            <div className="flex border border-white/10 bg-zinc-900">
                                <span className="p-3 border-r border-white/10 text-[8px] font-black text-zinc-500 w-24 flex items-center bg-black/30 shrink-0">Discord</span>
                                <input
                                    placeholder="discord.gg/invite"
                                    value={formData.discord}
                                    onChange={(e) => updateField('discord', e.target.value)}
                                    className="flex-1 bg-transparent p-3 text-[10px] font-mono outline-none focus:text-blue-400"
                                />
                            </div>
                            <div className="flex border border-white/10 bg-zinc-900">
                                <span className="p-3 border-r border-white/10 text-[8px] font-black text-zinc-500 w-24 flex items-center bg-black/30 shrink-0">Website</span>
                                <input
                                    placeholder="https://project-site.io"
                                    value={formData.website}
                                    onChange={(e) => updateField('website', e.target.value)}
                                    className="flex-1 bg-transparent p-3 text-[10px] font-mono outline-none focus:text-blue-400"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ROYALTIES */}
                    <section className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 border-b border-white/10 pb-2">Royalties</h3>
                        <div className="flex items-center justify-between bg-zinc-900 border border-white/10 p-5 transition-all hover:border-white/20">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Secondary Royalty</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={formData.royalty}
                                    onChange={(e) => updateField('royalty', parseInt(e.target.value) || 0)}
                                    min={0}
                                    max={25}
                                    className="bg-transparent text-xl font-black text-white w-12 text-right outline-none"
                                />
                                <span className="text-blue-500 font-bold">%</span>
                            </div>
                        </div>
                    </section>

                    {/* MINT PRICE INFO */}
                    {mintPrice && (
                        <div className="p-4 bg-zinc-900/50 border border-white/10">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-zinc-500 uppercase">Mint Price</span>
                                <span className="text-white font-bold">{(Number(mintPrice) / 1e18).toFixed(4)} Tokens</span>
                            </div>
                        </div>
                    )}

                    {/* FINALIZATION */}
                    <div className="pt-6">
                        <button
                            onClick={handleCreate}
                            disabled={buttonState.disabled}
                            className={`w-full py-6 font-black uppercase tracking-[0.4em] text-[11px] transition-all flex items-center justify-center gap-3
                                ${buttonState.disabled
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)]'
                                }`}
                        >
                            {isLoading && (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            {buttonState.text}
                        </button>
                        <div className="mt-4 flex justify-between text-[9px] font-mono text-zinc-600 uppercase">
                            <span>Network Fee: ~0.002 ETH</span>
                            <span>Status: {txStatus === 'idle' ? 'Ready' : txStatus.charAt(0).toUpperCase() + txStatus.slice(1)}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
