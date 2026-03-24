import type { Request } from 'express';
import type { auth } from '../auth.js';

export type AuthUserRole = 'SPONSOR' | 'PUBLISHER';

export interface SponsorRoleAssignment {
  role: 'SPONSOR';
  sponsorId: string;
  name: string;
}

export interface PublisherRoleAssignment {
  role: 'PUBLISHER';
  publisherId: string;
  name: string;
}

export interface UnassignedRole {
  role: null;
}

export type RoleAssignment = SponsorRoleAssignment | PublisherRoleAssignment | UnassignedRole;

export type AuthProfileResponse =
  | { role: 'sponsor'; sponsorId: string; name: string }
  | { role: 'publisher'; publisherId: string; name: string }
  | { role: null };

interface BaseAuthUser {
  id: string;
  email: string;
}

export type AuthUser =
  | (BaseAuthUser & Omit<SponsorRoleAssignment, 'name'>)
  | (BaseAuthUser & Omit<PublisherRoleAssignment, 'name'>);

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

export interface AuthRequest extends Request {
  authSession?: AuthSession | null;
  user?: AuthUser;
}
