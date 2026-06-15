'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = 'fr' | 'ar';

interface Translations {
  [key: string]: string;
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
  dir: 'ltr',
  isRTL: false,
});

// ============================================================
// FRENCH TRANSLATIONS
// ============================================================
const fr: Translations = {
  // --- NAV ---
  'nav.home': 'Accueil',
  'nav.catalogue': 'Catalogue',
  'nav.about': 'À propos',
  'nav.blog': 'Blog',
  'nav.contact': 'Contact',
  'nav.quote': 'Demander un devis',
  'nav.admin': 'Administration',
  'nav.login': 'Connexion',
  'nav.logout': 'Déconnexion',
  'nav.dashboard': 'Tableau de bord',
  'nav.products': 'Produits',
  'nav.blogPosts': 'Articles',
  'nav.quotes': 'Devis',
  'nav.messages': 'Messages',
  'nav.language': 'Langue',
  'nav.cart': 'Panier devis',
  'nav.search': 'Rechercher...',
  'nav.menu': 'Menu',
  'nav.close': 'Fermer',
  'nav.categories': 'Catégories',
  'nav.settings': 'Paramètres',
  'nav.allProducts': 'Tous les produits',
  'nav.newArrivals': 'Nouveautés',
  'nav.bestSellers': 'Meilleures ventes',
  'nav.brand': 'ODG',

  // --- HERO ---
  'hero.title': 'Équipements Dentaires Professionnels',
  'hero.subtitle': 'Fournisseur leader en Algérie depuis 2009',
  'hero.description': 'Distributeur exclusif des plus grandes marques mondiales. Installation, formation et SAV sur tout le territoire.',
  'hero.cta.catalogue': 'Voir le catalogue',
  'hero.cta.quote': 'Demander un devis',

  // --- STATS ---
  'stats.clinics': 'Cliniques équipées',
  'stats.wilayas': 'Wilayas couvertes',
  'stats.brands': 'Marques distribuées',
  'stats.sav': 'Heures SAV',

  // --- CATEGORIES ---
  'categories.title': 'Nos Catégories',
  'categories.subtitle': 'Découvrez notre gamme complète d\'équipements dentaires',
  'categories.fauteuils': 'Fauteuils Dentaires',
  'categories.unites': 'Unités Dentaires',
  'categories.radiologie': 'Radiologie',
  'categories.sterilisation': 'Stérilisation',
  'categories.pneumatiques': 'Pneumatiques',
  'categories.consommables': 'Consommables',
  'categories.instruments': 'Instruments',
  'categories.mobilier': 'Mobilier',

  // --- PRODUCTS ---
  'products.title': 'Notre Catalogue',
  'products.subtitle': 'Découvrez notre gamme complète d\'équipements dentaires professionnels',
  'products.featured': 'Produits vedettes',
  'products.new': 'Nouveau',
  'products.bestSeller': 'Best-seller',
  'catalogue.brands': 'Marques',
  'catalogue.allBrands': 'Toutes les marques',
  'products.inStock': 'En stock',
  'products.outOfStock': 'Rupture de stock',
  'products.addQuote': 'Ajouter au devis',
  'products.viewDetails': 'Voir les détails',
  'products.compare': 'Comparer',
  'products.filter': 'Filtrer',
  'products.sort': 'Trier',
  'products.sort.newest': 'Plus récent',
  'products.sort.priceAsc': 'Prix croissant',
  'products.sort.priceDesc': 'Prix décroissant',
  'products.sort.name': 'Nom A-Z',
  'products.noResults': 'Aucun produit trouvé',
  'products.all': 'Tous',
  'products.specs': 'Caractéristiques',
  'products.features': 'Points forts',
  'products.warranty': 'Garantie',
  'products.delivery': 'Livraison',
  'products.installation': 'Installation incluse',
  'products.training': 'Formation incluse',
  'products.brand': 'Marque',
  'products.origin': 'Origine',
  'products.ref': 'Référence',
  'products.downloadPdf': 'Télécharger la fiche technique',
  'products.videos': 'Vidéos',
  'products.priceOnQuote': 'Sur devis',
  'products.requestQuote': 'Demander un devis',
  'products.clearFilters': 'Réinitialiser les filtres',
  'products.activeFilters': 'Filtres actifs',
  'products.gridView': 'Grille',
  'products.listView': 'Liste',
  'products.filters': 'Filtres',
  'products.noResultsTip': 'Essayez de modifier vos critères de recherche ou de réinitialiser les filtres',
  'products.relatedProducts': 'Produits similaires',
  'products.description': 'Description',
  'products.availability': 'Disponibilité',

  // --- PRODUCT DETAIL ---
  'product.specifications': 'Spécifications techniques',
  'product.keyFeatures': 'Caractéristiques clés',
  'product.videos': 'Vidéos du produit',
  'product.warranty': 'Garantie',
  'product.delivery': 'Délai de livraison',
  'product.installation': 'Installation incluse',
  'product.training': 'Formation incluse',
  'product.origin': 'Origine',
  'product.reference': 'Référence',
  'product.spec': 'Spécification',
  'product.value': 'Valeur',
  'product.watchVideo': 'Regarder la vidéo',
  'product.noVideos': 'Aucune vidéo disponible',

  // --- COMPARE ---
  'compare.title': 'Comparaison de produits',
  'compare.add': 'Comparer',
  'compare.added': 'Ajouté',
  'compare.remove': 'Retirer',
  'compare.clear': 'Vider la liste',
  'compare.now': 'Comparer maintenant',
  'compare.empty': 'Aucun produit à comparer',
  'compare.maxReached': 'Maximum atteint (4)',
  'compare.selectMin': 'Sélectionnez au moins 2 produits',
  'compare.specs': 'Caractéristiques',
  'compare.features': 'Points forts',
  'compare.brand': 'Marque',
  'compare.price': 'Prix',
  'compare.stock': 'Disponibilité',
  'compare.warranty': 'Garantie',
  'compare.image': 'Image',
  'compare.name': 'Nom',
  'compare.origin': 'Origine',
  'compare.ref': 'Référence',
  'compare.category': 'Catégorie',
  'compare.backToCatalogue': 'Retour au catalogue',
  'compare.items': 'produit(s) sélectionné(s)',
  'compare.highlightDiff': 'Différences',
  'compare.noSpecs': 'Aucune spécification',
  'compare.noFeatures': 'Aucun point fort',

  // --- WISHLIST ---
  'wishlist.title': 'Mes favoris',
  'wishlist.empty': 'Aucun produit dans vos favoris',
  'wishlist.added': 'Ajouté aux favoris',
  'wishlist.removed': 'Retiré des favoris',
  'wishlist.viewAll': 'Voir tout',
  'wishlist.clearAll': 'Tout supprimer',
  'products.addToWishlist': 'Ajouter aux favoris',
  'products.removeFromWishlist': 'Retirer des favoris',

  // --- BLOG ---
  'blog.title': 'Blog & Actualités',
  'blog.subtitle': 'Restez informé des dernières tendances en équipement dentaire',
  'blog.readMore': 'Lire la suite',
  'blog.readTime': 'min de lecture',
  'blog.share': 'Partager',
  'blog.copyLink': 'Copier le lien',
  'blog.backToBlog': 'Retour au blog',
  'blog.related': 'Articles similaires',
  'blog.by': 'Par',

  // --- ABOUT ---
  'about.title': 'À propos d\'ODG',
  'about.subtitle': 'Votre partenaire de confiance depuis 2009',
  'about.history': 'Notre Histoire',
  'about.history.p1': 'Fondée en 2009, OUADAH DENTAL GROUPE (ODG) est devenue en quelques années le leader de la distribution d\'équipements dentaires en Algérie. Notre engagement : fournir aux professionnels de santé dentaire les meilleurs outils pour exercer leur métier dans les meilleures conditions.',
  'about.history.p2': 'Avec une présence dans 48 wilayas et un réseau de techniciens qualifiés, ODG assure l\'installation, la formation et le service après-vente sur l\'ensemble du territoire algérien. Notre partenariat avec les plus grandes marques mondiales garantit un accès aux technologies les plus avancées.',
  'about.mission': 'Notre Mission',
  'about.mission.text': 'Rendre les équipements dentaires de qualité mondiale accessibles à tous les praticiens en Algérie, avec un service après-vente irréprochable.',
  'about.values': 'Nos Valeurs',
  'about.values.excellence': 'Excellence',
  'about.values.excellence.text': 'Nous sélectionnons uniquement les meilleurs produits des marques les plus reconnues.',
  'about.values.proximity': 'Proximité',
  'about.values.proximity.text': 'Un réseau de techniciens couvrant 48 wilayas pour un SAV réactif.',
  'about.values.innovation': 'Innovation',
  'about.values.innovation.text': 'Nous introduisons en Algérie les dernières technologies dentaires mondiales.',
  'about.values.trust': 'Confiance',
  'about.values.trust.text': 'Plus de 500 cliniques nous font confiance depuis 2009.',

  // --- CONTACT ---
  'contact.title': 'Contactez-nous',
  'contact.subtitle': 'Notre équipe est à votre disposition',
  'contact.phone': 'Téléphone',
  'contact.email': 'Email',
  'contact.address': 'Adresse',
  'contact.hours': 'Horaires',
  'contact.form.name': 'Nom complet',
  'contact.form.email': 'Adresse email',
  'contact.form.phone': 'Téléphone',
  'contact.form.subject': 'Sujet',
  'contact.form.message': 'Message',
  'contact.form.send': 'Envoyer le message',
  'contact.form.sending': 'Envoi en cours...',
  'contact.form.success': 'Message envoyé avec succès !',
  'contact.form.error': 'Erreur lors de l\'envoi. Veuillez réessayer.',
  'contact.findUs': 'Comment nous trouver',
  'contact.callUs': 'Appelez-nous',
  'contact.whatsappUs': 'WhatsApp',

  // --- QUOTE ---
  'quote.title': 'Demander un Devis',
  'quote.subtitle': 'Remplissez le formulaire ci-dessous pour recevoir un devis personnalisé sous 24h',
  'quote.step1': 'Vos Informations',
  'quote.step2': 'Sélection Produits',
  'quote.step3': 'Récapitulatif',
  'quote.clientType': 'Type de client',
  'quote.clientType.clinic': 'Clinique dentaire',
  'quote.clientType.reseller': 'Revendeur',
  'quote.clientType.counter': 'Comptoir',
  'quote.fullName': 'Nom complet',
  'quote.email': 'Adresse email',
  'quote.phone': 'Téléphone',
  'quote.wilaya': 'Wilaya',
  'quote.message': 'Message (optionnel)',
  'quote.products': 'Produits sélectionnés',
  'quote.quantity': 'Quantité',
  'quote.total': 'Total estimé',
  'quote.submit': 'Envoyer la demande',
  'quote.submitting': 'Envoi en cours...',
  'quote.success': 'Demande de devis envoyée avec succès ! Nous vous contacterons sous 24h.',
  'quote.error': 'Erreur lors de l\'envoi. Veuillez réessayer.',
  'quote.empty': 'Votre sélection est vide',
  'quote.addProducts': 'Ajoutez des produits depuis le catalogue',
  'quote.next': 'Suivant',
  'quote.prev': 'Précédent',

  // --- FOOTER ---
  'footer.description': 'Distributeur exclusif d\'équipements dentaires professionnels en Algérie depuis 2009.',
  'footer.quickLinks': 'Liens rapides',
  'footer.contact': 'Contact',
  'footer.legal': 'Légal',
  'footer.legal.mentions': 'Mentions légales',
  'footer.legal.cgv': 'Conditions générales de vente',
  'footer.privacy': 'Politique de confidentialité',
  'footer.algeria': 'Algérie',
  'footer.rights': 'Tous droits réservés.',
  'footer.madeWith': 'Fait avec',
  'footer.in': 'en',
  'footer.cta': 'Équipez votre cabinet avec les meilleurs',
  'footer.newsletter.mini': 'Inscrivez-vous à notre newsletter',
  'footer.requestQuote': 'Demander un devis',
  'footer.backToTop': 'Retour en haut ↑',

  // --- TESTIMONIALS ---
  'testimonials.title': 'Ce que disent nos clients',
  'testimonials.subtitle': 'Ils nous font confiance',

  // --- NEWSLETTER ---
  'newsletter.title': 'Restez informé',
  'newsletter.subtitle': 'Recevez nos offres exclusives et nouveautés',
  'newsletter.placeholder': 'Votre adresse email',
  'newsletter.subscribe': 'S\'inscrire',
  'newsletter.privacy': 'Nous respectons votre vie privée. Désabonnement possible à tout moment.',
  'newsletter.success': 'Merci ! Vous êtes inscrit à notre newsletter.',

  // --- ADMIN ---
  'admin.login.title': 'Connexion Admin',
  'admin.login.password': 'Mot de passe',
  'admin.login.submit': 'Se connecter',
  'admin.login.error': 'Mot de passe incorrect',
  'admin.dashboard.title': 'Tableau de bord',
  'admin.dashboard.totalProducts': 'Total Produits',
  'admin.dashboard.totalQuotes': 'Total Devis',
  'admin.dashboard.newQuotes': 'Nouveaux Devis',
  'admin.dashboard.totalBlog': 'Articles Blog',
  'admin.products.title': 'Gestion des Produits',
  'admin.products.add': 'Ajouter un produit',
  'admin.products.edit': 'Modifier',
  'admin.products.delete': 'Supprimer',
  'admin.products.save': 'Enregistrer',
  'admin.products.cancel': 'Annuler',
  'admin.products.name': 'Nom du produit',
  'admin.products.category': 'Catégorie',
  'admin.products.price': 'Prix',
  'admin.products.description': 'Description',
  'admin.products.images': 'Images',
  'admin.blog.title': 'Gestion du Blog',
  'admin.blog.add': 'Ajouter un article',
  'admin.quotes.title': 'Gestion des Devis',
  'admin.quotes.status': 'Statut',
  'admin.quotes.new': 'Nouveau',
  'admin.quotes.inProgress': 'En cours',
  'admin.quotes.processed': 'Traité',
  'admin.quotes.archived': 'Archivé',
  'admin.settings.title': 'Paramètres',
  'admin.settings.logo': 'Logo & Marque',
  'admin.settings.contact': 'Contact',
  'admin.settings.map': 'Carte & Localisation',
  'admin.settings.productInfo': 'Infos Produits',
  'admin.settings.social': 'Réseaux Sociaux',
  'admin.settings.stats': 'Statistiques',
  'admin.settings.about': 'À propos',
  'admin.settings.save': 'Enregistrer',
  'admin.settings.saved': 'Paramètres enregistrés !',
  'admin.categories.title': 'Gestion des Catégories',

  // --- COMMON ---
  'common.loading': 'Chargement...',
  'common.error': 'Une erreur est survenue',
  'common.retry': 'Réessayer',
  'common.save': 'Enregistrer',
  'common.cancel': 'Annuler',
  'common.delete': 'Supprimer',
  'common.edit': 'Modifier',
  'common.add': 'Ajouter',
  'common.search': 'Rechercher',
  'common.filter': 'Filtrer',
  'common.sort': 'Trier',
  'common.noResults': 'Aucun résultat',
  'common.back': 'Retour',
  'common.next': 'Suivant',
  'common.prev': 'Précédent',
  'common.seeAll': 'Voir tout',
  'common.or': 'ou',
  'common.and': 'et',
  'common.da': 'DA',

  // --- ABOUT MILESTONES ---
  'about.milestones.title': 'Nos Étapes Clés',
  'about.milestones.2009': 'Création d\'ODG à Oran',
  'about.milestones.2009.desc': 'Fondation de la société avec 3 employés et une vision claire.',
  'about.milestones.2012': 'Partenariat Owandy',
  'about.milestones.2012.desc': 'Premier partenariat exclusif avec une marque internationale.',
  'about.milestones.2015': 'Couverture nationale',
  'about.milestones.2015.desc': 'Expansion dans les 48 wilayas avec un réseau de techniciens.',
  'about.milestones.2018': 'Centre de formation',
  'about.milestones.2018.desc': 'Ouverture du centre de formation continue pour les praticiens.',
  'about.milestones.2021': '15+ marques partenaires',
  'about.milestones.2021.desc': 'Élargissement du portefeuille avec les leaders mondiaux.',
  'about.milestones.2024': 'Nouveau show-room',
  'about.milestones.2024.desc': 'Inauguration d\'un espace de démonstration de 500m².',

  // --- ABOUT KEY FIGURES ---
  'about.figures.title': 'ODG en Chiffres',

  // --- ABOUT CERTIFICATIONS ---
  'about.certifications.title': 'Certifications & Accréditations',
  'about.certifications.iso': 'ISO 9001:2015',
  'about.certifications.iso.desc': 'Système de management de la qualité certifié.',
  'about.certifications.ce': 'Marquage CE',
  'about.certifications.ce.desc': 'Conformité aux normes européennes.',
  'about.certifications.fda': 'Enregistré FDA',
  'about.certifications.fda.desc': 'Conformité aux réglementations américaines.',

  // --- CONTACT FAQ ---
  'contact.faq.title': 'Questions Fréquentes',
  'contact.faq.q1': 'Quels sont vos délais de livraison ?',
  'contact.faq.a1': 'Nos délais de livraison varient de 48h à 2 semaines selon le produit et la wilaya. Les produits en stock sont livrés sous 48h.',
  'contact.faq.q2': 'Proposez-vous l\'installation des équipements ?',
  'contact.faq.a2': 'Oui, l\'installation est incluse pour tous les équipements. Nos techniciens certifiés se déplacent dans tout le territoire.',
  'contact.faq.q3': 'Comment demander un devis ?',
  'contact.faq.a3': 'Vous pouvez demander un devis directement sur notre site via le formulaire de devis, par téléphone ou par email. Réponse sous 24h.',
  'contact.faq.q4': 'Quelle est votre politique de garantie ?',
  'contact.faq.a4': 'Tous nos équipements sont garantis minimum 2 ans, avec extension possible. Le SAV est assuré sur tout le territoire algérien.',
  'contact.faq.q5': 'Proposez-vous des formations ?',
  'contact.faq.a5': 'Oui, nous organisons des formations régulières dans notre centre à Oran et des sessions pratiques dans les cliniques.',
  'contact.faq.q6': 'Quels modes de paiement acceptez-vous ?',
  'contact.faq.a6': 'Nous acceptons les virements bancaires, chèques et facilités de paiement en 3 fois pour les professionnels.',

  // --- BLOG ENHANCED ---
  'blog.featured': 'Article à la une',
  'blog.allCategories': 'Toutes les catégories',
  'blog.readTimeBadge': 'min',
  'blog.category': 'Catégorie',

  // --- FOOTER ENHANCED ---
  'footer.social': 'Suivez-nous',
  'footer.newsletter.title': 'Newsletter',

  // --- NAVBAR ENHANCED ---
  'nav.searchPlaceholder': 'Rechercher un produit...',

  // --- PRODUCT DETAIL ENHANCED ---
  'products.share': 'Partager',
  'products.linkCopied': 'Lien copié !',
  'products.print': 'Imprimer',
  'products.breadcrumb.home': 'Accueil',
  'products.addToQuoteSticky': 'Ajouter au devis',
  'products.downloadInfo': 'Télécharger',

  // --- SHARE ---
  'share.copyLink': 'Copier le lien',
  'share.whatsapp': 'Partager sur WhatsApp',
  'share.facebook': 'Partager sur Facebook',
  'share.linkedin': 'Partager sur LinkedIn',
  'share.linkCopied': 'Lien copié !',

  // --- QUICK VIEW ---
  'products.quickView': 'Aperçu rapide',
  'products.quickView.title': 'Aperçu du produit',
  'products.quickView.viewFull': 'Voir la fiche complète',
  'products.quickView.addToQuote': 'Ajouter au devis',
  'products.quickView.compare': 'Comparer',
  'products.quickView.addedToCompare': 'Ajouté à la comparaison',
  'products.quickView.inStock': 'En stock',
  'products.quickView.outOfStock': 'Rupture de stock',
  'products.quickView.brand': 'Marque',
  'products.quickView.reference': 'Réf.',
  'products.quickView.category': 'Catégorie',

  // --- RECENTLY VIEWED ---
  'products.recentlyViewed': 'Produits récemment consultés',
  'products.recentlyViewed.empty': 'Aucun produit consulté récemment',
  'products.recentlyViewed.clear': 'Effacer l\'historique',

  // --- ADMIN ENHANCED ---
  'admin.export_csv': 'Exporter en CSV',
  'admin.bulk_delete': 'Supprimer la sélection',
  'admin.select_all': 'Tout sélectionner',
  'admin.deselect_all': 'Tout désélectionner',
  'admin.product_status': 'Statut du produit',
  'admin.active': 'Actif',
  'admin.inactive': 'Inactif',
  'admin.preview': 'Aperçu',
  'admin.business_hours': 'Horaires d\'ouverture',
  'admin.notifications': 'Notifications',
  'admin.no_notifications': 'Aucune notification',
  'admin.recent_orders': 'Commandes récentes',
  'admin.order_id': 'N° Commande',
  'admin.client_name': 'Nom du client',
  'admin.monthly_quotes': 'Devis mensuels',
  'admin.quick_stats': 'Statistiques rapides',
  'admin.logo_upload': 'Télécharger le logo',
  'admin.social_links': 'Liens réseaux sociaux',
  'admin.preview_changes': 'Aperçu des modifications',
  'admin.whatsapp': 'WhatsApp',

  // --- PRODUCT ENHANCED ---
  'products.price_range': 'Gamme de prix',
  'products.min_price': 'Prix minimum',
  'products.max_price': 'Prix maximum',
  'products.on_request': 'Sur demande',
  'products.gallery': 'Galerie',
  'products.zoom': 'Zoom',
  'products.next_image': 'Image suivante',
  'products.prev_image': 'Image précédente',
  'products.close_gallery': 'Fermer la galerie',

  // --- THEME ---
  'theme.dark_mode': 'Mode sombre',
  'theme.light_mode': 'Mode clair',
  'theme.toggle': 'Changer de thème',

  // --- GENERAL ---
  'general.back_to_top': 'Retour en haut',
  'general.certifications': 'Certifications',
  'general.iso_certified': 'Certifié ISO',
  'general.ce_marked': 'Marqué CE',

  // --- PRICE RANGE FILTER ---
  'products.priceRange': 'Fourchette de prix',
  'products.priceRange.min': 'Min',
  'products.priceRange.max': 'Max',
  'products.priceRange.all': 'Tous les prix',
  'products.priceRange.onQuote': 'Sur devis uniquement',
  'products.priceRange.includeOnQuote': 'Inclure sur devis',

  // --- DARK MODE NAV ---
  'nav.darkMode': 'Mode sombre',
  'nav.lightMode': 'Mode clair',
  'nav.promotions': 'Promotions',

  // --- PROMO BANNER ---
  'promo.text': 'Offre spéciale : Installation gratuite pour toute commande avant le 30 juin',
  'promo.cta': 'En savoir plus',

  // --- FOOTER COMMITMENTS ---
  'footer.commitments': 'Nos engagements',
  'footer.commitments.delivery': 'Livraison 58 wilayas',
  'footer.commitments.installation': 'Installation professionnelle',
  'footer.commitments.sav': 'SAV 48h',
  'footer.commitments.warranty': 'Garantie constructeur',
  'footer.certifications': 'Certifications & Partenaires',

  // --- PRODUCT DETAIL - YOU MAY ALSO LIKE ---
  'products.youMayAlsoLike': 'Vous aimerez aussi',
  'products.relatedCategories': 'Catégories associées',

  // --- SEARCH ENHANCED ---
  'search.recent': 'Recherches récentes',
  'search.products': 'Produits',
  'search.categories': 'Catégories',
  'search.articles': 'Articles',
  'search.noResults': 'Aucun résultat trouvé',
  'search.browseCatalogue': 'Parcourir le catalogue',
  'search.viewAll': 'Voir tous les résultats',

  // --- RECENTLY VIEWED SECTION ---
  'recentlyViewed.title': 'Récemment consultés',
  'recentlyViewed.subtitle': 'Produits que vous avez récemment consultés',

  // --- PROMOTIONS ---
  'promotions.title': 'Offres & Promotions',
  'promotions.subtitle': 'Profitez de nos offres exclusives',
  'promotions.active': 'Offres en cours',
  'promotions.comingSoon': 'Prochainement',
  'promotions.save': 'ÉCONOMISEZ',
  'promotions.free': 'GRATUIT',
  'promotions.newsletterCta': 'Ne manquez aucune offre',
  'promotions.newsletterSub': 'Inscrivez-vous pour être alerté des nouvelles promotions',
  'promotions.expiresIn': 'Expire dans',
  'promotions.claimOffer': "Profiter de l'offre",
  'promotions.originalPrice': 'Prix original',
  'promotions.promoPrice': 'Prix promotionnel',

  // --- ACCESSIBILITY ---
  'accessibility.skipToContent': 'Aller au contenu principal',
  'accessibility.menu': 'Menu principal',
  'accessibility.search': 'Rechercher des produits',
  'accessibility.cart': 'Panier devis',

  // --- PRODUCTS ADDITIONAL ---
  'products.comingSoon': 'Bientôt disponible',

  // --- TRUSTED BRANDS ---
  'home.trustedBrands': 'Marques de confiance',

  // --- NAV CATALOGUE DROPDOWN ---
  'nav.allCategories': 'Toutes les catégories',
  'nav.viewAllProducts': 'Voir tous les produits',

  // --- PRODUCT REVIEWS ---
  'product.reviews': 'Avis clients',
  'product.seeAllReviews': 'Voir tous les avis',
  'product.verifiedPurchase': 'Achat vérifié',
  'product.monthsAgo': 'Il y a {n} mois',
  'product.weeksAgo': 'Il y a {n} semaine(s)',
  'product.delivery48h': 'Livraison 48h',
  'products.inStockOnly': 'En stock uniquement',
  'products.productsFound': '{n} produits trouvés',
  'products.viewDetails': 'Voir détails',
};

// ============================================================
// ARABIC TRANSLATIONS
// ============================================================
const ar: Translations = {
  // --- NAV ---
  'nav.home': 'الرئيسية',
  'nav.catalogue': 'الكتالوج',
  'nav.about': 'من نحن',
  'nav.blog': 'المدونة',
  'nav.contact': 'اتصل بنا',
  'nav.quote': 'طلب عرض سعر',
  'nav.admin': 'الإدارة',
  'nav.login': 'تسجيل الدخول',
  'nav.logout': 'تسجيل الخروج',
  'nav.dashboard': 'لوحة التحكم',
  'nav.products': 'المنتجات',
  'nav.blogPosts': 'المقالات',
  'nav.quotes': 'عروض الأسعار',
  'nav.messages': 'الرسائل',
  'nav.language': 'اللغة',
  'nav.cart': 'سلة عروض الأسعار',
  'nav.search': 'بحث...',
  'nav.menu': 'القائمة',
  'nav.close': 'إغلاق',
  'nav.categories': 'الفئات',
  'nav.settings': 'الإعدادات',
  'nav.allProducts': 'جميع المنتجات',
  'nav.newArrivals': 'وافد جديد',
  'nav.bestSellers': 'الأكثر مبيعاً',
  'nav.brand': 'ODG',

  // --- HERO ---
  'hero.title': 'معدات طب الأسنان المهنية',
  'hero.subtitle': 'المورد الرائد في الجزائر منذ 2009',
  'hero.description': 'موزع حصري لأكبر العلامات التجارية العالمية. التركيب والتدريب وخدمة ما بعد البيع في جميع أنحاء البلاد.',
  'hero.cta.catalogue': 'عرض الكتالوج',
  'hero.cta.quote': 'طلب عرض سعر',

  // --- STATS ---
  'stats.clinics': 'عيادات مجهزة',
  'stats.wilayas': 'ولايات مغطاة',
  'stats.brands': 'علامات تجارية',
  'stats.sav': 'ساعات ما بعد البيع',

  // --- CATEGORIES ---
  'categories.title': 'فئاتنا',
  'categories.subtitle': 'اكتشف مجموعتنا الكاملة من معدات طب الأسنان',
  'categories.fauteuils': 'كراسي طب الأسنان',
  'categories.unites': 'وحدات طب الأسنان',
  'categories.radiologie': 'الأشعة',
  'categories.sterilisation': 'التعقيم',
  'categories.pneumatiques': 'الهوائية',
  'categories.consommables': 'المستهلكات',
  'categories.instruments': 'الأدوات',
  'categories.mobilier': 'الأثاث',

  // --- PRODUCTS ---
  'products.title': 'الكتالوج',
  'products.subtitle': 'اكتشف مجموعتنا الكاملة من معدات طب الأسنان المهنية',
  'products.featured': 'منتجات مميزة',
  'products.new': 'جديد',
  'products.bestSeller': 'الأكثر مبيعاً',
  'catalogue.brands': 'العلامات التجارية',
  'catalogue.allBrands': 'جميع العلامات',
  'products.inStock': 'متوفر',
  'products.outOfStock': 'نفذ المخزون',
  'products.addQuote': 'أضف إلى عرض السعر',
  'products.viewDetails': 'عرض التفاصيل',
  'products.compare': 'مقارنة',
  'products.filter': 'تصفية',
  'products.sort': 'ترتيب',
  'products.sort.newest': 'الأحدث',
  'products.sort.priceAsc': 'السعر تصاعدي',
  'products.sort.priceDesc': 'السعر تنازلي',
  'products.sort.name': 'الاسم أ-ي',
  'products.noResults': 'لم يتم العثور على منتجات',
  'products.all': 'الكل',
  'products.specs': 'المواصفات',
  'products.features': 'نقاط القوة',
  'products.warranty': 'الضمان',
  'products.delivery': 'التوصيل',
  'products.installation': 'تركيب مجاني',
  'products.training': 'تدريب مجاني',
  'products.brand': 'العلامة التجارية',
  'products.origin': 'المنشأ',
  'products.ref': 'المرجع',
  'products.downloadPdf': 'تحميل البطاقة التقنية',
  'products.videos': 'فيديوهات',
  'products.priceOnQuote': 'على أساس التسعير',
  'products.requestQuote': 'طلب عرض سعر',
  'products.clearFilters': 'إعادة تعيين الفلاتر',
  'products.activeFilters': 'فلاتر نشطة',
  'products.gridView': 'شبكة',
  'products.listView': 'قائمة',
  'products.filters': 'فلاتر',
  'products.noResultsTip': 'حاول تعديل معايير البحث أو إعادة تعيين الفلاتر',
  'products.relatedProducts': 'منتجات مشابهة',
  'products.description': 'الوصف',
  'products.availability': 'التوفر',

  // --- PRODUCT DETAIL ---
  'product.specifications': 'المواصفات الفنية',
  'product.keyFeatures': 'الميزات الرئيسية',
  'product.videos': 'فيديوهات المنتج',
  'product.warranty': 'الضمان',
  'product.delivery': 'مدة التوصيل',
  'product.installation': 'تركيب مجاني',
  'product.training': 'تدريب مجاني',
  'product.origin': 'بلد المنشأ',
  'product.reference': 'الرقم المرجعي',
  'product.spec': 'المواصفة',
  'product.value': 'القيمة',
  'product.watchVideo': 'مشاهدة الفيديو',
  'product.noVideos': 'لا توجد فيديوهات متاحة',

  // --- COMPARE ---
  'compare.title': 'مقارنة المنتجات',
  'compare.add': 'مقارنة',
  'compare.added': 'تمت الإضافة',
  'compare.remove': 'إزالة',
  'compare.clear': 'تفريغ القائمة',
  'compare.now': 'مقارنة الآن',
  'compare.empty': 'لا توجد منتجات للمقارنة',
  'compare.maxReached': 'الحد الأقصى (4)',
  'compare.selectMin': 'اختر منتجين على الأقل',
  'compare.specs': 'المواصفات',
  'compare.features': 'نقاط القوة',
  'compare.brand': 'العلامة التجارية',
  'compare.price': 'السعر',
  'compare.stock': 'التوفر',
  'compare.warranty': 'الضمان',
  'compare.image': 'الصورة',
  'compare.name': 'الاسم',
  'compare.origin': 'المنشأ',
  'compare.ref': 'المرجع',
  'compare.category': 'الفئة',
  'compare.backToCatalogue': 'العودة إلى الكتالوج',
  'compare.items': 'منتج(ات) محدد(ة)',
  'compare.highlightDiff': 'الاختلافات',
  'compare.noSpecs': 'لا توجد مواصفات',
  'compare.noFeatures': 'لا توجد نقاط قوة',

  // --- WISHLIST ---
  'wishlist.title': 'المفضلة',
  'wishlist.empty': 'لا توجد منتجات في المفضلة',
  'wishlist.added': 'تمت الإضافة إلى المفضلة',
  'wishlist.removed': 'تمت الإزالة من المفضلة',
  'wishlist.viewAll': 'عرض الكل',
  'wishlist.clearAll': 'حذف الكل',
  'products.addToWishlist': 'إضافة إلى المفضلة',
  'products.removeFromWishlist': 'إزالة من المفضلة',

  // --- BLOG ---
  'blog.title': 'المدونة والأخبار',
  'blog.subtitle': 'ابق على اطلاع بأحدث الاتجاهات في معدات طب الأسنان',
  'blog.readMore': 'اقرأ المزيد',
  'blog.readTime': 'دقيقة للقراءة',
  'blog.share': 'مشاركة',
  'blog.copyLink': 'نسخ الرابط',
  'blog.backToBlog': 'العودة إلى المدونة',
  'blog.related': 'مقالات مشابهة',
  'blog.by': 'بواسطة',

  // --- ABOUT ---
  'about.title': 'من نحن',
  'about.subtitle': 'شريكك الموثوق منذ 2009',
  'about.history': 'قصتنا',
  'about.history.p1': 'تأسست مجموعة وقاح لطب الأسنان (ODG) في عام 2009 وأصبحت في غضون سنوات قليلة الرائدة في توزيع معدات طب الأسنان في الجزائر. التزامنا: تزويد متخصصي صحة الأسنان بأفضل الأدوات لممارسة مهنتهم في أفضل الظروف.',
  'about.history.p2': 'مع تواجد في 48 ولاية وشبكة من الفنيين المؤهلين، تضمن ODG التركيب والتدريب وخدمة ما بعد البيع في جميع أنحاء الأراضي الجزائرية. يضمن شراكتنا مع أكبر العلامات التجارية العالمية الوصول إلى أكثر التقنيات تقدماً.',
  'about.mission': 'مهمتنا',
  'about.mission.text': 'جعل معدات طب الأسنان ذات الجودة العالمية في متناول جميع الممارسين في الجزائر، مع خدمة ما بعد البيع لا تشوبها شائبة.',
  'about.values': 'قيمنا',
  'about.values.excellence': 'التميز',
  'about.values.excellence.text': 'نختار فقط أفضل المنتجات من العلامات التجارية الأكثر شهرة.',
  'about.values.proximity': 'القرب',
  'about.values.proximity.text': 'شبكة من الفنيين تغطي 48 ولاية لخدمة ما بعد البيع التفاعلية.',
  'about.values.innovation': 'الابتكار',
  'about.values.innovation.text': 'نقدم في الجزائر أحدث تقنيات طب الأسنان في العالم.',
  'about.values.trust': 'الثقة',
  'about.values.trust.text': 'أكثر من 500 عيادة تثق بنا منذ 2009.',

  // --- CONTACT ---
  'contact.title': 'اتصل بنا',
  'contact.subtitle': 'فريقنا في خدمتكم',
  'contact.phone': 'الهاتف',
  'contact.email': 'البريد الإلكتروني',
  'contact.address': 'العنوان',
  'contact.hours': 'ساعات العمل',
  'contact.form.name': 'الاسم الكامل',
  'contact.form.email': 'عنوان البريد الإلكتروني',
  'contact.form.phone': 'الهاتف',
  'contact.form.subject': 'الموضوع',
  'contact.form.message': 'الرسالة',
  'contact.form.send': 'إرسال الرسالة',
  'contact.form.sending': 'جاري الإرسال...',
  'contact.form.success': 'تم إرسال الرسالة بنجاح!',
  'contact.form.error': 'خطأ في الإرسال. يرجى المحاولة مرة أخرى.',
  'contact.findUs': 'كيف تجدنا',
  'contact.callUs': 'اتصل بنا',
  'contact.whatsappUs': 'واتساب',

  // --- QUOTE ---
  'quote.title': 'طلب عرض سعر',
  'quote.subtitle': 'املأ النموذج أدناه لتلقي عرض سعر مخصص خلال 24 ساعة',
  'quote.step1': 'معلوماتك',
  'quote.step2': 'اختيار المنتجات',
  'quote.step3': 'ملخص',
  'quote.clientType': 'نوع العميل',
  'quote.clientType.clinic': 'عيادة أسنان',
  'quote.clientType.reseller': 'بائع',
  'quote.clientType.counter': 'المنضدة',
  'quote.fullName': 'الاسم الكامل',
  'quote.email': 'عنوان البريد الإلكتروني',
  'quote.phone': 'الهاتف',
  'quote.wilaya': 'الولاية',
  'quote.message': 'رسالة (اختياري)',
  'quote.products': 'المنتجات المختارة',
  'quote.quantity': 'الكمية',
  'quote.total': 'الإجمالي المقدر',
  'quote.submit': 'إرسال الطلب',
  'quote.submitting': 'جاري الإرسال...',
  'quote.success': 'تم إرسال طلب عرض السعر بنجاح! سنتواصل معك خلال 24 ساعة.',
  'quote.error': 'خطأ في الإرسال. يرجى المحاولة مرة أخرى.',
  'quote.empty': 'اختيارك فارغ',
  'quote.addProducts': 'أضف منتجات من الكتالوج',
  'quote.next': 'التالي',
  'quote.prev': 'السابق',

  // --- FOOTER ---
  'footer.description': 'موزع حصري لمعدات طب الأسنان المهنية في الجزائر منذ 2009.',
  'footer.quickLinks': 'روابط سريعة',
  'footer.contact': 'اتصل بنا',
  'footer.legal': 'قانوني',
  'footer.legal.mentions': 'إشارات قانونية',
  'footer.legal.cgv': 'شروط البيع العامة',
  'footer.privacy': 'سياسة الخصوصية',
  'footer.algeria': 'الجزائر',
  'footer.rights': 'جميع الحقوق محفوظة.',
  'footer.madeWith': 'صنع بـ',
  'footer.in': 'في',
  'footer.cta': 'جهز عيادتك بأفضل المعدات',
  'footer.newsletter.mini': 'اشترك في نشرتنا الإخبارية',
  'footer.requestQuote': 'طلب عرض سعر',
  'footer.backToTop': 'العودة للأعلى ↑',

  // --- TESTIMONIALS ---
  'testimonials.title': 'ماذا يقول عملاؤنا',
  'testimonials.subtitle': 'يثقون بنا',

  // --- NEWSLETTER ---
  'newsletter.title': 'ابق على اطلاع',
  'newsletter.subtitle': 'استلم عروضنا الحصرية والأخبار',
  'newsletter.placeholder': 'عنوان بريدك الإلكتروني',
  'newsletter.subscribe': 'اشترك',
  'newsletter.privacy': 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.',
  'newsletter.success': 'شكراً! أنت مشترك في نشرتنا الإخبارية.',

  // --- ADMIN ---
  'admin.login.title': 'تسجيل الدخول',
  'admin.login.password': 'كلمة المرور',
  'admin.login.submit': 'تسجيل الدخول',
  'admin.login.error': 'كلمة المرور غير صحيحة',
  'admin.dashboard.title': 'لوحة التحكم',
  'admin.dashboard.totalProducts': 'إجمالي المنتجات',
  'admin.dashboard.totalQuotes': 'إجمالي عروض الأسعار',
  'admin.dashboard.newQuotes': 'عروض أسعار جديدة',
  'admin.dashboard.totalBlog': 'مقالات المدونة',
  'admin.products.title': 'إدارة المنتجات',
  'admin.products.add': 'إضافة منتج',
  'admin.products.edit': 'تعديل',
  'admin.products.delete': 'حذف',
  'admin.products.save': 'حفظ',
  'admin.products.cancel': 'إلغاء',
  'admin.products.name': 'اسم المنتج',
  'admin.products.category': 'الفئة',
  'admin.products.price': 'السعر',
  'admin.products.description': 'الوصف',
  'admin.products.images': 'الصور',
  'admin.blog.title': 'إدارة المدونة',
  'admin.blog.add': 'إضافة مقال',
  'admin.quotes.title': 'إدارة عروض الأسعار',
  'admin.quotes.status': 'الحالة',
  'admin.quotes.new': 'جديد',
  'admin.quotes.inProgress': 'قيد المعالجة',
  'admin.quotes.processed': 'تمت المعالجة',
  'admin.quotes.archived': 'مؤرشف',
  'admin.settings.title': 'الإعدادات',
  'admin.settings.logo': 'الشعار والعلامة التجارية',
  'admin.settings.contact': 'اتصل بنا',
  'admin.settings.map': 'الخريطة والموقع',
  'admin.settings.productInfo': 'معلومات المنتج',
  'admin.settings.social': 'الشبكات الاجتماعية',
  'admin.settings.stats': 'الإحصائيات',
  'admin.settings.about': 'من نحن',
  'admin.settings.save': 'حفظ',
  'admin.settings.saved': 'تم حفظ الإعدادات!',
  'admin.categories.title': 'إدارة الفئات',

  // --- COMMON ---
  'common.loading': 'جاري التحميل...',
  'common.error': 'حدث خطأ',
  'common.retry': 'إعادة المحاولة',
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.delete': 'حذف',
  'common.edit': 'تعديل',
  'common.add': 'إضافة',
  'common.search': 'بحث',
  'common.filter': 'تصفية',
  'common.sort': 'ترتيب',
  'common.noResults': 'لا توجد نتائج',
  'common.back': 'رجوع',
  'common.next': 'التالي',
  'common.prev': 'السابق',
  'common.seeAll': 'عرض الكل',
  'common.or': 'أو',
  'common.and': 'و',
  'common.da': 'د.ج',

  // --- ABOUT MILESTONES ---
  'about.milestones.title': 'محطاتنا الرئيسية',
  'about.milestones.2009': 'إنشاء ODG في وهران',
  'about.milestones.2009.desc': 'تأسيس الشركة بـ 3 موظفين ورؤية واضحة.',
  'about.milestones.2012': 'شراكة مع Owandy',
  'about.milestones.2012.desc': 'أول شراكة حصرية مع علامة تجارية دولية.',
  'about.milestones.2015': 'تغطية وطنية',
  'about.milestones.2015.desc': 'التوسع في 48 ولاية مع شبكة من الفنيين.',
  'about.milestones.2018': 'مركز التكوين',
  'about.milestones.2018.desc': 'افتتاح مركز التكوين المستمر للممارسين.',
  'about.milestones.2021': '15+ علامة تجارية شريكة',
  'about.milestones.2021.desc': 'توسيع المحفظة مع قادة السوق العالميين.',
  'about.milestones.2024': 'صالة عرض جديدة',
  'about.milestones.2024.desc': 'افتتاح مساحة عرض بمساحة 500م².',

  // --- ABOUT KEY FIGURES ---
  'about.figures.title': 'ODG بالأرقام',

  // --- ABOUT CERTIFICATIONS ---
  'about.certifications.title': 'الشهادات والاعتمادات',
  'about.certifications.iso': 'ISO 9001:2015',
  'about.certifications.iso.desc': 'نظام إدارة الجودة معتمد.',
  'about.certifications.ce': 'علامة CE',
  'about.certifications.ce.desc': ' conformity مع المعايير الأوروبية.',
  'about.certifications.fda': 'مسجل FDA',
  'about.certifications.fda.desc': 'الامتثال للوائح الأمريكية.',

  // --- CONTACT FAQ ---
  'contact.faq.title': 'الأسئلة المتكررة',
  'contact.faq.q1': 'ما هي آجال التوصيل لديكم؟',
  'contact.faq.a1': 'تختلف آجال التوصيل من 48 ساعة إلى أسبوعين حسب المنتج والولاية. المنتجات المتوفرة تُسلَّم خلال 48 ساعة.',
  'contact.faq.q2': 'هل تقدمون تركيب المعدات؟',
  'contact.faq.a2': 'نعم، التركيب مشمول لجميع المعدات. فنيونا المعتمدون يتنقلون في جميع أنحاء الوطن.',
  'contact.faq.q3': 'كيف أطلب عرض سعر؟',
  'contact.faq.a3': 'يمكنك طلب عرض سعر مباشرة على موقعنا عبر نموذج الطلب، بالهاتف أو بالبريد الإلكتروني. الرد خلال 24 ساعة.',
  'contact.faq.q4': 'ما هي سياسة الضمان لديكم؟',
  'contact.faq.a4': 'جميع معداتنا مضمونة لمدة سنتين كحد أدنى، مع إمكانية التمديد. ما بعد البيع مضمون في جميع أنحاء الجزائر.',
  'contact.faq.q5': 'هل تقدمون دورات تكوينية؟',
  'contact.faq.a5': 'نعم، ننظم دورات تكوينية منتظمة في مركزنا بوهران وجلسات عملية في العيادات.',
  'contact.faq.q6': 'ما هي طرق الدفع المقبولة؟',
  'contact.faq.a6': 'نقبل التحويلات المصرفية والشيكات وتسهيلات الدفع على 3 دفعات للمهنيين.',

  // --- BLOG ENHANCED ---
  'blog.featured': 'مقال مميز',
  'blog.allCategories': 'جميع الفئات',
  'blog.readTimeBadge': 'دقيقة',
  'blog.category': 'الفئة',

  // --- FOOTER ENHANCED ---
  'footer.social': 'تابعنا',
  'footer.newsletter.title': 'النشرة الإخبارية',

  // --- NAVBAR ENHANCED ---
  'nav.searchPlaceholder': 'ابحث عن منتج...',

  // --- PRODUCT DETAIL ENHANCED ---
  'products.share': 'مشاركة',
  'products.linkCopied': 'تم نسخ الرابط!',
  'products.print': 'طباعة',
  'products.breadcrumb.home': 'الرئيسية',
  'products.addToQuoteSticky': 'أضف إلى عرض السعر',
  'products.downloadInfo': 'تحميل',

  // --- SHARE ---
  'share.copyLink': 'نسخ الرابط',
  'share.whatsapp': 'مشاركة على واتساب',
  'share.facebook': 'مشاركة على فيسبوك',
  'share.linkedin': 'مشاركة على لينكدإن',
  'share.linkCopied': 'تم نسخ الرابط!',

  // --- QUICK VIEW ---
  'products.quickView': 'عرض سريع',
  'products.quickView.title': 'معاينة المنتج',
  'products.quickView.viewFull': 'عرض الصفحة الكاملة',
  'products.quickView.addToQuote': 'أضف إلى عرض السعر',
  'products.quickView.compare': 'مقارنة',
  'products.quickView.addedToCompare': 'تمت الإضافة للمقارنة',
  'products.quickView.inStock': 'متوفر',
  'products.quickView.outOfStock': 'نفذ المخزون',
  'products.quickView.brand': 'العلامة التجارية',
  'products.quickView.reference': 'مرجع',
  'products.quickView.category': 'الفئة',

  // --- RECENTLY VIEWED ---
  'products.recentlyViewed': 'منتجات شاهدها مؤخراً',
  'products.recentlyViewed.empty': 'لم يتم مشاهدة أي منتج مؤخراً',
  'products.recentlyViewed.clear': 'مسح السجل',

  // --- ADMIN ENHANCED ---
  'admin.export_csv': 'تصدير كـ CSV',
  'admin.bulk_delete': 'حذف المحدد',
  'admin.select_all': 'تحديد الكل',
  'admin.deselect_all': 'إلغاء التحديد',
  'admin.product_status': 'حالة المنتج',
  'admin.active': 'نشط',
  'admin.inactive': 'غير نشط',
  'admin.preview': 'معاينة',
  'admin.business_hours': 'ساعات العمل',
  'admin.notifications': 'الإشعارات',
  'admin.no_notifications': 'لا توجد إشعارات',
  'admin.recent_orders': 'الطلبات الأخيرة',
  'admin.order_id': 'رقم الطلب',
  'admin.client_name': 'اسم العميل',
  'admin.monthly_quotes': 'عروض الأسعار الشهرية',
  'admin.quick_stats': 'إحصائيات سريعة',
  'admin.logo_upload': 'تحميل الشعار',
  'admin.social_links': 'روابط الشبكات الاجتماعية',
  'admin.preview_changes': 'معاينة التعديلات',
  'admin.whatsapp': 'واتساب',

  // --- PRODUCT ENHANCED ---
  'products.price_range': 'نطاق السعر',
  'products.min_price': 'الحد الأدنى للسعر',
  'products.max_price': 'الحد الأقصى للسعر',
  'products.on_request': 'على الطلب',
  'products.gallery': 'معرض الصور',
  'products.zoom': 'تكبير',
  'products.next_image': 'الصورة التالية',
  'products.prev_image': 'الصورة السابقة',
  'products.close_gallery': 'إغلاق المعرض',

  // --- THEME ---
  'theme.dark_mode': 'الوضع الداكن',
  'theme.light_mode': 'الوضع الفاتح',
  'theme.toggle': 'تبديل السمة',

  // --- GENERAL ---
  'general.back_to_top': 'العودة للأعلى',
  'general.certifications': 'الشهادات',
  'general.iso_certified': 'معتمد ISO',
  'general.ce_marked': 'علامة CE',

  // --- PRICE RANGE FILTER ---
  'products.priceRange': 'نطاق السعر',
  'products.priceRange.min': 'الحد الأدنى',
  'products.priceRange.max': 'الحد الأقصى',
  'products.priceRange.all': 'جميع الأسعار',
  'products.priceRange.onQuote': 'على أساس التسعير فقط',
  'products.priceRange.includeOnQuote': 'تضمين على أساس التسعير',

  // --- DARK MODE NAV ---
  'nav.darkMode': 'الوضع الداكن',
  'nav.lightMode': 'الوضع الفاتح',
  'nav.promotions': 'العروض',

  // --- PROMO BANNER ---
  'promo.text': 'عرض خاص: تركيب مجاني لكل طلب قبل 30 يونيو',
  'promo.cta': 'اعرف المزيد',

  // --- FOOTER COMMITMENTS ---
  'footer.commitments': 'التزاماتنا',
  'footer.commitments.delivery': 'توصيل 58 ولاية',
  'footer.commitments.installation': 'تركيب احترافي',
  'footer.commitments.sav': 'خدمة ما بعد البيع 48 ساعة',
  'footer.commitments.warranty': 'ضمان الشركة المصنعة',
  'footer.certifications': 'الشهادات والشركاء',

  // --- PRODUCT DETAIL - YOU MAY ALSO LIKE ---
  'products.youMayAlsoLike': 'قد يعجبك أيضاً',
  'products.relatedCategories': 'الفئات المرتبطة',

  // --- SEARCH ENHANCED ---
  'search.recent': 'عمليات البحث الأخيرة',
  'search.products': 'المنتجات',
  'search.categories': 'الفئات',
  'search.articles': 'المقالات',
  'search.noResults': 'لا توجد نتائج',
  'search.browseCatalogue': 'تصفح الكتالوج',
  'search.viewAll': 'عرض جميع النتائج',

  // --- RECENTLY VIEWED SECTION ---
  'recentlyViewed.title': 'شوهد مؤخراً',
  'recentlyViewed.subtitle': 'المنتجات التي شاهدتها مؤخراً',

  // --- PROMOTIONS ---
  'promotions.title': 'العروض والتخفيضات',
  'promotions.subtitle': 'استفد من عروضنا الحصرية',
  'promotions.active': 'العروض الحالية',
  'promotions.comingSoon': 'قريباً',
  'promotions.save': 'وفّر',
  'promotions.free': 'مجاني',
  'promotions.newsletterCta': 'لا تفوت أي عرض',
  'promotions.newsletterSub': 'سجل ليتم إعلامك بالعروض الجديدة',
  'promotions.expiresIn': 'ينتهي في',
  'promotions.claimOffer': 'استفد من العرض',
  'promotions.originalPrice': 'السعر الأصلي',
  'promotions.promoPrice': 'السعر الترويجي',

  // --- ACCESSIBILITY ---
  'accessibility.skipToContent': 'انتقل إلى المحتوى الرئيسي',
  'accessibility.menu': 'القائمة الرئيسية',
  'accessibility.search': 'البحث عن المنتجات',
  'accessibility.cart': 'سلة عروض الأسعار',

  // --- PRODUCTS ADDITIONAL ---
  'products.comingSoon': 'قريباً',

  // --- TRUSTED BRANDS ---
  'home.trustedBrands': 'العلامات الموثوقة',

  // --- NAV CATALOGUE DROPDOWN ---
  'nav.allCategories': 'جميع الفئات',
  'nav.viewAllProducts': 'عرض جميع المنتجات',

  // --- PRODUCT REVIEWS ---
  'product.reviews': 'آراء العملاء',
  'product.seeAllReviews': 'عرض جميع الآراء',
  'product.verifiedPurchase': 'شراء موثق',
  'product.monthsAgo': 'منذ {n} أشهر',
  'product.weeksAgo': 'منذ {n} أسبوع',
  'product.delivery48h': 'توصيل 48 ساعة',
  'products.inStockOnly': 'المتوفر فقط',
  'products.productsFound': '{n} منتجات موجودة',
  'products.viewDetails': 'عرض التفاصيل',
}

const translations: Record<Language, Translations> = { fr, ar };

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'fr';
  const stored = localStorage.getItem('odg_language') as Language;
  if (stored && (stored === 'fr' || stored === 'ar')) return stored;
  return 'fr';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    localStorage.setItem('odg_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] || translations.fr?.[key] || key;
    },
    [language]
  );

  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
