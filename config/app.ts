export const APP_CONFIG = {
  appName: 'VIA Planner',
  locale: 'es-ES',
  // Phones are centralized here (do not hardcode elsewhere)
  phoneTel: 'tel:+34960397445',
  phoneWhatsApp: 'https://wa.me/34615333605',
  cta: {
    heroTitle: 'Tu administrador telefónico',
    heroSubtitle: 'Demo 24/7. Hecho en Valencia.',
    heroActions: {
      call: 'Llamar',
      whatsapp: 'WhatsApp'
    },
    howToStart: 'Cómo empezar',
    quickAddPlaceholder: 'Añadir tarea rápida…'
  }
} as const;

