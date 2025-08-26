<template>
  <div class="min-h-screen bg-gradient-dinor">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="card-retro bg-dinor-cream border-4 border-dinor-red-vintage rounded-3xl p-8 shadow-2xl">
          
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-4xl font-retro font-bold text-dinor-brown mb-4">🔒 Politique de Confidentialité</h1>
            <p class="text-dinor-brown text-lg">Concours Photo DINOR - Flashback Gourmand</p>
            <p class="text-dinor-olive mt-2">Dernière mise à jour : 26 août 2025</p>
          </div>
          
          <!-- Content -->
          <div class="prose prose-lg max-w-none">
            
            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">📋 1. Introduction</h2>
              <p class="text-dinor-brown mb-4">
                Bienvenue sur la plateforme du concours photo DINOR "Flashback Gourmand". Nous nous engageons à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">🔍 2. Données collectées</h2>
              <div class="bg-dinor-beige p-6 rounded-lg mb-4">
                <h3 class="text-xl font-semibold text-dinor-brown mb-3">📝 Informations personnelles :</h3>
                <ul class="text-dinor-brown space-y-2 list-disc list-inside">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Photos soumises au concours</li>
                  <li>Données d'authentification (via Google OAuth ou compte local)</li>
                </ul>
              </div>
              
              <div class="bg-dinor-beige p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-dinor-brown mb-3">📊 Données techniques :</h3>
                <ul class="text-dinor-brown space-y-2 list-disc list-inside">
                  <li>Adresse IP</li>
                  <li>Informations de navigation</li>
                  <li>Horodatage des actions</li>
                  <li>Préférences utilisateur</li>
                </ul>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">🎯 3. Utilisation des données</h2>
              <p class="text-dinor-brown mb-4">Nous utilisons vos données pour :</p>
              <ul class="text-dinor-brown space-y-2 list-disc list-inside mb-4">
                <li>Gérer votre participation au concours</li>
                <li>Authentifier votre compte</li>
                <li>Traiter vos votes et soumissions</li>
                <li>Vous envoyer des notifications importantes</li>
                <li>Améliorer l'expérience utilisateur</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">🤝 4. Partage des données</h2>
              <div class="bg-yellow-50 border-l-4 border-dinor-orange p-4 mb-4">
                <p class="text-dinor-brown">
                  <strong>🚫 Nous ne vendons jamais vos données personnelles.</strong>
                </p>
              </div>
              <p class="text-dinor-brown mb-4">Nous pouvons partager vos données avec :</p>
              <ul class="text-dinor-brown space-y-2 list-disc list-inside">
                <li><strong>Prestataires de services :</strong> Supabase (base de données), Cloudinary (stockage d'images), HeroTofu (emails)</li>
                <li><strong>Autorités légales :</strong> En cas d'obligation légale</li>
                <li><strong>Photos du concours :</strong> Visibles publiquement sur la plateforme</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">🔐 5. Sécurité des données</h2>
              <div class="bg-dinor-beige p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-dinor-brown mb-3">🛡️ Mesures de protection :</h3>
                <ul class="text-dinor-brown space-y-2 list-disc list-inside">
                  <li>Chiffrement des données en transit (HTTPS)</li>
                  <li>Authentification sécurisée avec Supabase</li>
                  <li>Accès limité aux données (RLS - Row Level Security)</li>
                  <li>Sauvegardes régulières</li>
                  <li>Monitoring des accès</li>
                </ul>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">⏱️ 6. Conservation des données</h2>
              <p class="text-dinor-brown mb-4">Nous conservons vos données :</p>
              <ul class="text-dinor-brown space-y-2 list-disc list-inside">
                <li><strong>Comptes utilisateur :</strong> Jusqu'à suppression de votre compte</li>
                <li><strong>Photos du concours :</strong> Pendant toute la durée du concours et 2 ans après</li>
                <li><strong>Votes :</strong> Pendant toute la durée du concours</li>
                <li><strong>Logs techniques :</strong> 12 mois maximum</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">⚖️ 7. Vos droits</h2>
              <div class="bg-dinor-beige p-6 rounded-lg">
                <p class="text-dinor-brown mb-4">Conformément au RGPD, vous avez le droit de :</p>
                <ul class="text-dinor-brown space-y-2 list-disc list-inside">
                  <li>📋 <strong>Accéder</strong> à vos données personnelles</li>
                  <li>✏️ <strong>Rectifier</strong> vos informations</li>
                  <li>🗑️ <strong>Supprimer</strong> votre compte</li>
                  <li>📦 <strong>Portabilité</strong> de vos données</li>
                  <li>🚫 <strong>Opposition</strong> au traitement</li>
                  <li>⏸️ <strong>Limitation</strong> du traitement</li>
                </ul>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">🍪 8. Cookies</h2>
              <p class="text-dinor-brown mb-4">Nous utilisons des cookies essentiels pour :</p>
              <ul class="text-dinor-brown space-y-2 list-disc list-inside">
                <li>Maintenir votre session de connexion</li>
                <li>Sauvegarder vos préférences</li>
                <li>Assurer la sécurité de la plateforme</li>
              </ul>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">📞 9. Contact</h2>
              <div class="bg-dinor-orange/20 p-6 rounded-lg">
                <p class="text-dinor-brown mb-4">
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
                </p>
                <p class="text-dinor-brown">
                  <strong>📧 Email :</strong> contact@dinor-concours.com<br>
                  <strong>📍 Adresse :</strong> DINOR - Service Concours<br>
                  123 Avenue des Saveurs Vintage<br>
                  75000 Paris, France
                </p>
              </div>
            </section>

            <section class="mb-8">
              <h2 class="text-2xl font-bold text-dinor-brown mb-4">🔄 10. Modifications</h2>
              <p class="text-dinor-brown">
                Cette politique peut être modifiée. En cas de changements importants, nous vous en informerons par email. La version actuelle est toujours disponible sur cette page.
              </p>
            </section>

          </div>
          
          <!-- Footer -->
          <div class="text-center mt-12 pt-8 border-t-2 border-dinor-olive">
            <nuxt-link to="/" class="bg-gradient-dinor text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300">
              🏠 Retour à l'accueil
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Politique de Confidentialité - DINOR',
  description: 'Politique de confidentialité du concours photo DINOR Flashback Gourmand. Protection de vos données personnelles et respect de votre vie privée.'
})
</script>

<style scoped>
.card-retro {
  background: linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%);
  box-shadow: 
    0 20px 40px rgba(139, 69, 19, 0.1),
    0 15px 25px rgba(184, 134, 11, 0.1);
}

.prose h2 {
  @apply text-dinor-brown;
}

.prose h3 {
  @apply text-dinor-brown;
}

.prose p {
  @apply text-dinor-brown;
}

.prose ul {
  @apply text-dinor-brown;
}
</style>