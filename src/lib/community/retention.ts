export const COMMUNITY_MESSAGE_RETENTION_HOURS = 48;

export function communityMessageCutoffIso(): string {
  return new Date(Date.now() - COMMUNITY_MESSAGE_RETENTION_HOURS * 60 * 60 * 1000).toISOString();
}
