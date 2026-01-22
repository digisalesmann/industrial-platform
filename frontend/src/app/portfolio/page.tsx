"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

import { assets, users } from "@/lib/api";
import { Pencil } from "lucide-react";

export default function PortfolioPage() {
    const { isLoggedIn, authenticateWallet, isLoading: authLoading } = useAuth();
    // Editable profile fields
    const [editMode, setEditMode] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [profileSaveLoading, setProfileSaveLoading] = useState(false);
    const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
    const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
    // Wallet connection
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState("Items");
    const [selectedNft, setSelectedNft] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const [filterRarity, setFilterRarity] = useState<string[]>([]);
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [pfpImage, setPfpImage] = useState<string | null>(null);

    const bannerInput = useRef<HTMLInputElement>(null);
    const pfpInput = useRef<HTMLInputElement>(null);

    // Portfolio state
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Listing modal state
    const [listingPrice, setListingPrice] = useState("");
    const [listingLoading, setListingLoading] = useState(false);
    const [listingError, setListingError] = useState<string | null>(null);
    const [listingSuccess, setListingSuccess] = useState(false);

    // User profile state
    const [profile, setProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Prompt authentication if wallet is connected but not logged in
    useEffect(() => {
        if (isConnected && !isLoggedIn && !authLoading) {
            authenticateWallet().catch(() => { });
        }
    }, [isConnected, isLoggedIn, authLoading, authenticateWallet]);

    // Fetch assets
    const fetchAssets = () => {
        setLoading(true);
        setError(null);
        assets
            .getMine()
            .then((data) => setCollections(data))
            .catch((err) => setError(err.message || "Failed to load assets"))
            .finally(() => setLoading(false));
    };

    // Fetch user profile
    useEffect(() => {
        if (!isLoggedIn) return;
        setProfileLoading(true);
        setProfileError(null);
        users
            .getProfile()
            .then((data) => {
                setProfile(data);
                setDisplayName(data.display_name || "");
                setUsername(data.username || "");
                setBio(data.bio || "");
            })
            .catch((err) => setProfileError(err.message || "Failed to load profile"))
            .finally(() => setProfileLoading(false));
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isConnected) return;
        fetchAssets();
    }, [isConnected]);

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (val: string) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setter(URL.createObjectURL(file));
        }
    };

    // Handler for edit button
    const handleEditProfile = async () => {
        if (!isLoggedIn) {
            try {
                await authenticateWallet();
            } catch (err) {
                setProfileSaveError("Authentication required to edit profile.");
                return;
            }
        }
        setEditMode(true);
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white pb-20 font-sans selection:bg-blue-500/30">
            <Navbar currentView="marketplace" onViewChange={() => { }} />

            {/* 1. IDENTITY HEADER */}
            <section className="relative pt-16">
                {/* Banner Area */}
                <div
                    className="h-40 md:h-64 bg-zinc-900 border-b border-white/5 relative cursor-pointer group overflow-hidden"
                    onClick={() => bannerInput.current?.click()}
                >
                    {bannerImage ? (
                        <img src={bannerImage} className="w-full h-full object-cover" alt="Banner" />
                    ) : (
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white text-black px-4 py-2">Change Background</span>
                    </div>
                    <input type="file" ref={bannerInput} className="hidden" onChange={(e) => handleImageUpload(e, setBannerImage)} />
                </div>

                {/* Profile Info Overlay */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 md:-mt-16">
                        {/* Avatar */}
                        <div
                            className="w-24 h-24 md:w-40 md:h-40 bg-[#0a0a0a] border-4 border-[#050505] relative group cursor-pointer overflow-hidden"
                            onClick={() => pfpInput.current?.click()}
                        >
                            {pfpImage ? (
                                <img src={pfpImage} className="w-full h-full object-cover" alt="PFP" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-4xl bg-blue-600">P</div>
                            )}
                            <div className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-[8px] font-black uppercase p-4 text-center">Update Picture</div>
                            <input type="file" ref={pfpInput} className="hidden" onChange={(e) => handleImageUpload(e, setPfpImage)} />
                        </div>

                        {/* Text Details + Editable Fields */}
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                                    {profileLoading ? 'Loading...' : displayName || (profile?.wallet_address ? `User_${profile.wallet_address.slice(2, 8)}` : 'Not Connected')}
                                </h1>
                                <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse border-2 border-emerald-500/20' : 'bg-zinc-600 border-2 border-zinc-700'}`} />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">{profile?.wallet_address ? `Address: ${profile.wallet_address}` : ''}</span>
                                {editMode ? (
                                    <input
                                        className="text-xs font-mono bg-zinc-900 border-b border-blue-500 px-2 py-1 text-white outline-none"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Username"
                                        maxLength={50}
                                    />
                                ) : (
                                    username && <span className="text-xs font-mono text-blue-400 ml-2">@{username}</span>
                                )}
                            </div>
                            <div className="mt-2">
                                {editMode ? (
                                    <textarea
                                        className="w-full bg-zinc-900 border-b border-blue-500 px-2 py-1 text-white outline-none text-xs"
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        placeholder="Bio"
                                        maxLength={300}
                                        rows={2}
                                    />
                                ) : (
                                    bio && <p className="text-xs text-zinc-400 mt-1">{bio}</p>
                                )}
                            </div>
                            <div className="mt-2 flex gap-2">
                                {/* Authenticate button removed: authentication is now automatic on wallet connect */}
                                {isConnected && isLoggedIn && (
                                    <button
                                        className="flex items-center gap-2 px-2 py-1 bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:text-blue-400 hover:border-blue-500 rounded-full shadow-sm transition-all"
                                        onClick={handleEditProfile}
                                        title="Edit Profile"
                                    >
                                        <Pencil size={18} strokeWidth={2.2} />
                                        Edit
                                    </button>
                                )}
                                {profileSaveError && <span className="text-xs text-red-500 ml-2">{profileSaveError}</span>}
                                {profileSaveSuccess && <span className="text-xs text-emerald-500 ml-2">Profile updated!</span>}
                                {/* PROFILE EDIT MODAL */}
                                <AnimatePresence>
                                    {editMode && (
                                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {
                                                setEditMode(false);
                                                setDisplayName(profile?.display_name || "");
                                                setUsername(profile?.username || "");
                                                setBio(profile?.bio || "");
                                                setProfileSaveError(null);
                                            }} className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/95 via-[#10111a]/90 to-[#050505]/95 backdrop-blur-[2px]" />
                                            <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }} className="relative w-full max-w-md bg-gradient-to-br from-[#10111a] via-[#0a0a0a] to-[#050505] border border-blue-900/30 shadow-2xl p-8 md:p-10 rounded-2xl overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-80" />
                                                <header className="mb-8 flex justify-between items-center">
                                                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Edit Profile</h2>
                                                    <button onClick={() => {
                                                        setEditMode(false);
                                                        setDisplayName(profile?.display_name || "");
                                                        setUsername(profile?.username || "");
                                                        setBio(profile?.bio || "");
                                                        setProfileSaveError(null);
                                                    }} className="text-zinc-400 hover:text-white font-mono text-sm tracking-tighter bg-zinc-900/80 px-3 py-1 rounded transition-all">Cancel</button>
                                                </header>
                                                <form className="space-y-6" onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    if (!isLoggedIn) {
                                                        setProfileSaveError("You must authenticate to save changes.");
                                                        return;
                                                    }
                                                    setProfileSaveLoading(true);
                                                    setProfileSaveError(null);
                                                    setProfileSaveSuccess(false);
                                                    try {
                                                        const updated = await users.updateProfile({ display_name: displayName, username, bio });
                                                        setProfile(updated);
                                                        setEditMode(false);
                                                        setProfileSaveSuccess(true);
                                                    } catch (err: any) {
                                                        setProfileSaveError(err.message || 'Failed to update profile');
                                                    } finally {
                                                        setProfileSaveLoading(false);
                                                    }
                                                }}>
                                                    <div>
                                                        <label className="block text-xs font-bold text-zinc-400 mb-1">Display Name</label>
                                                        <input
                                                            className="w-full text-lg font-bold bg-zinc-900 border border-blue-500 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                            value={displayName}
                                                            onChange={e => setDisplayName(e.target.value)}
                                                            placeholder="Display Name"
                                                            maxLength={100}
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-zinc-400 mb-1">Username</label>
                                                        <input
                                                            className="w-full text-base font-mono bg-zinc-900 border border-blue-500 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                            value={username}
                                                            onChange={e => setUsername(e.target.value)}
                                                            placeholder="Username"
                                                            maxLength={50}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-zinc-400 mb-1">Bio</label>
                                                        <textarea
                                                            className="w-full bg-zinc-900 border border-blue-500 rounded px-3 py-2 text-white outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all min-h-[60px]"
                                                            value={bio}
                                                            onChange={e => setBio(e.target.value)}
                                                            placeholder="Bio"
                                                            maxLength={300}
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <div className="flex gap-3 mt-4">
                                                        <button
                                                            type="submit"
                                                            className="flex-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50"
                                                            disabled={profileSaveLoading}
                                                        >{profileSaveLoading ? 'Saving...' : 'Save Changes'}</button>
                                                        <button
                                                            type="button"
                                                            className="flex-1 py-3 bg-zinc-700 text-white text-sm font-bold rounded-lg hover:bg-zinc-600 transition-all"
                                                            onClick={() => {
                                                                setEditMode(false);
                                                                setDisplayName(profile?.display_name || "");
                                                                setUsername(profile?.username || "");
                                                                setBio(profile?.bio || "");
                                                                setProfileSaveError(null);
                                                            }}
                                                        >Cancel</button>
                                                    </div>
                                                    {profileSaveError && <div className="text-xs text-red-500 mt-2">{profileSaveError}</div>}
                                                </form>
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="flex gap-8 border-l border-white/5 pl-8 hidden xl:flex pb-2">
                            <div>
                                <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Rank</p>
                                <p className="text-lg font-mono font-bold">{profile?.rank ?? '--'}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Total Items</p>
                                <p className="text-lg font-mono font-bold">{collections.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. MAIN CONTENT AREA */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 md:mt-24">

                {/* Tabs */}
                <div className="flex gap-8 border-b border-white/5 overflow-x-auto no-scrollbar mb-10">
                    {['Items', 'Offers', 'Activity', 'Listed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative shrink-0 ${activeTab === tab ? 'text-blue-500' : 'text-zinc-600 hover:text-white'}`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" />}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Filters Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-10">
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-4 flex items-center gap-2">
                                <div className="w-1 h-1 bg-zinc-700" /> Status
                            </h3>
                            <div className="flex flex-col border border-white/5 divide-y divide-white/5">
                                {['Buy Now', 'Auction', 'New'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])}
                                        className={`p-4 text-left text-[9px] font-black uppercase tracking-widest transition-all flex justify-between items-center ${filterStatus.includes(status) ? 'bg-blue-600 text-white' : 'bg-[#0a0a0a] text-zinc-500 hover:bg-zinc-900'}`}
                                    >
                                        {status}
                                        {filterStatus.includes(status) && <span className="text-[12px]">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-6 flex items-center gap-2">
                                <div className="w-1 h-1 bg-zinc-700" /> Rarity
                            </h3>
                            <div className="space-y-4">
                                {['Legendary', 'Epic', 'Rare', 'Common'].map(r => (
                                    <div key={r} onClick={() => setFilterRarity(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])} className="flex items-center justify-between group cursor-pointer">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${filterRarity.includes(r) ? 'text-blue-500' : 'text-zinc-600 group-hover:text-white'}`}>{r}</span>
                                        <div className={`w-4 h-4 border transition-all flex items-center justify-center ${filterRarity.includes(r) ? 'bg-blue-600 border-blue-600' : 'border-white/10 group-hover:border-zinc-500'}`}>
                                            {filterRarity.includes(r) && <span className="text-[10px] text-white font-bold">✓</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>

                    {/* Grid Area */}
                    <div className="lg:col-span-9 min-h-[200px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {loading && (
                            <div className="col-span-full flex justify-center items-center py-20 text-zinc-400 text-lg">Loading assets...</div>
                        )}
                        {error && (
                            <div className="col-span-full flex justify-center items-center py-20 text-red-500 text-lg">{error}</div>
                        )}
                        {!loading && !error && collections.length === 0 && (
                            <div className="col-span-full flex justify-center items-center py-20 text-zinc-500 text-lg">No assets found in your portfolio.</div>
                        )}
                        {!loading && !error && collections.map((nft) => (
                            <motion.div
                                key={nft.id}
                                layout
                                className="bg-[#0a0a0a] border border-white/5 flex flex-col group hover:border-blue-500/40 transition-all"
                            >
                                <div className="aspect-square bg-zinc-900 relative overflow-hidden shrink-0">
                                    <div className="w-full h-full flex items-center justify-center text-zinc-800 text-5xl font-black">#{nft.id}</div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/80 backdrop-blur-md px-2 py-1 text-[8px] font-black text-blue-400 border border-white/10 uppercase tracking-widest">{nft.type?.replace(/_/g, ' ')}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedNft(nft)}
                                        className="absolute inset-x-0 bottom-0 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-all duration-300"
                                    >
                                        List Item
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xs font-black uppercase tracking-tight truncate w-[60%] text-white">{nft.name}</h4>
                                        <p className="text-xs font-mono font-bold text-emerald-500">{nft.floor || nft.value || ''}</p>
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{nft.rarity}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* LISTING MODAL */}
            <AnimatePresence>
                {selectedNft && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {
                            setSelectedNft(null);
                            setListingPrice('');
                            setListingError(null);
                            setListingSuccess(false);
                        }} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-8 md:p-12 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
                            <header className="mb-12 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-3">List Item</p>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white">{selectedNft.name}</h2>
                                </div>
                                <button onClick={() => {
                                    setSelectedNft(null);
                                    setListingPrice('');
                                    setListingError(null);
                                    setListingSuccess(false);
                                }} className="text-zinc-600 hover:text-white font-mono text-sm tracking-tighter bg-zinc-900 px-3 py-1">Cancel</button>
                            </header>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Price (ETH)</label>
                                        <span className="text-[9px] text-zinc-700 font-mono">Fee: 0.002</span>
                                    </div>
                                    <input
                                        autoFocus
                                        placeholder="0.00"
                                        type="number"
                                        min="0"
                                        step="any"
                                        value={listingPrice}
                                        onChange={e => setListingPrice(e.target.value)}
                                        className="w-full bg-black border-b border-white/10 py-6 text-4xl font-black outline-none focus:border-blue-600 transition-colors text-white"
                                        disabled={listingLoading || listingSuccess}
                                    />
                                </div>
                                <div className="p-4 bg-zinc-900/50 border border-white/5">
                                    <p className="text-[9px] text-zinc-500 leading-relaxed font-medium uppercase">Warning: All listings are final. Please check your price before listing.</p>
                                </div>
                                {listingError && <div className="text-red-500 text-xs font-bold">{listingError}</div>}
                                {listingSuccess && <div className="text-emerald-500 text-xs font-bold">Asset listed successfully!</div>}
                                <button
                                    className="w-full py-6 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50"
                                    disabled={listingLoading || listingSuccess || !listingPrice}
                                    onClick={async () => {
                                        setListingLoading(true);
                                        setListingError(null);
                                        setListingSuccess(false);
                                        try {
                                            await assets.listAsset(selectedNft.id, listingPrice);
                                            setListingSuccess(true);
                                            fetchAssets();
                                        } catch (err: any) {
                                            setListingError(err.message || 'Failed to list asset');
                                        } finally {
                                            setListingLoading(false);
                                        }
                                    }}
                                >
                                    {listingLoading ? 'Listing...' : listingSuccess ? 'Listed!' : 'Confirm Listing'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}