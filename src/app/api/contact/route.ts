import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to local Prisma database (always works)
    try {
      await db.contactMessage.create({
        data: {
          name,
          email,
          phone: phone || null,
          subject,
          message,
          statut: 'nouveau',
        },
      });
    } catch (dbError) {
      console.error('Failed to save contact message to Prisma:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement du message' },
        { status: 500 }
      );
    }

    // Also try to sync to Supabase if configured (optional, non-blocking)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.from('contact_messages').insert({
          name,
          email,
          phone: phone || null,
          subject,
          message,
          statut: 'nouveau',
        });
      }
    } catch (syncError) {
      console.warn('Supabase sync skipped:', String(syncError));
    }

    return NextResponse.json({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'ODG Contact API' });
}
