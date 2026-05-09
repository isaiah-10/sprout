export interface StockInfo {
  symbol: string
  name: string
  emoji: string
  description: string
  sector: string
  assetType: 'stock' | 'etf' | 'index_fund' | 'reit'
  minAge?: number
  featured?: boolean
}

export const POPULAR_STOCKS: StockInfo[] = [
  // BIG TECH
  { symbol: 'AAPL', name: 'Apple',          emoji: '🍎', description: 'Makes iPhones, MacBooks, and the App Store',         sector: 'Technology',  assetType: 'stock',      featured: true },
  { symbol: 'GOOGL',name: 'Alphabet',       emoji: '🔍', description: 'Makes Google Search, YouTube, and Gmail',            sector: 'Technology',  assetType: 'stock',      featured: true },
  { symbol: 'MSFT', name: 'Microsoft',      emoji: '💻', description: 'Makes Windows, Xbox, and Minecraft',                 sector: 'Technology',  assetType: 'stock',      featured: true },
  { symbol: 'AMZN', name: 'Amazon',         emoji: '📦', description: 'Online shopping, fast delivery, and cloud computing', sector: 'Consumer',    assetType: 'stock',      featured: true },
  { symbol: 'META', name: 'Meta',           emoji: '👍', description: 'Owns Facebook, Instagram, and WhatsApp',             sector: 'Technology',  assetType: 'stock' },
  { symbol: 'NFLX', name: 'Netflix',        emoji: '🎬', description: 'Streaming movies and TV shows in 190 countries',     sector: 'Media',       assetType: 'stock',      featured: true },
  { symbol: 'DIS',  name: 'Disney',         emoji: '🏰', description: 'Makes movies, runs theme parks, and owns Disney+',   sector: 'Media',       assetType: 'stock',      featured: true },
  { symbol: 'TSLA', name: 'Tesla',          emoji: '⚡', description: 'Makes electric cars and solar energy products',      sector: 'Auto/Energy', assetType: 'stock',      featured: true },
  { symbol: 'NVDA', name: 'NVIDIA',         emoji: '🎮', description: 'Makes graphics chips for gaming and AI',             sector: 'Technology',  assetType: 'stock',      featured: true },
  { symbol: 'SNAP', name: 'Snap',           emoji: '👻', description: 'Makes Snapchat, the popular photo messaging app',    sector: 'Technology',  assetType: 'stock' },
  { symbol: 'SPOT', name: 'Spotify',        emoji: '🎵', description: 'Music streaming with over 600 million listeners',    sector: 'Media',       assetType: 'stock' },
  { symbol: 'RBLX', name: 'Roblox',         emoji: '🕹️', description: 'Online gaming platform kids love',                   sector: 'Gaming',      assetType: 'stock',      featured: true },
  { symbol: 'ABNB', name: 'Airbnb',         emoji: '🏠', description: 'App that lets people rent out their homes',          sector: 'Travel',      assetType: 'stock' },
  { symbol: 'UBER', name: 'Uber',           emoji: '🚗', description: 'Ride-sharing and food delivery app',                 sector: 'Transport',   assetType: 'stock' },
  { symbol: 'NKE',  name: 'Nike',           emoji: '👟', description: 'Makes sneakers, sports gear, and apparel',           sector: 'Consumer',    assetType: 'stock',      featured: true },
  { symbol: 'MCD',  name: "McDonald's",     emoji: '🍔', description: "World's largest fast food chain",                    sector: 'Consumer',    assetType: 'stock' },
  { symbol: 'SBUX', name: 'Starbucks',      emoji: '☕', description: 'Coffee shops with locations in 80+ countries',       sector: 'Consumer',    assetType: 'stock' },
  { symbol: 'COST', name: 'Costco',         emoji: '🛒', description: 'Wholesale warehouse store with great deals',         sector: 'Consumer',    assetType: 'stock' },
  { symbol: 'V',    name: 'Visa',           emoji: '💳', description: 'Processes billions of credit card payments daily',   sector: 'Finance',     assetType: 'stock' },
  { symbol: 'JPM',  name: 'JPMorgan Chase', emoji: '🏦', description: 'One of the largest banks in the world',             sector: 'Finance',     assetType: 'stock' },

  // INDEX FUNDS & ETFs — ages 13+
  { symbol: 'SPY',  name: 'S&P 500 ETF',       emoji: '📊', description: 'Owns tiny pieces of the 500 biggest US companies', sector: 'Index Fund',  assetType: 'index_fund', minAge: 13, featured: true },
  { symbol: 'QQQ',  name: 'Nasdaq 100 ETF',    emoji: '🔬', description: 'Top 100 tech companies bundled into one investment', sector: 'Index Fund',  assetType: 'index_fund', minAge: 13 },
  { symbol: 'VTI',  name: 'Total Market ETF',  emoji: '🌍', description: 'Owns a tiny piece of every US company at once',     sector: 'Index Fund',  assetType: 'index_fund', minAge: 13, featured: true },
  { symbol: 'VOO',  name: 'Vanguard S&P 500',  emoji: '🦅', description: 'Low-cost way to invest in the whole stock market',  sector: 'Index Fund',  assetType: 'index_fund', minAge: 13 },
  { symbol: 'ARKK', name: 'ARK Innovation ETF',emoji: '🚀', description: 'Bets on future tech like AI, robots, and biotech',  sector: 'ETF',         assetType: 'etf',        minAge: 13 },

  // REITs — ages 13+
  { symbol: 'VNQ',  name: 'Vanguard Real Estate', emoji: '🏢', description: 'Invest in real estate without buying a building',  sector: 'Real Estate', assetType: 'reit', minAge: 13, featured: true },
  { symbol: 'O',    name: 'Realty Income',         emoji: '🏪', description: 'Pays monthly dividends from retail properties',    sector: 'Real Estate', assetType: 'reit', minAge: 13 },
  { symbol: 'AMT',  name: 'American Tower',        emoji: '📡', description: 'Owns cell towers around the world and earns rent', sector: 'Real Estate', assetType: 'reit', minAge: 13 },
]

export const SECTORS = Array.from(new Set(POPULAR_STOCKS.map(s => s.sector)))

export function getStocksByAge(age: number): StockInfo[] {
  return POPULAR_STOCKS.filter(s => !s.minAge || age >= s.minAge)
}

export function getFeaturedStocks(age: number): StockInfo[] {
  return getStocksByAge(age).filter(s => s.featured)
}

export function findStock(symbol: string): StockInfo | undefined {
  return POPULAR_STOCKS.find(s => s.symbol === symbol.toUpperCase())
}
