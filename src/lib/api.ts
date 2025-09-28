interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl = 'http://localhost:8080/api/v1', token: string | null = null) {
    this.baseUrl = baseUrl;
    this.token = token || localStorage.getItem('adminToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Booking methods
  async getBookings(params: {
    page?: number;
    page_size?: number;
    status?: string;
    q?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    const query = searchParams.toString();
    const endpoint = query ? `/admin/bookings?${query}` : '/admin/bookings';
    
    return this.request(endpoint);
  }

  async updateBookingStatus(id: string, status: string) {
    return this.request(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateBooking(id: string, data: any) {
    return this.request(`/admin/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async softDeleteBooking(id: string) {
    return this.request(`/admin/bookings/${id}/soft`, {
      method: 'DELETE',
    });
  }

  async hardDeleteBooking(id: string) {
    return this.request(`/admin/bookings/${id}/hard`, {
      method: 'DELETE',
    });
  }

  // Payment methods
  async chargeCustomer(id: string, chargeData: {
    amount: number;
    base_amount?: number;
    service_fee?: number;
    currency?: string;
    notes?: string;
  }) {
    return this.request(`/admin/bookings/${id}/charge`, {
      method: 'POST',
      body: JSON.stringify(chargeData),
    });
  }

  // Email methods
  async getEmails() {
    return this.request('/dev/outbox');
  }

  async getEmailContent(filename: string) {
    return fetch(`/dev/outbox/email?file=${encodeURIComponent(filename)}`)
      .then(res => res.text());
  }
}

export const api = new ApiClient();