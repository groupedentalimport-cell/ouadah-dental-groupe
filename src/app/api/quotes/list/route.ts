import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statut = searchParams.get('statut');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where = statut && statut !== 'all' ? { statut } : {};

    const [quotes, total] = await Promise.all([
      db.quote.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.quote.count({ where }),
    ]);

    return NextResponse.json({
      quotes: quotes.map(q => ({
        id: q.id,
        nom: q.nom,
        email: q.email,
        telephone: q.telephone,
        wilaya: q.wilaya,
        type_client: q.typeClient,
        produits_selectionnes: q.produitsSelectionnes,
        message: q.message,
        statut: q.statut,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })),
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
