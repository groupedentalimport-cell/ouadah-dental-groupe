import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Save to local Prisma database (always works)
    try {
      await db.newsletterSubscriber.upsert({
        where: { email: normalizedEmail },
        update: { statut: 'actif' },
        create: {
          email: normalizedEmail,
          statut: 'actif',
        },
      });
    } catch (dbError) {
      console.error('Failed to save newsletter subscriber to Prisma:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      );
    }

    // Also try to sync to Supabase if configured (optional, non-blocking)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey) {
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
              email: normalizedEmail,
              subscribed_at: new Date().toISOString(),
              source: 'website',
            }),
          }
        );

        if (!response.ok && response.status !== 409) {
          console.warn('Supabase newsletter sync warning:', response.statusText);
        }
      }
    } catch (syncError) {
      console.warn('Supabase newsletter sync skipped:', String(syncError));
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription successful',
    });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
