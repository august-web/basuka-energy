// Minimal i18n layer for the EN (root) / FR (/fr/) site.
// Page copy lives in src/data/*.json (EN) and src/data/fr/*.json (FR);
// this file covers UI "chrome" strings only.

export const LANGS = ['en', 'fr'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  fr: 'Français',
};

export function isLang(value: string | undefined | null): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value);
}

/** UI chrome strings, keyed by Lang. */
export const ui = {
  en: {
    switcherLabel: 'Change language',
    skipToContent: 'Skip to content',
    backToTop: 'Back to top',
    getInTouch: 'Get in touch',
    menuToggle: 'Toggle menu',
    chatWhatsApp: 'Chat with us on WhatsApp',
    sharePage: 'Share this page',
    shareLinkedIn: 'Share on LinkedIn',
    shareFacebook: 'Share on Facebook',
    shareWhatsApp: 'Share on WhatsApp',
    copyLink: 'Copy link',
    copied: 'Copied!',
    lightboxClose: 'Close image',
    onThisPage: 'On this page',
    breadcrumbNav: 'Breadcrumb',
    newsletterTitle: 'Stay in the loop',
    newsletterDesc: 'Updates on our upcoming launch, partner opportunities, and impact reports.',
    newsletterPlaceholder: 'your@email.com',
    newsletterEmailLabel: 'Email address for newsletter',
    newsletterSubscribe: 'Subscribe',
    newsletterSuccess: "Thank you! We'll be in touch.",
    newsletterError: 'Something went wrong — please try again or email info@basukaenergy.com.',
    newsletterSubject: 'Newsletter subscription',
    footerExplore: 'Explore',
    footerContact: 'Contact',
    footerBlurb:
      "Burkina Faso's sovereign energy platform — 130 MW of new dispatchable capacity, delivered through smart, swappable SIRA™ batteries and solar-first Swap & Glow™ stations.",
    footerNote: "Building Africa's first women-led energy and infrastructure platform.",
    footerTagline: 'Smart electricity where the grid fails.',
    footerRights: 'All rights reserved.',
    cookieText:
      'We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our use of cookies.',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline',
    formName: 'Name',
    formEmail: 'Email',
    formSubject: 'Subject',
    formMessage: 'Message',
    formNamePh: 'Your name',
    formEmailPh: 'you@example.com',
    formSubjectPh: 'Partnership, support, inquiry…',
    formMessagePh: 'Tell us how we can help…',
    formSend: 'Send message',
    formSuccess: 'Thank you! Your message has been sent — we will reply shortly.',
    formError: 'Sorry — sending failed. Please email us directly or use WhatsApp:',
    contactFormContext: 'Contact inquiry — basukaenergy.com',
    partnerLogoAlt: 'Partner logo',
    nav: {
      home: 'Home',
      about: 'About us',
      partners: 'Partners',
      howItWorks: 'How it works',
      academy: 'Academy',
      impact: 'Impact',
      services: 'Services',
      contact: 'Contact us',
    },
  },
  fr: {
    switcherLabel: 'Changer de langue',
    skipToContent: 'Aller au contenu',
    backToTop: 'Retour en haut',
    getInTouch: 'Contactez-nous',
    menuToggle: 'Ouvrir le menu',
    chatWhatsApp: 'Discutez avec nous sur WhatsApp',
    sharePage: 'Partager cette page',
    shareLinkedIn: 'Partager sur LinkedIn',
    shareFacebook: 'Partager sur Facebook',
    shareWhatsApp: 'Partager sur WhatsApp',
    copyLink: 'Copier le lien',
    copied: 'Copié !',
    lightboxClose: "Fermer l'image",
    onThisPage: 'Sur cette page',
    breadcrumbNav: "Fil d'Ariane",
    newsletterTitle: 'Restez informés',
    newsletterDesc:
      'Actualités sur notre prochain lancement, les opportunités de partenariat et nos rapports d’impact.',
    newsletterPlaceholder: 'votre@email.com',
    newsletterEmailLabel: 'Adresse e-mail pour la newsletter',
    newsletterSubscribe: "S'abonner",
    newsletterSuccess: 'Merci ! Nous revenons vers vous.',
    newsletterError: 'Une erreur est survenue — réessayez ou écrivez à info@basukaenergy.com.',
    newsletterSubject: 'Inscription à la newsletter',
    footerExplore: 'Explorer',
    footerContact: 'Contact',
    footerBlurb:
      'La plateforme énergétique souveraine du Burkina Faso — 130 MW de nouvelle capacité pilotable, livrés grâce aux batteries SIRA™ intelligentes et échangeables et aux stations Swap & Glow™ solaires d’abord.',
    footerNote:
      "En train de bâtir la première plateforme énergétique et d'infrastructure d'Afrique dirigée par des femmes.",
    footerTagline: "L'électricité intelligente là où le réseau fait défaut.",
    footerRights: 'Tous droits réservés.',
    cookieText:
      "Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic du site. En continuant, vous acceptez notre utilisation des cookies.",
    cookieAccept: 'Accepter',
    cookieDecline: 'Refuser',
    formName: 'Nom',
    formEmail: 'E-mail',
    formSubject: 'Objet',
    formMessage: 'Message',
    formNamePh: 'Votre nom',
    formEmailPh: 'vous@exemple.com',
    formSubjectPh: 'Partenariat, assistance, demande…',
    formMessagePh: 'Dites-nous comment nous pouvons vous aider…',
    formSend: 'Envoyer le message',
    formSuccess: 'Merci ! Votre message a bien été envoyé — nous vous répondrons rapidement.',
    formError: 'Désolé — l\'envoi a échoué. Écrivez-nous directement ou utilisez WhatsApp :',
    contactFormContext: 'Demande de contact — basukaenergy.com',
    partnerLogoAlt: 'Logo partenaire',
    nav: {
      home: 'Accueil',
      about: 'À propos',
      partners: 'Partenaires',
      howItWorks: 'Comment ça marche',
      academy: 'Académie',
      impact: 'Impact',
      services: 'Services',
      contact: 'Contactez-nous',
    },
  },
} as const;

export type UIStrings = (typeof ui)['en'];

/** Get the UI strings for a locale (falls back to the default). */
export function t(lang: string | undefined | null): UIStrings {
  return isLang(lang) ? ui[lang] : ui[DEFAULT_LANG];
}

/** Detect the locale from a pathname: '/fr/partners/' -> 'fr', '/partners/' -> 'en'. */
export function langFromPath(pathname: string): Lang {
  return pathname === '/fr' || pathname.startsWith('/fr/') ? 'fr' : DEFAULT_LANG;
}

/**
 * The equivalent path in the other locale.
 * '/partners/' -> '/fr/partners/'  and  '/fr/partners/' -> '/partners/'.
 */
export function altPath(pathname: string, to: Lang): string {
  const stripped = pathname.replace(/^\/fr\/?/, '/');
  if (to === 'fr') return '/fr' + (stripped === '/' ? '/' : stripped);
  return stripped;
}

/**
 * Route table for page data files. Keys are JSON file stems under src/data/
 * (EN) and src/data/fr/ (FR); values are the URL paths they serve.
 * Both locales share the same slugs — FR pages live under /fr/.
 */
export const PAGE_PATHS: Record<string, string> = {
  home: '/',
  about: '/about-us-2/',
  'how-it-works': '/how-it-works/',
  services: '/services/',
  partners: '/partners/',
  impact: '/impact/',
  academy: '/academy/',
  'ba-suka-academy': '/ba-suka-academy/',
  contact: '/contact-us/',
};

/** Reverse lookup: URL path -> JSON file stem. */
export function stemForPath(path: string): string {
  const entry = Object.entries(PAGE_PATHS).find(([, p]) => p === path);
  return entry ? entry[0] : 'home';
}

/** Prefix an internal href with the locale prefix (FR only). */
export function localizedHref(href: string, lang: Lang): string {
  if (lang !== 'fr') return href;
  if (!href.startsWith('/') || href.startsWith('//')) return href; // external or anchor
  return '/fr' + (href === '/' ? '/' : href);
}
