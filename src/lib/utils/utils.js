export function convertPathToTitle(path) {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return "Home";

  const lastPart = parts[parts.length - 1];
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
}

export function formatPhoneNumber(phoneNumber) {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, "");

  // Remove leading '1' if present
  if (cleaned.startsWith("1")) {
    cleaned = cleaned.substring(1);
  }

  // Check if the input is of correct length
  if (cleaned.length !== 10) {
    throw new Error("Invalid phone number length. Expected 10 digits.");
  }

  // Format the cleaned number
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return null;
}

const cache = new Map();

function setCache(key, value, ttl = 3600) {
  const expiry = Date.now() + ttl * 1000;
  cache.set(key, { value, expiry });
}

function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }

  return cached.value;
}

// Helper function to convert Google Drive URL to proxy URL
export function getProxyUrl(urls) {
  console.log("getProxyUrl called with:", urls); // Debug input

  const cacheKey = `proxy_${urls}`;
  const cachedUrl = getCache(cacheKey);

  if (cachedUrl) {
    console.log("Serving from cache:", cachedUrl);
    return cachedUrl;
  }

  try {
    const url = new URL(urls);
    let fileId;

    // Handle both ?id= and /d/<fileId> formats
    if (url.searchParams.has("id")) {
      fileId = url.searchParams.get("id");
    } else if (url.pathname.startsWith("/d/")) {
      fileId = url.pathname.split("/d/")[1];
    }

    if (fileId) {
      const proxyUrl = `/api/photos/${fileId}`;
      console.log("Generated proxyUrl:", proxyUrl);
      setCache(cacheKey, proxyUrl, 3600); // Cache for 1 hour
      return proxyUrl;
    } else {
      console.error("Failed to extract file ID from URL:", urls);
    }
  } catch (error) {
    console.error("Invalid URL provided to getProxyUrl:", urls, error);
  }
}
