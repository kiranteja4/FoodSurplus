import axios from 'axios';
// Shared Axios instance. Auth interceptors are added in Phase 4.
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });
