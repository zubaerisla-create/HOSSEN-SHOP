const API_BASE_URL = 'https://hossen-shop-server.solutionsquad.tech/api/v1';

export interface ApiUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export interface ApiAuthResponse {
  user: ApiUser;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    expires_at?: number;
  };
}

class ApiClient {
  private getHeaders(isMultipart = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Read tokens
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('hossen_shop_access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isMultipart = options.body instanceof FormData;
    const headers = {
      ...this.getHeaders(isMultipart),
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong.');
    }

    return result.data as T;
  }

  // --- Auth API ---
  async signup(data: any): Promise<ApiAuthResponse> {
    const res = await this.request<ApiAuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.saveSession(res);
    return res;
  }

  async login(data: any): Promise<ApiAuthResponse> {
    const res = await this.request<ApiAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.saveSession(res);
    return res;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hossen_shop_access_token');
      localStorage.removeItem('hossen_shop_refresh_token');
      localStorage.removeItem('hossen_shop_user');
    }
  }

  private saveSession(res: ApiAuthResponse) {
    if (typeof window !== 'undefined') {
      const accessToken = res.tokens?.accessToken || res.session?.access_token || '';
      const refreshToken = res.tokens?.refreshToken || res.session?.refresh_token || '';
      localStorage.setItem('hossen_shop_access_token', accessToken);
      localStorage.setItem('hossen_shop_refresh_token', refreshToken);
      localStorage.setItem('hossen_shop_user', JSON.stringify(res.user));
    }
  }

  // --- CMS API ---
  async getCmsSetting<T>(key: string): Promise<T> {
    return this.request<T>(`/cms/${key}`);
  }

  async updateCmsSetting<T>(key: string, data: T): Promise<T> {
    return this.request<T>(`/cms/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- Newsletter API ---
  async subscribeNewsletter(email: string): Promise<any> {
    return this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getNewsletterSubscribers(): Promise<any[]> {
    return this.request<any[]>('/newsletter/subscribers');
  }

  // --- Products API ---
  async getProducts(): Promise<any[]> {
    return this.request<any[]>('/products');
  }

  async getProductById(id: string): Promise<any> {
    return this.request<any>(`/products/${id}`);
  }

  async createProduct(data: any): Promise<any> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any): Promise<any> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<any> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Categories API ---
  async getCategories(): Promise<any[]> {
    return this.request<any[]>('/categories');
  }

  async getCategoryById(id: string): Promise<any> {
    return this.request<any>(`/categories/${id}`);
  }

  async createCategory(data: any): Promise<any> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any): Promise<any> {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<any> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Features API ---
  async getFeatures(): Promise<any[]> {
    return this.request<any[]>('/features');
  }

  async createFeature(data: any): Promise<any> {
    return this.request('/features', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFeature(id: string, data: any): Promise<any> {
    return this.request(`/features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFeature(id: string): Promise<any> {
    return this.request(`/features/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Partners API ---
  async getPartners(): Promise<any[]> {
    return this.request<any[]>('/partners');
  }

  async addPartner(data: any): Promise<any> {
    return this.request('/partners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async togglePartner(id: string): Promise<any> {
    return this.request(`/partners/${id}/toggle`, {
      method: 'PUT',
    });
  }

  async deletePartner(id: string): Promise<any> {
    return this.request(`/partners/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Orders API ---
  async createOrder(items: { productId: string; quantity: number }[], paymentMethod?: string): Promise<any> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, paymentMethod }),
    });
  }

  async getMyOrders(): Promise<any[]> {
    return this.request<any[]>('/orders/my');
  }

  async getAllOrders(): Promise<any[]> {
    return this.request<any[]>('/orders/all');
  }

  async getOrderById(id: string): Promise<any> {
    return this.request<any>(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string): Promise<any> {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async assignPartner(id: string, partnerName: string): Promise<any> {
    return this.request(`/orders/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ partnerName }),
    });
  }

  // --- Payments API ---
  async createPaymentIntent(items: { productId: string; quantity: number }[]): Promise<{ clientSecret: string; amount: number; currency: string }> {
    return this.request<{ clientSecret: string; amount: number; currency: string }>('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  // --- Image Upload API ---
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    return this.request<{ url: string }>('/upload', {
      method: 'POST',
      body: formData,
    });
  }

  // --- Dashboard API ---
  async getDashboardStats(): Promise<any> {
    return this.request<any>('/dashboard/stats');
  }

  async sendDashboardEmail(data: { recipients: string[]; subject: string; body: string }): Promise<any> {
    return this.request('/dashboard/send-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
export default api;
