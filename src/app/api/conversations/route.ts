/**
 * Conversations API Route
 *
 * Endpoints:
 * - POST /api/conversations - Create a new conversation
 * - GET /api/conversations - List user's conversations
 * - GET /api/conversations/{id} - Get conversation details
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createConversationSchema, getConversationsSchema } from '@/lib/validations/messaging';

/**
 * POST /api/conversations
 * Create a new conversation (when buyer inquires about a car)
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createConversationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { car_id, seller_id, initial_message } = validationResult.data;

    // Verify car exists and get seller
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('id, seller_id, status')
      .eq('id', car_id)
      .single();

    if (carError || !car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    // Verify seller_id matches car's seller
    if (car.seller_id !== seller_id) {
      return NextResponse.json(
        { error: 'Invalid seller ID for this car' },
        { status: 400 }
      );
    }

    // Prevent seller from messaging themselves
    if (seller_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot create conversation with yourself' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const { data: existing, error: existingError } = await supabase
      .from('conversations')
      .select('id')
      .eq('car_id', car_id)
      .eq('buyer_id', user.id)
      .eq('seller_id', seller_id)
      .maybeSingle();

    if (existingError) {
      console.error('Failed to check existing conversation:', existingError);
      return NextResponse.json(
        { error: 'Failed to check existing conversation' },
        { status: 500 }
      );
    }

    // If conversation exists, return it
    if (existing) {
      // If initial message provided, send it
      if (initial_message) {
        await supabase
          .from('messages')
          .insert({
            conversation_id: existing.id,
            sender_id: user.id,
            content: initial_message,
          });
      }

      return NextResponse.json(
        { conversation: existing, existing: true },
        { status: 200 }
      );
    }

    // Create new conversation
    const { data: conversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        car_id,
        buyer_id: user.id,
        seller_id,
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create conversation:', createError);
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    // If initial message provided, send it
    if (initial_message) {
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          content: initial_message,
        });
    }

    // Note: inquiry_count is incremented automatically by database trigger

    return NextResponse.json(
      { conversation, existing: false },
      { status: 201 }
    );
  } catch (error) {
    console.error('Conversations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/conversations?limit={n}&offset={n}&unread_only={bool}
 * List user's conversations
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const unread_only = searchParams.get('unread_only') === 'true';

    // Validate parameters
    const validationResult = getConversationsSchema.safeParse({
      limit,
      offset,
      unread_only,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const validatedParams = validationResult.data;

    // Build query to fetch conversations
    let query = supabase
      .from('conversations')
      .select(`
        *,
        car:cars!inner(
          id,
          make,
          model,
          year,
          price_fob,
          currency,
          primary_photo
        ),
        buyer:profiles(
          id,
          full_name,
          avatar_url
        ),
        seller:profiles(
          id,
          full_name,
          avatar_url
        )
      `, { count: 'exact' })
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    // Apply pagination
    query = query.range(
      validatedParams.offset,
      validatedParams.offset + validatedParams.limit - 1
    );

    const { data: conversations, error: fetchError, count } = await query;

    if (fetchError) {
      console.error('Failed to fetch conversations:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      );
    }

    // For each conversation, get unread count
    const conversationsWithUnread = await Promise.all(
      (conversations || []).map(async (conv) => {
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', user.id)
          .is('read_at', null);

        return {
          ...conv,
          unread_count: unreadCount || 0,
        };
      })
    );

    // Filter by unread if requested
    const filteredConversations = validatedParams.unread_only
      ? conversationsWithUnread.filter(conv => conv.unread_count > 0)
      : conversationsWithUnread;

    return NextResponse.json({
      conversations: filteredConversations,
      total: count || 0,
      limit: validatedParams.limit,
      offset: validatedParams.offset,
    });
  } catch (error) {
    console.error('Conversations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
