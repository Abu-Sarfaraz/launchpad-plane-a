import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as authPost, DELETE as authDelete } from '@/app/api/admin/auth/route';
import { GET as systemGet } from '@/app/api/admin/system/route';

describe('Admin Authentication & Control Plane Endpoints', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ADMIN_SECRET_KEY: 'test-admin-secret-999',
    };

    // Mock fetch for health probes and supabase queries
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('generateContent') || url.includes('chat/completions')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            candidates: [{ content: { parts: [{ text: 'OK' }] } }],
            choices: [{ message: { content: 'OK' } }],
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    });
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('authenticates admin with valid secret key and sets cookie', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ secretKey: 'test-admin-secret-999' }),
    });

    const res = await authPost(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(res.cookies.get('launchpad-admin-session')?.value).toBe('true');
  });

  it('rejects authentication with invalid secret key with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ secretKey: 'wrong-key' }),
    });

    const res = await authPost(req);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe('Invalid admin secret key');
  });

  it('clears admin session cookie on DELETE', async () => {
    const res = await authDelete();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('rejects unauthorized access to /api/admin/system without cookie or header', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/system', {
      method: 'GET',
    });

    const res = await systemGet(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized admin access');
  });

  it('allows access to /api/admin/system with valid x-admin-key header', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/system', {
      method: 'GET',
      headers: {
        'x-admin-key': 'test-admin-secret-999',
      },
    });

    const res = await systemGet(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.environment).toBeDefined();
    expect(body.environment.ADMIN_SECRET_KEY).toBe(true);
    expect(body.database).toBeDefined();
  });
});
