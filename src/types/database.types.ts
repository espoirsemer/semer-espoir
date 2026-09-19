// Types manuels reflétant supabase/migrations/0001_init.sql.
// À remplacer par `npx supabase gen types typescript` une fois le projet Supabase lié :
// npx supabase gen types typescript --project-id <id> > src/types/database.types.ts

export type UserRole = "parent" | "admin";
export type SubscriptionTier = "tier_1" | "tier_2" | "tier_3";
export type ContentType = "video" | "pdf";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  subscription_tier: SubscriptionTier | null;
  subscription_expires_at: string | null;
  subscription_reminder_sent_at: string | null;
  subscription_expired_sent_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  first_name: string;
  birth_date: string | null;
  language_level: string | null;
  sensory_sensitivities: string[];
  created_at: string;
}

export interface ChildNote {
  id: string;
  child_id: string;
  booking_id: string | null;
  author_id: string;
  body: string;
  created_at: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ContentItem {
  id: string;
  category_id: string | null;
  type: ContentType;
  title: string;
  description: string | null;
  storage_path: string;
  created_at: string;
}

export interface ContentProgress {
  profile_id: string;
  content_item_id: string;
  completed_at: string;
}

export interface CommunityChannel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  locked: boolean;
  created_at: string;
}

export type CommunityAttachmentType = "image" | "pdf" | "audio" | "video";

export interface CommunityMessage {
  id: string;
  channel_id: string;
  author_id: string;
  parent_message_id: string | null;
  body: string;
  pinned: boolean;
  created_at: string;
  attachment_path: string | null;
  attachment_type: CommunityAttachmentType | null;
  attachment_name: string | null;
}

export interface CommunityReaction {
  message_id: string;
  profile_id: string;
  emoji: string;
}

export interface JournalEntry {
  id: string;
  child_id: string;
  entry_date: string;
  anxiety_level: 1 | 2 | 3 | 4 | 5;
  triggers: string[];
  notes: string | null;
  created_at: string;
}

export interface SubscriptionPlan {
  key: SubscriptionTier;
  name: string;
  price_amount: number | null;
  price_currency: string;
  payment_link: string | null;
  updated_at: string;
}

export interface SpecialistMessage {
  id: string;
  parent_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  attachment_path: string | null;
  attachment_type: CommunityAttachmentType | null;
  attachment_name: string | null;
}

export interface ConsultationSlot {
  id: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export type ConsultationBookingStatus = "pending" | "confirmed";

export interface ConsultationBooking {
  id: string;
  slot_id: string;
  parent_id: string;
  child_id: string | null;
  notes: string | null;
  status: ConsultationBookingStatus;
  payment_reference: string | null;
  payment_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConsultationFee {
  id: true;
  amount: number;
  currency: string;
  payment_link: string | null;
  updated_at: string;
}

export type RemoteCareCondition = "autisme" | "imc";
export type RemoteCareStatus = "pending" | "confirmed";

export interface RemoteCarePricing {
  id: true;
  fee_autisme: number;
  fee_imc: number;
  currency: string;
  payment_link: string | null;
  updated_at: string;
}

export interface RemoteCareRequest {
  id: string;
  parent_id: string;
  child_id: string | null;
  condition: RemoteCareCondition;
  amount: number;
  currency: string;
  notes: string | null;
  payment_reference: string | null;
  payment_confirmed: boolean;
  status: RemoteCareStatus;
  created_at: string;
  updated_at: string;
}

export type ResourceFormationKey = "nutrition" | "massage" | "langage";
export type ResourcePurchaseStatus = "pending" | "confirmed";

export interface ResourceFormation {
  key: ResourceFormationKey;
  name: string;
  price_amount: number;
  price_currency: string;
  payment_link: string | null;
  updated_at: string;
}

export interface ResourcePurchase {
  id: string;
  parent_id: string;
  formation_key: ResourceFormationKey;
  amount: number;
  currency: string;
  payment_reference: string | null;
  payment_confirmed: boolean;
  status: ResourcePurchaseStatus;
  created_at: string;
  updated_at: string;
}

export interface ResourceFormationContent {
  id: string;
  formation_key: ResourceFormationKey;
  title: string;
  type: ContentType;
  storage_path: string;
  created_at: string;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  meeting_url: string;
  created_at: string;
}

// Placeholder minimal compatible avec le générique attendu par @supabase/ssr.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
