/**
 * Server Actions for Messaging
 *
 * These are Next.js Server Actions for optimistic UI updates and mutations.
 * They automatically revalidate cached data and provide better UX.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Send a message in a conversation
 *
 * @param conversationId - The conversation ID
 * @param content - The message content
 * @returns The created message or error
 */
export async function sendMessage(
  conversationId: string,
  content: string
): Promise<{ data?: any; error?: string }> {
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
      return { error: 'Forbidden - not a participant in this conversation' };
    }

    // Insert message
    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to send message:', insertError);
      return { error: 'Failed to send message' };
    }

    // Revalidate conversations and messages pages
    revalidatePath('/messages');
    revalidatePath(`/messages/${conversationId}`);

    return { data: message };
  } catch (error) {
    console.error('sendMessage error:', error);
    return { error: 'Internal server error' };
  }
}

/**
 * Mark messages as read
 *
 * @param conversationId - The conversation ID
 * @param messageIds - Array of message IDs to mark as read
 * @returns Success status or error
 */
export async function markMessagesAsRead(
  conversationId: string,
  messageIds: string[]
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

    // Mark messages as read (only messages not sent by current user)
    const { error: updateError } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .in('id', messageIds)
      .neq('sender_id', user.id)
      .is('read_at', null);

    if (updateError) {
      console.error('Failed to mark messages as read:', updateError);
      return { error: 'Failed to mark messages as read' };
    }

    // Revalidate messages page
    revalidatePath('/messages');
    revalidatePath(`/messages/${conversationId}`);

    return { success: true };
  } catch (error) {
    console.error('markMessagesAsRead error:', error);
    return { error: 'Internal server error' };
  }
}

/**
 * Delete a message (soft delete - mark as deleted)
 *
 * @param messageId - The message ID
 * @returns Success status or error
 */
export async function deleteMessage(
  messageId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Verify user owns the message
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('sender_id, conversation_id')
      .eq('id', messageId)
      .single();

    if (fetchError || !message) {
      return { error: 'Message not found' };
    }

    if (message.sender_id !== user.id) {
      return { error: 'Forbidden - can only delete your own messages' };
    }

    // Instead of deleting, update content to indicate deletion
    const { error: updateError } = await supabase
      .from('messages')
      .update({
        content: '[Message deleted]',
      })
      .eq('id', messageId);

    if (updateError) {
      console.error('Failed to delete message:', updateError);
      return { error: 'Failed to delete message' };
    }

    // Revalidate messages page
    revalidatePath('/messages');
    revalidatePath(`/messages/${message.conversation_id}`);

    return { success: true };
  } catch (error) {
    console.error('deleteMessage error:', error);
    return { error: 'Internal server error' };
  }
}
