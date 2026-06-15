'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function MentionsLegales() {
  const { t, isRTL } = useTranslation();
  const { goBack } = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div style={{ backgroundColor: '#1E3A5F' }} className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('footer.legal.mentions')}
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Button variant="ghost" onClick={goBack} className="mb-6 gap-2" style={{ color: '#1E3A5F' }}>
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Button>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 sm:p-8 prose max-w-none text-sm text-gray-700">
            <h2 style={{ color: '#1E3A5F' }}>1. Éditeur du site</h2>
            <p>
              Le site odg-dental.com est édité par OUADAH DENTAL GROUPE (ODG), société commerciale
              immatriculée au registre du commerce d&apos;Oran, Algérie.
            </p>
            <p>
              Siège social : Coopérative Azzouz Abdelkader, N°45, Commune d&apos;Es-Senia, Oran, Algérie
            </p>
            <p>Téléphone : +213 771 88 89 48</p>
            <p>Email : groupedentalimport@gmail.com</p>

            <h2 style={{ color: '#1E3A5F' }}>2. Directeur de la publication</h2>
            <p>Le directeur de la publication est M. Ouadah, gérant de la société OUADAH DENTAL GROUPE.</p>

            <h2 style={{ color: '#1E3A5F' }}>3. Hébergement</h2>
            <p>
              Le site est hébergé par des serveurs sécurisés. Les informations sur l&apos;hébergeur sont
              disponibles sur demande.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>4. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus présents sur le site odg-dental.com (textes, images, vidéos,
              logos, icônes) est protégé par les lois relatives à la propriété intellectuelle. Toute
              reproduction, représentation, modification, publication ou adaptation de tout ou partie
              des éléments du site est interdite sans autorisation écrite préalable.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>5. Limitation de responsabilité</h2>
            <p>
              ODG s&apos;efforce de fournir des informations aussi précises que possible. Toutefois, il ne
              pourra être tenu responsable des omissions, des inexactitudes et des carences dans la
              mise à jour, qu&apos;elles soient de son fait ou du fait des tiers partenaires qui lui
              fournissent ces informations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function PolitiqueConfidentialite() {
  const { t, isRTL } = useTranslation();
  const { goBack } = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div style={{ backgroundColor: '#1E3A5F' }} className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('footer.privacy')}
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Button variant="ghost" onClick={goBack} className="mb-6 gap-2" style={{ color: '#1E3A5F' }}>
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Button>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 sm:p-8 prose max-w-none text-sm text-gray-700">
            <h2 style={{ color: '#1E3A5F' }}>1. Collecte des données personnelles</h2>
            <p>
              ODG collecte les données personnelles uniquement dans le cadre des demandes de devis et
              de contact. Les informations collectées incluent : nom, prénom, adresse email, numéro
              de téléphone, wilaya, et type de client.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>2. Utilisation des données</h2>
            <p>
              Les données collectées sont utilisées exclusivement pour le traitement des demandes de
              devis, la réponse aux messages de contact, et l&apos;amélioration de nos services. Elles ne
              sont en aucun cas transmises à des tiers à des fins commerciales.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>3. Conservation des données</h2>
            <p>
              Les données personnelles sont conservées pendant une durée maximale de 3 ans à compter
              du dernier contact avec le client, conformément à la réglementation algérienne.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>4. Droits des utilisateurs</h2>
            <p>
              Conformément à la loi, vous disposez d&apos;un droit d&apos;accès, de rectification, de
              suppression et de portabilité de vos données. Pour exercer ces droits, veuillez
              contacter : groupedentalimport@gmail.com
            </p>

            <h2 style={{ color: '#1E3A5F' }}>5. Cookies</h2>
            <p>
              Le site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun
              cookie de suivi publicitaire n&apos;est utilisé.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ConditionsGeneralesVente() {
  const { t, isRTL } = useTranslation();
  const { goBack } = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div style={{ backgroundColor: '#1E3A5F' }} className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('footer.legal.cgv')}
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Button variant="ghost" onClick={goBack} className="mb-6 gap-2" style={{ color: '#1E3A5F' }}>
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Button>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 sm:p-8 prose max-w-none text-sm text-gray-700">
            <h2 style={{ color: '#1E3A5F' }}>1. Objet</h2>
            <p>
              Les présentes conditions générales de vente régissent les relations commerciales entre
              OUADAH DENTAL GROUPE (ODG) et ses clients pour toute vente d&apos;équipements dentaires
              professionnels.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>2. Prix</h2>
            <p>
              Les prix sont indiqués en Dinars Algériens (DA) hors taxes. ODG se réserve le droit
              de modifier ses prix à tout moment. Les prix applicables sont ceux en vigueur au moment
              de la commande.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>3. Commande</h2>
            <p>
              Toute commande est précédée d&apos;un devis gratuit établi par ODG. Le devis est valable
              pendant 30 jours à compter de son émission. La commande est confirmée après signature
              du devis et versement d&apos;un acompte.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>4. Livraison</h2>
            <p>
              Les délais de livraison sont indicatifs et peuvent varier selon la disponibilité des
              produits et la wilaya de destination. ODG assure la livraison et l&apos;installation sur
              l&apos;ensemble du territoire national.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>5. Garantie</h2>
            <p>
              Tous les équipements vendus par ODG bénéficient d&apos;une garantie constructeur dont la
              durée varie selon le produit. La garantie couvre les vices de fabrication et les
              défauts de matériau.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>6. Service après-vente</h2>
            <p>
              ODG dispose d&apos;un réseau de techniciens qualifiés couvrant les 48 wilayas. Le SAV
              garantit une intervention sous 48h pour les pannes couvertes par la garantie.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>7. Paiement</h2>
            <p>
              Le paiement s&apos;effectue par virement bancaire ou chèque. Un acompte de 30% est requis
              à la commande, le solde à la livraison.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>8. Rétractation</h2>
            <p>
              Les équipements dentaires professionnels étant des biens sur mesure, le droit de
              rétractation ne s&apos;applique pas conformément à la réglementation en vigueur.
            </p>

            <h2 style={{ color: '#1E3A5F' }}>9. Litiges</h2>
            <p>
              En cas de litige, les parties s&apos;engagent à rechercher une solution amiable. À défaut,
              le tribunal compétent est celui du siège social d&apos;ODG à Oran, Algérie.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
