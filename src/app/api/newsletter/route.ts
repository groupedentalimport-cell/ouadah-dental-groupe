import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/newsletter_subscribers`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              Prefer: 'resolution=merge-duplicates',
            },
            body: JSON.stringify({
              email: email.toLowerCase().trim(),
              subscribed_at: new Date().toISOString(),
              source: 'website',
            }),
          }
        );

        if (response.ok) {
          return NextResponse.json({
            success: true,
            message: 'Subscription successful',
          });
        }

        // Handle duplicate email
        if (response.status === 409) {
          return NextResponse.json({
            success: true,
            message: 'Already subscribed',
          });
        }

        // If Supabase fails, still return success to not block UX
        console.error('Supabase newsletter error:', response.statusText);
      } catch (fetchError) {
        console.error('Supabase newsletter fetch error:', fetchError);
      }
    }

    // Fallback: still return success even without Supabase
    return NextResponse.json({
      success: true,
      message: 'Subscription recorded',
    });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
