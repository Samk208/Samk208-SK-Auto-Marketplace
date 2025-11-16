/**
 * Server Actions for Conversations
 *
 * These are Next.js Server Actions for conversation management.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Create a new conversation
 *
 * @param carId - The car ID
 * @param sellerId - The seller's user ID
 * @param initialMessage - Optional initial message
 * @returns The created or existing conversation or error
 */
export async function createConversation(
  carId: string,
  sellerId: string,
  initialMessage?: string
): Promise<{ data?: any; error?: string; existing?: boolean }> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Verify car exists
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('id, seller_id, status')
      .eq('id', carId)
      .single();

    if (carError || !car) {
      return { error: 'Car not found' };
    }

    // Verify seller_id matches
    if (car.seller_id !== sellerId) {
      return { error: 'Invalid seller ID' };
    }

    // Prevent self-messaging
    if (sellerId === user.id) {
      return { error: 'Cannot message yourself' };
    }

    // Check if conversation exists
    const { data: existing, error: existingError } = await supabase
      .from('conversations')
      .select('*')
      .eq('car_id', carId)
      .eq('buyer_id', user.id)
      .eq('seller_id', sellerId)
      .maybeSingle();

    if (existingError) {
      console.error('Failed to check existing conversation:', existingError);
      return { error: 'Failed to check existing conversation' };
    }

    // If exists, optionally send initial message
    if (existing) {
      if (initialMessage) {
        await supabase
          .from('messages')
          .insert({
            conversation_id: existing.id,
            sender_id: user.id,
            content: initialMessage,
          });
      }

      revalidatePath('/messages');
      return { data: existing, existing: true };
    }

    // Create new conversation
    const { data: conversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        car_id: carId,
        buyer_id: user.id,
        seller_id: sellerId,
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create conversation:', createError);
      return { error: 'Failed to create conversation' };
    }

    // Send initial message if provided
    if (initialMessage) {
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          content: initialMessage,
        });
    }

    // Revalidate pages
    revalidatePath('/messages');
    revalidatePath(`/cars/${carId}`);

    return { data: conversation, existing: false };
  } catch (error) {
    console.error('createConversation error:', error);
    return { error: 'Internal server error' };
  }
}

/**
 * Get unread message count for current user
 *
 * @returns Unread count or error
 */
export async function getUnreadMessageCount(): Promise<{
  count?: number;
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Get all user's conversations
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

    if (convError || !conversations) {
      return { count: 0 };
    }

    const conversationIds = conversations.map(c => c.id);

    if (conversationIds.length === 0) {
      return { count: 0 };
    }

    // Count unread messages across all conversations
    const { count, error: countError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', conversationIds)
      .neq('sender_id', user.id)
      .is('read_at', null);

    if (countError) {
      console.error('Failed to count unread messages:', countError);
      return { error: 'Failed to count unread messages' };
    }

    return { count: count || 0 };
  } catch (error) {
    console.error('getUnreadMessageCount error:', error);
    return { error: 'Internal server error' };
  }
}

/**
 * Archive a conversation (hide from main list)
 * Note: This requires adding an 'archived' field to conversations table
 *
 * @param conversationId - The conversation ID
 * @returns Success status or error
 */
export async function archiveConversation(
  conversationId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Verify user is part of the conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('buyer_id, seller_id')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return { error: 'Conversation not found' };
    }

    if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) {
      return { error: 'Forbidden' };
    }

    // For now, we'll just return success
    // In a future migration, add an 'archived_by' JSONB field to track who archived
    // { "user_id_1": true, "user_id_2": false }

    revalidatePath('/messages');

    return { success: true };
  } catch (error) {
    console.error('archiveConversation error:', error);
    return { error: 'Internal server error' };
  }
}
