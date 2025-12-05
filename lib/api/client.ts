// API Client for Manna Radio Backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
    private baseURL: string;

    constructor() {
        // Ensure we don't double up on /api if it's already in the env var
        this.baseURL = API_URL.endsWith('/api')
            ? API_URL
            : `${API_URL}/api`;
    }

    // Get JWT token from localStorage
    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    // Set JWT token in localStorage
    setToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    // Remove JWT token from localStorage
    removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    // Generic request method
    async request(endpoint: string, options: RequestInit = {}) {
        const token = this.getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                this.removeToken();
                if (typeof window !== 'undefined') {
                    window.location.href = '/admin/login';
                }
            }
            throw new Error(data.error || 'Request failed');
        }

        return data;
    }

    // Auth endpoints
    async login(email: string, password: string) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    }

    async register(name: string, email: string, password: string) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });

        if (data.token) {
            this.setToken(data.token);
        }

        return data;
    }

    async getCurrentPastor() {
        return await this.request('/auth/me');
    }

    async changePassword(currentPassword: string, newPassword: string) {
        return await this.request('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    }

    logout() {
        this.removeToken();
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }

    // Members endpoints
    async getMembers(params?: { search?: string; rank?: string; count?: boolean }) {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.rank) queryParams.append('rank', params.rank);
        if (params?.count) queryParams.append('count', 'true');

        const query = queryParams.toString();
        return await this.request(`/members${query ? `?${query}` : ''}`);
    }

    async getMember(id: number) {
        return await this.request(`/members/${id}`);
    }

    async createMember(memberData: any) {
        return await this.request('/members', {
            method: 'POST',
            body: JSON.stringify(memberData),
        });
    }

    async updateMember(id: number, memberData: any) {
        return await this.request(`/members/${id}`, {
            method: 'PUT',
            body: JSON.stringify(memberData),
        });
    }

    async deleteMember(id: number) {
        return await this.request(`/members/${id}`, {
            method: 'DELETE',
        });
    }

    // Prayer requests endpoints
    async getPrayerRequests(params?: { status?: string; urgent?: boolean; count?: boolean }) {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.urgent) queryParams.append('urgent', 'true');
        if (params?.count) queryParams.append('count', 'true');

        const query = queryParams.toString();
        return await this.request(`/prayer-requests${query ? `?${query}` : ''}`);
    }

    async getPrayerRequest(id: number) {
        return await this.request(`/prayer-requests/${id}`);
    }

    async createPrayerRequest(requestData: any) {
        return await this.request('/prayer-requests', {
            method: 'POST',
            body: JSON.stringify(requestData),
        });
    }

    async updatePrayerRequestStatus(id: number, status: string) {
        return await this.request(`/prayer-requests/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async replyToPrayerRequest(id: number, replyText: string, sendEmail: boolean = false) {
        return await this.request(`/prayer-requests/${id}/reply`, {
            method: 'PUT',
            body: JSON.stringify({ reply_text: replyText, send_email: sendEmail }),
        });
    }

    // Chat endpoints
    async getChatMessages(limit: number = 50) {
        return await this.request(`/chat/messages?limit=${limit}`);
    }

    async postChatMessage(username: string, message: string, messageType: string = 'text') {
        return await this.request('/chat/messages', {
            method: 'POST',
            body: JSON.stringify({ username, message, message_type: messageType }),
        });
    }

    // Donation endpoints
    async getDonations(filters: any = {}) {
        const queryParams = new URLSearchParams();
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.limit) queryParams.append('limit', filters.limit.toString());

        const query = queryParams.toString();
        return await this.request(`/donations${query ? `?${query}` : ''}`);
    }

    async getDonationStats() {
        return await this.request('/donations/stats');
    }

    async createDonation(donationData: any) {
        return await this.request('/donations', {
            method: 'POST',
            body: JSON.stringify(donationData),
        });
    }

    async submitPublicDonation(donationData: any) {
        return await this.request('/donations/public', {
            method: 'POST',
            body: JSON.stringify(donationData),
        });
    }

    // Testimony endpoints
    async getPublicTestimonies() {
        return await this.request('/testimonies');
    }

    async submitTestimony(data: { full_name: string; location?: string; content: string }) {
        return await this.request('/testimonies', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getAdminTestimonies() {
        return await this.request('/testimonies/admin');
    }

    async updateTestimonyStatus(id: number, status: 'approved' | 'declined' | 'pending') {
        return await this.request(`/testimonies/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async deleteTestimony(id: number) {
        return await this.request(`/testimonies/${id}`, {
            method: 'DELETE',
        });
    }

    // -- User Management --

    async getUsers() {
        return await this.request('/auth/users');
    }

    async createUser(userData: any) {
        return await this.request('/auth/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
