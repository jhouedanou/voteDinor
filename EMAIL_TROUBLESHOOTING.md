# Dépannage Email - Vote DINOR

## Problème actuel
L'API HeroTofu retourne une erreur 422 (Unprocessable Entity) lors de l'envoi d'emails.

## Solutions

### 1. Désactiver temporairement l'envoi d'email

Ajoutez cette variable d'environnement dans Vercel :
```
DISABLE_EMAIL=true
```

Cela simulera l'envoi d'email sans utiliser HeroTofu.

### 2. Vérifier la configuration HeroTofu

1. **Vérifiez l'endpoint** :
   - URL actuelle : `https://public.herotofu.com/v1/5a33db80-8283-11f0-b600-1fdb6134186f`
   - Assurez-vous que cette URL est toujours valide

2. **Vérifiez le format des données** :
   - `to` : email valide
   - `subject` : texte simple (pas d'HTML)
   - `message` : HTML valide

### 3. Alternative : Utiliser un autre service d'email

#### Option A : Resend.com
```javascript
// Remplacer HeroTofu par Resend
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'noreply@dinor.ci',
    to: email,
    subject: subject,
    html: message
  })
})
```

#### Option B : SendGrid
```javascript
// Remplacer HeroTofu par SendGrid
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email }] }],
    from: { email: 'noreply@dinor.ci' },
    subject: subject,
    content: [{ type: 'text/html', value: message }]
  })
})
```

### 4. Debug en production

Pour voir les logs d'erreur en production :
1. Allez dans Vercel Dashboard
2. Cliquez sur votre projet
3. Allez dans "Functions"
4. Trouvez la fonction `send-email`
5. Vérifiez les logs

### 5. Test local

Pour tester localement :
```bash
# Désactiver l'email
export DISABLE_EMAIL=true
npm run dev

# Ou tester avec curl
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"account_creation","email":"test@example.com","name":"Test User"}'
```

## Statut actuel
- ✅ L'inscription fonctionne (l'erreur d'email ne bloque pas)
- ❌ Les emails ne sont pas envoyés
- 🔧 Solution temporaire : `DISABLE_EMAIL=true`
