import axios from 'axios';
import { url as PRIMARY_URL, fallbackUrl as FALLBACK_URL } from './assets';

function buildUrl(base, path) {
  if (!path) return base;
  if (path.startsWith('http')) return path;
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
}


export async function requestWithFallback(method, path, data = null, config = {}) {
  const tryRequest = async (base) => {
    const full = buildUrl(base, path);
    return axios({ method, url: full, data, ...config });
  };

  try {
    return await tryRequest(PRIMARY_URL);
  } catch (err) {
    // If there's no response at all (network error / CORS / server down), try fallback
    if (!err.response && FALLBACK_URL && FALLBACK_URL !== PRIMARY_URL) {
      try {
        return await tryRequest(FALLBACK_URL);
      } catch (err2) {
        // throw the second error if fallback also failed
        throw err2;
      }
    }
    // If server responded with error or no fallback available, rethrow
    throw err;
  }
}

export default requestWithFallback;
