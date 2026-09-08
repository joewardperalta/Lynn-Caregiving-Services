// Vercel Web Analytics initialization
import { inject } from './vercel-analytics.js';

// Initialize Vercel Analytics
// Mode 'auto' automatically detects development vs production
inject({ mode: 'auto' });
