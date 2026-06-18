import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const VALID_STATUSES = ['nouveau', 'en_cours', 'traite', 'archive'];

export async function PATCH(request: NextRequest) {
  try {
    const { id, statut } = await request.json();

    if (!id || !statut) {
      return NextResponse.json(
        { error: 'Missing required fields: id, statut' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(statut)) {
      return NextResponse.json(
        { error: `Invalid statut. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await db.quote.update({
      where: { id },
      data: { statut },
    });

    return NextResponse.json({
      success: true,
      quote: {
        id: updated.id,
        nom: updated.nom,
        email: updated.email,
        telephone: updated.telephone,
        wilaya: updated.wilaya,
        type_client: updated.typeClient,
        produits_selectionnes: updated.produitsSelectionnes,
        message: updated.message,
        statut: updated.statut,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error('Failed to update quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}
