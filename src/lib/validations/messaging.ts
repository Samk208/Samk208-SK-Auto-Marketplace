/**
 * Zod Validation Schemas for Messaging
 *
 * This module defines runtime validation schemas for:
 * - Message creation
 * - Conversation creation
 * - Message queries
 */

import { z } from 'zod';

/**
 * Schema for creating a new message
 */
export const createMessageSchema = z.object({
  conversation_id: z.string().uuid({
    message: 'Invalid conversation ID format',
  }),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message too long (max 5000 characters)'),
  translate: z.boolean().optional().default(false),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

/**
 * Schema for creating a new conversation
 */
export const createConversationSchema = z.object({
  car_id: z.string().uuid({
    message: 'Invalid car ID format',
  }),
  seller_id: z.string().uuid({
    message: 'Invalid seller ID format',
  }),
  initial_message: z
    .string()
    .min(1, 'Initial message cannot be empty')
    .max(5000, 'Message too long (max 5000 characters)')
    .optional(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;

/**
 * Schema for querying messages
 */
export const getMessagesSchema = z.object({
  conversation_id: z.string().uuid({
    message: 'Invalid conversation ID format',
  }),
  limit: z
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .default(50),
  offset: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0),
  before: z.string().datetime().optional(), // ISO timestamp
});

export type GetMessagesInput = z.infer<typeof getMessagesSchema>;

/**
 * Schema for marking messages as read
 */
export const markMessagesReadSchema = z.object({
  conversation_id: z.string().uuid({
    message: 'Invalid conversation ID format',
  }),
  message_ids: z
    .array(z.string().uuid())
    .min(1, 'At least one message ID required')
    .max(100, 'Cannot mark more than 100 messages at once'),
});

export type MarkMessagesReadInput = z.infer<typeof markMessagesReadSchema>;

/**
 * Schema for querying conversations
 */
export const getConversationsSchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .max(50)
    .optional()
    .default(20),
  offset: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0),
  unread_only: z.boolean().optional().default(false),
});

export type GetConversationsInput = z.infer<typeof getConversationsSchema>;

/**
 * Schema for conversation details response
 */
export const conversationSchema = z.object({
  id: z.string().uuid(),
  car_id: z.string().uuid(),
  buyer_id: z.string().uuid(),
  seller_id: z.string().uuid(),
  last_message_at: z.string().datetime(),
  created_at: z.string().datetime(),
  unread_count: z.number().int().nonnegative().optional(),
});

export type Conversation = z.infer<typeof conversationSchema>;

/**
 * Schema for message response
 */
export const messageSchema = z.object({
  id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  sender_id: z.string().uuid(),
  content: z.string(),
  content_translated: z.string().nullable().optional(),
  read_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export type Message = z.infer<typeof messageSchema>;
