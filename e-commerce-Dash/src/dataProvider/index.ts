import { DataProvider } from 'react-admin';
import { getAuthHeaders, fetchWithRefresh } from '../auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3007/v1';

const resourcePath: Record<string, string> = {
  categories: 'category/admin',
  subcategories: 'subcategory/admin',
  products: 'products/admin',
  orders: 'order/admin',
  users: 'user',
};

const getPath = (resource: string) => resourcePath[resource] || resource;

const toId = (record: any) => {
  if (!record) return record;
  const { _id, ...rest } = record;
  return { id: _id || record.id, ...rest };
};

const handleRes = async (res: Response) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || `HTTP ${res.status}`) as any;
    err.status = res.status;
    throw err;
  }
  return res.json();
};

const extractList = (data: any, resource: string) => {
  if (!data) return { records: [], total: 0 };
  if (Array.isArray(data)) return { records: data, total: data.length };
  if (data.products) return { records: data.products, total: data.total ?? data.products.length };
  if (data.orders) return { records: data.orders, total: data.total ?? data.orders.length };
  if (data[resource]) return { records: data[resource], total: data.total ?? data[resource].length };
  return { records: [], total: 0 };
};

const createProvider = (): DataProvider => ({
  getList: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field, order } = params.sort || {};

    const qs = new URLSearchParams();
    qs.set('page', String(page));
    qs.set('limit', String(perPage));
    if (field && order) {
      qs.set('sort', `${field}_${order.toLowerCase()}`);
    }
    if (params.filter) {
      for (const [k, v] of Object.entries(params.filter)) {
        if (v !== undefined && v !== '' && v !== null) {
          qs.set(k, String(v));
        }
      }
    }

    const url = `${API_URL}/${getPath(resource)}?${qs}`;
    const json = await handleRes(await fetchWithRefresh(url));
    const { records, total } = extractList(json.data, resource);
    return { data: records.map(toId), total };
  },

  getOne: async (resource, params) => {
    const url = `${API_URL}/${getPath(resource)}/${params.id}`;
    const json = await handleRes(await fetchWithRefresh(url));
    return { data: toId(json.data) };
  },

  getMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map(id =>
        fetchWithRefresh(`${API_URL}/${getPath(resource)}/${id}`).then(handleRes)
      )
    );
    return { data: results.map(r => toId(r.data)) };
  },

  getManyReference: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const qs = new URLSearchParams();
    qs.set('page', String(page));
    qs.set('limit', String(perPage));
    if (params.target && params.id) {
      qs.set(params.target, String(params.id));
    }
    const url = `${API_URL}/${getPath(resource)}?${qs}`;
    const json = await handleRes(await fetchWithRefresh(url));
    const { records, total } = extractList(json.data, resource);
    return { data: records.map(toId), total };
  },

  create: async (resource, params) => {
    const isUpload = Object.values(params.data).some(v => v instanceof File || v instanceof Blob);
    let body: FormData | string;
    const headers: Record<string, string> = { ...getAuthHeaders() };

    if (isUpload) {
      const fd = new FormData();
      for (const [k, v] of Object.entries(params.data)) {
        if (v instanceof File || v instanceof Blob) {
          fd.append(k, v);
        } else if (Array.isArray(v)) {
          fd.append(k, JSON.stringify(v));
        } else if (v !== undefined && v !== null) {
          fd.append(k, String(v));
        }
      }
      body = fd;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(params.data);
    }

    const url = `${API_URL}/${getPath(resource)}`;
    const json = await handleRes(
      await fetchWithRefresh(url, { method: 'POST', headers, body })
    );
    return { data: toId(json.data) };
  },

  update: async (resource, params) => {
    const isUpload = Object.values(params.data).some(v => v instanceof File || v instanceof Blob);
    let body: FormData | string;
    const headers: Record<string, string> = { ...getAuthHeaders() };

    if (isUpload) {
      const fd = new FormData();
      for (const [k, v] of Object.entries(params.data)) {
        if (k === 'id') continue;
        if (v instanceof File || v instanceof Blob) {
          fd.append(k, v);
        } else if (Array.isArray(v)) {
          fd.append(k, JSON.stringify(v));
        } else if (v !== undefined && v !== null) {
          fd.append(k, String(v));
        }
      }
      body = fd;
    } else {
      headers['Content-Type'] = 'application/json';
      const { id, ...rest } = params.data;
      body = JSON.stringify(rest);
    }

    const method = resource === 'orders' ? 'PATCH' : 'PUT';
    const url = `${API_URL}/${getPath(resource)}/${params.id}`;
    const json = await handleRes(
      await fetchWithRefresh(url, { method, headers, body })
    );
    return { data: toId(json.data) };
  },

  delete: async (resource, params) => {
    const url = `${API_URL}/${getPath(resource)}/${params.id}`;
    await fetchWithRefresh(url, { method: 'DELETE', headers: getAuthHeaders() });
    return { data: { id: params.id } as any };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map(id =>
        fetchWithRefresh(`${API_URL}/${getPath(resource)}/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        })
      )
    );
    return { data: params.ids };
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map(id =>
        fetchWithRefresh(`${API_URL}/${getPath(resource)}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(params.data),
        })
      )
    );
    return { data: params.ids };
  },
});

const defaultProvider = createProvider();

export default (_type?: string) => defaultProvider;
