
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  filePreview?: string | null;
  votes?: number;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: 'Easy' | 'Medium' | 'Hard';
  completedAt?: any;
  dueDate?: any;
}

export interface Idea {
  id: string;
  text: string;
  createdAt: any;
}

export interface UserContext {
    context: string;
    goals?: string;
    skills?: string[];
}

export interface Note {
    id: string;
    user_id: string;
    title: string | null;
    content: string | null;
    created_at: string;
    updated_at: string;
}

// --- NEW DEEP LINKING DATA MODEL ---

/**
 * Represents the data structure for a single short link in Firestore.
 * This model is designed for granular campaign tracking and analytics.
 */
export interface ShortLink {
  id: string; // The unique short code generated for the link
  originalUrl: string; // The final destination URL
  
  // Campaign & Analytics Fields
  campaignType?: 'email' | 'social' | 'paid_ads' | 'organic' | 'referral';
  tags?: string[]; // e.g., ["spring_sale", "new_product_launch"]
  utmParameters?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  
  // Core Metrics
  clickCount: number;
  createdAt: any; // Firestore Timestamp
  createdBy: string; // User ID
  
  // Migration & Historical Data
  isMigrated?: boolean;
  legacyShortCode?: string; // The short code from the previous system
  historicalAnalytics?: {
    clicks?: number;
    conversions?: number;
    sourceSystem?: string;
  };
}

/**
 * Represents a mapping from a legacy short code to its new, corresponding
 * short link document in the main `shortLinks` collection.
 * This is critical for ensuring old links continue to work post-migration.
 */
export interface RedirectMapping {
  id: string; // The legacy short code
  newShortCode: string; // The new short code in the `shortLinks` collection
}
