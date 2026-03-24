import { prisma } from '../../db.js';
import type { AuthProfileResponse, RoleAssignment } from '../../types/auth.js';

import { toAuthProfileResponse } from './auth.helpers.js';

export async function resolveUserRole(userId: string): Promise<RoleAssignment> {
  const sponsor = await prisma.sponsor.findUnique({
    where: { userId },
    select: { id: true, name: true },
  });

  if (sponsor) {
    return {
      role: 'SPONSOR',
      sponsorId: sponsor.id,
      name: sponsor.name,
    };
  }

  const publisher = await prisma.publisher.findUnique({
    where: { userId },
    select: { id: true, name: true },
  });

  if (publisher) {
    return {
      role: 'PUBLISHER',
      publisherId: publisher.id,
      name: publisher.name,
    };
  }

  return { role: null };
}

export async function getAuthProfile(userId: string): Promise<AuthProfileResponse> {
  const roleData = await resolveUserRole(userId);
  return toAuthProfileResponse(roleData);
}
