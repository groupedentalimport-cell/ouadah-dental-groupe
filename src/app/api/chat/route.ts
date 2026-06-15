import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    // Simple response logic for the chat bot
    const responses: Record<string, string> = {
      default:
        "Merci pour votre message ! Pour une assistance personnalisée, n'hésitez pas à nous contacter directement par téléphone au +213 771 88 89 48 ou par email à groupedentalimport@gmail.com. Notre équipe se fera un plaisir de vous aider.",
      prix:
        "Nos prix varient selon le produit et la configuration. Pour obtenir un devis personnalisé, veuillez utiliser notre formulaire de devis en ligne ou contactez-nous directement au +213 771 88 89 48.",
      livraison:
        "Nous assurons la livraison et l'installation sur les 48 wilayas d'Algérie. Les délais varient de 1 à 6 semaines selon le produit.",
      sav:
        "Notre service après-vente garantit une intervention sous 48h sur tout le territoire national. Contactez-nous au +213 771 88 89 48.",
      garantie:
        "Tous nos équipements bénéficient d'une garantie constructeur allant de 1 à 5 ans selon le produit. L'installation et la formation sont incluses pour la plupart des équipements.",
      fauteuil:
        "Nous proposons une gamme complète de fauteuils dentaires à partir de 3 500 000 DA. Consultez notre catalogue pour découvrir nos modèles.",
      sterilisation:
        "Notre gamme de stérilisation comprend des autoclaves Classe B à partir de 1 800 000 DA. Tous conformes aux normes internationales.",
    };

    // Simple keyword matching
    const lowerMsg = (message || '').toLowerCase();
    let response = responses.default;

    if (lowerMsg.includes('prix') || lowerMsg.includes('tarif') || lowerMsg.includes('coût') || lowerMsg.includes('combien')) {
      response = responses.prix;
    } else if (lowerMsg.includes('livraison') || lowerMsg.includes('délai') || lowerMsg.includes('expédition')) {
      response = responses.livraison;
    } else if (lowerMsg.includes('sav') || lowerMsg.includes('réparation') || lowerMsg.includes('maintenance') || lowerMsg.includes('après-vente')) {
      response = responses.sav;
    } else if (lowerMsg.includes('garantie') || lowerMsg.includes('warranty')) {
      response = responses.garantie;
    } else if (lowerMsg.includes('fauteuil') || lowerMsg.includes('chair')) {
      response = responses.fauteuil;
    } else if (lowerMsg.includes('stérilisation') || lowerMsg.includes('autoclave') || lowerMsg.includes('sterilisation')) {
      response = responses.sterilisation;
    } else if (lowerMsg.includes('bonjour') || lowerMsg.includes('salut') || lowerMsg.includes('hello') || lowerMsg.includes('مرحبا')) {
      response = "Bonjour ! Bienvenue chez ODG. Comment puis-je vous aider ? Je peux vous renseigner sur nos produits, prix, livraison, garantie et service après-vente.";
    }

    return NextResponse.json({ message: response, response });
  } catch (error) {
    return NextResponse.json(
      { message: "Je suis désolé, une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
