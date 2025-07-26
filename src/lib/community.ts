// Community types and utilities
export interface CommunityMember {
  id: string;
  name: string;
  email: string;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  members: CommunityMember[];
  createdAt: string;
}

export function createCommunity(name: string, description?: string): Community {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    members: [],
    createdAt: new Date().toISOString(),
  };
}
