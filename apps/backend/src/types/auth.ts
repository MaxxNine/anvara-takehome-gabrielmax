import type { Request } from 'express';

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

interface BaseAuthUser {
  id: string;
  email: string;
}

export type AuthUser =
  | (BaseAuthUser & Omit<SponsorRoleAssignment, 'name'>)
  | (BaseAuthUser & Omit<PublisherRoleAssignment, 'name'>);

export interface AuthRequest extends Request {
  user?: AuthUser;
}
