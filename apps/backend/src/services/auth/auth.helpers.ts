import type { AuthProfileResponse, RoleAssignment } from '../../types/auth.js';

export function toAuthProfileResponse(roleData: RoleAssignment): AuthProfileResponse {
  if (roleData.role === 'SPONSOR') {
    return { role: 'sponsor', sponsorId: roleData.sponsorId, name: roleData.name };
  }

  if (roleData.role === 'PUBLISHER') {
    return { role: 'publisher', publisherId: roleData.publisherId, name: roleData.name };
  }

  return { role: null };
}
