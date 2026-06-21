import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Map English frontend values to French constraint values
const TYPE_CLIENT_MAP: Record<string, string> = {
  clinic: 'clinique',
  reseller: 'revendeur',
  counter: 'comptoir',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, email, telephone, wilaya, type_client, produits_selectionnes, message } = body;

    // Validate required fields
    if (!nom || !email || !telephone || !wilaya) {
      return NextResponse.json(
        { error: 'Missing required fields: nom, email, telephone, wilaya' },
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

    // Map type_client from English to French constraint value
    const mappedTypeClient = TYPE_CLIENT_MAP[type_client] || type_client || 'clinique';

    // Handle produits_selectionnes - store as JSON string
    const produitsStr = produits_selectionnes
      ? (typeof produits_selectionnes === 'string'
          ? produits_selectionnes
          : JSON.stringify(produits_selectionnes))
      : JSON.stringify([]);

    // Save to local Prisma database (always works, no external dependency)
    try {
      await db.quote.create({
        data: {
          nom,
          email,
          telephone,
          wilaya,
          typeClient: mappedTypeClient,
          produitsSelectionnes: produitsStr,
          message: message || null,
          statut: 'nouveau',
        },
      });
    } catch (dbError) {
      console.error('Failed to save quote to Prisma database:', dbError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement du devis' },
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

        const { error } = await supabase.from('quotes').insert({
          nom,
          email,
          telephone,
          wilaya,
          type_client: mappedTypeClient,
          produits_selectionnes: produitsStr,
          message: message || null,
          statut: 'nouveau',
        });

        if (error) {
          console.warn('Supabase sync warning (non-blocking):', error.message);
        }
      }
    } catch (syncError) {
      // Supabase sync failure is non-blocking - data is already saved to Prisma
      console.warn('Supabase sync skipped:', String(syncError));
    }

    return NextResponse.json({ success: true, message: 'Demande de devis envoyée avec succès' });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la demande de devis' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'ODG Quotes API' });
}
