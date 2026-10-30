import { describe, it, expect } from 'vitest';
import type { Database } from '@/types/database.types';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 2 Database Schema & Types', () => {
  it('confirms all 6 Plane A tables exist in generated TypeScript Database type', () => {
    type Tables = Database['public']['Tables'];

    // Static type assertions ensuring table keys exist
    type ExpectedTables =
      | 'organizations'
      | 'memberships'
      | 'profiles'
      | 'projects'
      | 'orders'
      | 'deployment_logs';

    const expectedTableNames: ExpectedTables[] = [
      'organizations',
      'memberships',
      'profiles',
      'projects',
      'orders',
      'deployment_logs',
    ];

    // Read generated type definition file to verify table definitions exist
    const typeDefPath = path.resolve(__dirname, '../../src/types/database.types.ts');
    expect(fs.existsSync(typeDefPath)).toBe(true);
    const content = fs.readFileSync(typeDefPath, 'utf8');

    for (const table of expectedTableNames) {
      expect(content).toContain(`${table}: {`);
    }
  });

  it('validates organizations table row structure', () => {
    type OrgRow = Database['public']['Tables']['organizations']['Row'];
    const mockOrg: OrgRow = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'PaperGen Alpha',
      slug: 'papergen-alpha',
      billing_tier: 'pro',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(mockOrg.name).toBe('PaperGen Alpha');
    expect(mockOrg.billing_tier).toBe('pro');
  });

  it('validates memberships table row structure and roles', () => {
    type MembershipRow = Database['public']['Tables']['memberships']['Row'];
    const mockMembership: MembershipRow = {
      id: '00000000-0000-0000-0000-000000000002',
      organization_id: '00000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000003',
      role: 'owner',
      created_at: new Date().toISOString(),
    };
    expect(mockMembership.role).toBe('owner');
  });

  it('validates projects table row structure', () => {
    type ProjectRow = Database['public']['Tables']['projects']['Row'];
    const mockProject: ProjectRow = {
      id: '00000000-0000-0000-0000-000000000004',
      organization_id: '00000000-0000-0000-0000-000000000001',
      name: 'Orbital Telemetry Site',
      slug: 'orbital-telemetry',
      stitch_project_id: 'stitch-12345',
      github_repo_url: 'https://github.com/papergen/orbital',
      vercel_project_id: 'prj_12345',
      design_md: '# DESIGN.md',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(mockProject.stitch_project_id).toBe('stitch-12345');
  });

  it('validates orders table row structure', () => {
    type OrderRow = Database['public']['Tables']['orders']['Row'];
    const mockOrder: OrderRow = {
      id: '00000000-0000-0000-0000-000000000005',
      organization_id: '00000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000003',
      amount_cents: 9900,
      currency: 'usd',
      status: 'completed',
      tier: 'pro',
      payment_intent_id: 'pi_test_123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(mockOrder.amount_cents).toBe(9900);
    expect(mockOrder.status).toBe('completed');
  });

  it('confirms versioned migrations exist in supabase/migrations directory', () => {
    const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');
    expect(fs.existsSync(migrationsDir)).toBe(true);
    const files = fs.readdirSync(migrationsDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files.some((f) => f.endsWith('.sql'))).toBe(true);
  });
});
