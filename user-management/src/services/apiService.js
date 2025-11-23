const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }


  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }


  async getUsers() {
    return await this.request('/users');
  }


  async createUser(userData) {
    return await this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }


  async updateUser(id, userData) {
    return await this.request(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  }


  async deleteUser(id) {
    return await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

const apiService = new ApiService();
export default apiService;