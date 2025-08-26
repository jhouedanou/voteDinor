export const useRecaptcha = () => {
  const loadRecaptcha = () => {
    return new Promise<void>((resolve) => {
      if (typeof window !== 'undefined') {
        if (window.grecaptcha) {
          resolve()
          return
        }
        
        const script = document.createElement('script')
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`
        script.onload = () => resolve()
        document.head.appendChild(script)
      }
    })
  }
  
  const executeRecaptcha = async (action: string): Promise<string> => {
    await loadRecaptcha()
    
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(process.env.RECAPTCHA_SITE_KEY, { action })
            .then((token: string) => resolve(token))
        })
      }
    })
  }
  
  return {
    loadRecaptcha,
    executeRecaptcha
  }
}