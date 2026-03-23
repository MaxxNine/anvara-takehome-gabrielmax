import { prisma } from '../db.js';
import type { RoleAssignment } from '../types/index.js';

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
