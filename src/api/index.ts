// API layer

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("ipchain_token") || ""}`,
});

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manufacturer";
  company?: string;
  walletAddress?: string;
}

export interface Contract {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  allowedUseCases: string[];
  restrictions: string[];
  royaltyCut: number;
  isPublished: boolean;
  status: "Active" | "Pending" | "Draft" | "Completed";
  manufacturerName?: string;
  mintedCount: number;
  agreedQuantity: number;
  category: string;
  createdAt: string;
}

export interface Order {
  id: string;
  contractId: string;
  contractName: string;
  ownerName: string;
  manufacturerName: string;
  manufacturerId: string;
  productName: string;
  description: string;
  intendedUse: string;
  quantity: number;
  estimatedUnitValue: number;
  walletAddress: string;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
  royaltyCut: number;
}

export interface NFT {
  tokenId: string;
  contractName: string;
  mintedDate: string;
  transactionHash: string;
  status: "Minted" | "Transferred" | "Verified";
}

// --- Mock Data ---
let mockContracts: Contract[] = [
  {
    id: "c1",
    name: "Air Logo License",
    description:
      "License for the iconic Air logo for use on footwear and apparel. Includes all color variations and the signature swoosh overlay pattern.",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    ownerId: "owner1",
    ownerName: "Jordan Brand",
    allowedUseCases: [
      "Footwear production",
      "Apparel manufacturing",
      "Limited edition releases",
      "Retail packaging",
    ],
    restrictions: [
      "No modifications to logo proportions",
      "No use on competing brand products",
      "No sublicensing without approval",
    ],
    royaltyCut: 12,
    isPublished: true,
    status: "Active",
    manufacturerName: "Nike Corp",
    mintedCount: 480,
    agreedQuantity: 500,
    category: "Fashion",
    createdAt: "2024-01-15",
  },
  {
    id: "c2",
    name: "Retro Wave Artwork",
    description:
      "A collection of retro-inspired wave artwork perfect for merchandise, posters, and home decor products.",
    imageUrl:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=300&fit=crop",
    ownerId: "owner2",
    ownerName: "Retro Studios",
    allowedUseCases: [
      "Merchandise printing",
      "Poster production",
      "Home decor items",
    ],
    restrictions: ["No digital-only products", "Minimum order 100 units"],
    royaltyCut: 8,
    isPublished: true,
    status: "Pending",
    mintedCount: 0,
    agreedQuantity: 300,
    category: "Art",
    createdAt: "2024-02-20",
  },
  {
    id: "c3",
    name: "Signature Pattern V2",
    description:
      "Updated signature geometric pattern for premium product lines. Features interlocking diamond motifs.",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
    ownerId: "owner1",
    ownerName: "Jordan Brand",
    allowedUseCases: [
      "Premium product lines",
      "Limited editions",
      "Collector items",
    ],
    restrictions: ["Premium products only", "No mass market distribution"],
    royaltyCut: 15,
    isPublished: true,
    status: "Completed",
    manufacturerName: "Vintage Works",
    mintedCount: 200,
    agreedQuantity: 200,
    category: "Fashion",
    createdAt: "2023-11-05",
  },
  {
    id: "c4",
    name: "Heritage Crest",
    description:
      "Classic heritage crest design suitable for luxury goods and heritage brand collaborations.",
    imageUrl:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=300&fit=crop",
    ownerId: "owner2",
    ownerName: "Retro Studios",
    allowedUseCases: ["Luxury goods", "Brand collaborations"],
    restrictions: ["Luxury segment only", "Requires quality approval"],
    royaltyCut: 10,
    isPublished: false,
    status: "Draft",
    mintedCount: 0,
    agreedQuantity: 0,
    category: "Art",
    createdAt: "2024-03-01",
  },
  {
    id: "c5",
    name: "TechFlow UI Kit",
    description:
      "Licensed UI design system for tech hardware products. Clean, minimal interfaces for IoT devices.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    ownerId: "owner1",
    ownerName: "Jordan Brand",
    allowedUseCases: [
      "IoT device interfaces",
      "Hardware dashboards",
      "Consumer electronics",
    ],
    restrictions: ["Hardware products only", "No software-only usage"],
    royaltyCut: 18,
    isPublished: true,
    status: "Active",
    mintedCount: 120,
    agreedQuantity: 400,
    category: "Tech",
    createdAt: "2024-01-28",
  },
  {
    id: "c6",
    name: "Championship Shield",
    description:
      "Official championship emblem for sports merchandise and memorabilia production.",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-bd45ba8fcacb?w=400&h=300&fit=crop",
    ownerId: "owner2",
    ownerName: "Retro Studios",
    allowedUseCases: ["Sports memorabilia", "Fan merchandise", "Collectibles"],
    restrictions: ["No political use", "Season-specific designs"],
    royaltyCut: 14,
    isPublished: true,
    status: "Active",
    mintedCount: 640,
    agreedQuantity: 1000,
    category: "Sports",
    createdAt: "2024-02-10",
  },
];

let mockOrders: Order[] = [
  {
    id: "o1",
    contractId: "c1",
    contractName: "Air Logo License",
    ownerName: "Jordan Brand",
    manufacturerName: "Nike Corp",
    manufacturerId: "mfr1",
    productName: "Air Max Heritage Edition",
    description: "Limited edition sneaker featuring classic Air Logo",
    intendedUse: "Premium retail sneaker line for Q4 launch",
    quantity: 500,
    estimatedUnitValue: 180,
    walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3c",
    status: "Accepted",
    createdAt: "2024-01-20",
    royaltyCut: 12,
  },
  {
    id: "o2",
    contractId: "c2",
    contractName: "Retro Wave Artwork",
    ownerName: "Retro Studios",
    manufacturerName: "Vintage Works",
    manufacturerId: "mfr2",
    productName: "Retro Wave Poster Collection",
    description: "Limited art print series on premium archival paper",
    intendedUse: "Gallery-quality prints for retail and online sales",
    quantity: 300,
    estimatedUnitValue: 45,
    walletAddress: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2a1b",
    status: "Pending",
    createdAt: "2024-03-01",
    royaltyCut: 8,
  },
  {
    id: "o3",
    contractId: "c4",
    contractName: "Heritage Crest",
    ownerName: "Retro Studios",
    manufacturerName: "Nike Corp",
    manufacturerId: "mfr1",
    productName: "Heritage Leather Collection",
    description: "Premium leather goods with Heritage Crest embossing",
    intendedUse: "Luxury leather goods for flagship stores",
    quantity: 1000,
    estimatedUnitValue: 250,
    walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3c",
    status: "Pending",
    createdAt: "2024-03-05",
    royaltyCut: 10,
  },
  {
    id: "o4",
    contractId: "c3",
    contractName: "Signature Pattern V2",
    ownerName: "Jordan Brand",
    manufacturerName: "Vintage Works",
    manufacturerId: "mfr2",
    productName: "Signature Silk Scarves",
    description: "Luxury silk scarves featuring Signature Pattern V2",
    intendedUse: "High-end fashion accessories",
    quantity: 200,
    estimatedUnitValue: 95,
    walletAddress: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2a1b",
    status: "Rejected",
    createdAt: "2024-02-14",
    royaltyCut: 15,
  },
  {
    id: "o5",
    contractId: "c1",
    contractName: "Air Logo License",
    ownerName: "Jordan Brand",
    manufacturerName: "Vintage Works",
    manufacturerId: "mfr2",
    productName: "Air Logo Snapback Caps",
    description: "Streetwear caps featuring Air Logo",
    intendedUse: "Casual streetwear accessories",
    quantity: 800,
    estimatedUnitValue: 35,
    walletAddress: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2a1b",
    status: "Pending",
    createdAt: "2024-03-02",
    royaltyCut: 12,
  },
];

const mockNFTs: NFT[] = Array.from({ length: 10 }, (_, i) => ({
  tokenId: `#${(1000 + i).toString()}`,
  contractName: i < 5 ? "Air Logo License" : "Signature Pattern V2",
  mintedDate: `2024-0${Math.floor(i / 3) + 1}-${(10 + i).toString().padStart(2, "0")}`,
  transactionHash: `0x${Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`,
  status: i < 7 ? "Minted" : i < 9 ? "Transferred" : "Verified",
}));

// --- Auth ---
export async function signupUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const endpoint =
    data.role === "owner"
      ? `${BASE_URL}/auth/owner/signup`
      : `${BASE_URL}/auth/user/signup`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Signup failed");
  return { token: json.token, user: json.user as User };
}

export async function loginUser(data: {
  email: string;
  password: string;
  role: string;
}) {
  const endpoint =
    data.role === "owner"
      ? `${BASE_URL}/auth/owner/login`
      : `${BASE_URL}/auth/user/login`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: data.email, password: data.password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed");
  // owner/login returns { token, owner_instance }; user/login returns { token, user }
  const user: User = json.user ?? {
    id: String(json.owner_instance?.id),
    name: json.owner_instance?.name,
    email: json.owner_instance?.email,
    role: "owner" as const,
  };
  return { token: json.token, user };
}

// --- Contracts ---
const mapCollection = (c: any): Contract => ({
  id: String(c.id),
  name: c.name,
  description: c.description || "",
  imageUrl: c.imageUrl || c.image_uri || "",
  ownerId: String(c.ownerId ?? c.owner_id),
  ownerName: c.ownerName ?? "",
  allowedUseCases: Array.isArray(c.allowedUseCases)
    ? c.allowedUseCases
    : (() => { try { return JSON.parse(c.allowed_use_cases || c.allowedUseCases || "[]"); } catch { return []; } })(),
  restrictions: Array.isArray(c.restrictions)
    ? c.restrictions
    : (() => { try { return JSON.parse(c.restrictions || "[]"); } catch { return []; } })(),
  royaltyCut: Number(c.royaltyCut ?? c.royalty_cut ?? 0),
  isPublished: Boolean(c.isPublished ?? c.is_published),
  status: (() => {
    const raw = c.status ?? c.ip_status ?? "Draft";
    if (raw === "Draft" && Boolean(c.isPublished ?? c.is_published)) return "Active";
    return raw;
  })(),
  mintedCount: c.mintedCount ?? 0,
  agreedQuantity: c.agreedQuantity ?? 0,
  category: c.category ?? "",
  createdAt: c.createdAt ?? "",
});

export async function getAvailableContracts() {
  await delay(200);
  return mockContracts.filter((c) => c.isPublished);
}

export async function getOwnerContracts(ownerId: string) {
  await delay(200);
  return mockContracts.filter((c) => c.ownerId === ownerId);
}

export async function getContractById(id: string) {
  await delay(200);
  const contract = mockContracts.find((c) => c.id === id);
  if (!contract) throw new Error("Contract not found");
  return contract;
}

export async function createContract(data: Partial<Contract>) {
  await delay(200);
  const storedUser = localStorage.getItem("ipchain_user");
  const user = storedUser ? JSON.parse(storedUser) : { id: "owner1", name: "Jordan Brand" };
  const newContract: Contract = {
    id: `c${Date.now()}`,
    name: data.name ?? "",
    description: data.description ?? "",
    imageUrl: data.imageUrl ?? "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
    ownerId: user.id,
    ownerName: user.name,
    allowedUseCases: data.allowedUseCases ?? [],
    restrictions: data.restrictions ?? [],
    royaltyCut: data.royaltyCut ?? 0,
    isPublished: data.isPublished ?? false,
    status: data.isPublished ? "Active" : (data.status ?? "Draft"),
    mintedCount: 0,
    agreedQuantity: 0,
    category: data.category ?? "",
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockContracts.push(newContract);
  return newContract;
}

const mapOrder = (o: any): Order => ({
  id: String(o.id),
  contractId: String(o.contractId ?? o.collection_id ?? ""),
  contractName: o.contractName ?? o.collection?.name ?? "",
  ownerName: o.ownerName ?? "",
  manufacturerName: o.manufacturerName ?? "",
  manufacturerId: String(o.manufacturerId ?? o.user_id ?? ""),
  productName: o.productName ?? o.product_name ?? "",
  description: o.description ?? "",
  intendedUse: o.intendedUse ?? o.intended_use ?? "",
  quantity: Number(o.quantity ?? 0),
  estimatedUnitValue: Number(o.estimatedUnitValue ?? o.estimated_unit_value ?? 0),
  walletAddress: o.walletAddress ?? o.wallet_address ?? "",
  status: (o.status
    ? o.status.charAt(0).toUpperCase() + o.status.slice(1)
    : "Pending") as Order["status"],
  royaltyCut: Number(o.royaltyCut ?? o.collection?.royalty_cut ?? 0),
  createdAt: o.createdAt ? String(o.createdAt).split("T")[0] : "",
});

// --- Orders ---
export async function createOrder(data: Partial<Order>) {
  await delay(200);
  const storedUser = localStorage.getItem("ipchain_user");
  const user = storedUser ? JSON.parse(storedUser) : { id: "mfr1", name: "Nike Corp" };
  const contract = mockContracts.find((c) => c.id === data.contractId);
  const newOrder: Order = {
    id: `o${Date.now()}`,
    contractId: data.contractId ?? "",
    contractName: contract?.name ?? data.contractName ?? "",
    ownerName: contract?.ownerName ?? "",
    manufacturerName: user.name,
    manufacturerId: user.id,
    productName: data.productName ?? "",
    description: data.description ?? "",
    intendedUse: data.intendedUse ?? "",
    quantity: data.quantity ?? 0,
    estimatedUnitValue: data.estimatedUnitValue ?? 0,
    walletAddress: data.walletAddress ?? user.walletAddress ?? "",
    status: "Pending",
    createdAt: new Date().toISOString().split("T")[0],
    royaltyCut: contract?.royaltyCut ?? 0,
  };
  mockOrders.push(newOrder);
  return newOrder;
}

export async function getOrdersForOwner(ownerId: string) {
  await delay(200);
  return [...mockOrders];
}

export async function getManufacturerOrders() {
  await delay(200);
  const storedUser = localStorage.getItem("ipchain_user");
  const userId = storedUser ? JSON.parse(storedUser).id : undefined;
  return mockOrders.filter((o) => o.manufacturerId === userId);
}

export async function acceptOrder(orderId: string) {
  await delay(200);
  const order = mockOrders.find((o) => o.id === orderId);
  if (order) order.status = "Accepted";
  return { success: true };
}

export async function rejectOrder(orderId: string) {
  await delay(200);
  const order = mockOrders.find((o) => o.id === orderId);
  if (order) order.status = "Rejected";
  return { success: true };
}

// --- NFTs ---
export async function getContractNFTs(collectionId: string) {
  await delay(300);
  return mockNFTs.filter(
    (n) => n.contractName === "Air Logo License" || collectionId === "c3",
  );
}

export async function getManufacturerNFTs(userId: string) {
  await delay(300);
  return mockNFTs;
}
