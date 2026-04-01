// ── CARBON SCOPE API ─────────────────────────────────────────────
// Ye file backend se baat karta hai
// Saare API calls yahan se hote hain

import axios from 'axios';

// Backend ka base URL
const BASE_URL = 'http://localhost:8080/analyses';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds — crawling time lagta hai
});

// ── MAIN ENDPOINTS ────────────────────────────────────────────────

// Website analyze karo
export const analyzeWebsite = (url, monthlyVisits, crawlPages) =>
  api.post('/', {
    url,
    monthlyVisits: monthlyVisits || 10000,
    crawlPages: crawlPages || 1,
    enableCrawlMode: crawlPages > 1,
  });

// Analysis result fetch karo
export const getAnalysis = (id) =>
  api.get(`/${id}`);

// History fetch karo
export const getHistory = () =>
  api.get('/history');

// Compare 2 websites
export const compareWebsites = (url1, url2) =>
  api.post('/compare', { url1, url2, monthlyVisits: '10000' });

// Leaderboard
export const getLeaderboard = () =>
  api.get('/leaderboard');

// Carbon badge URL
export const getBadgeUrl = (url) =>
  `${BASE_URL}/badge/${encodeURIComponent(url)}`;

// Carbon savings
export const getSavings = (id) =>
  api.get(`/${id}/savings`);

// Weekly trend
export const getWeeklyTrend = () =>
  api.get('/trend/weekly');

// Code fixes
export const getCodeFixes = (id) =>
  api.get(`/${id}/code-fixes`);

// AI Chat
export const chatWithAi = (id, question) =>
  api.post(`/${id}/chat`, { question });

// Send email report
export const sendEmailReport = (id, email) =>
  api.post(`/${id}/send-report`, { email });

// PDF download URL
export const getPdfUrl = (id) =>
  `${BASE_URL}/${id}/pdf`;

// Industry compare
export const getIndustries = () =>
  api.get('/industries');

export default api;