import axios from 'axios';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // important for weak networks
  headers: {
    'Content-Type': 'application/json',
  },
});
