// Re-export client and server utilities
export { createClient } from './client';
export { createServerSupabaseClient } from './server';

// Create a default client instance for convenience
// Note: This creates a new instance each time, which is intentional for Next.js
import { createClient } from './client';

export const supabase = createClient();
