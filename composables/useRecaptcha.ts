export const useRecaptcha = () => {
  const config = useRuntimeConfig()
  
  const loadRecaptcha = () => {
    return new Promise<void>((resolve) => {
      if (typeof window !== 'undefined') {
        if (window.grecaptcha) {
          resolve()
          return
        }
        
        const script = document.createElement('script')
        script.src = `https://www.google.com/recaptcha/api.js?render=${config.public.recaptchaSiteKey}`
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
          window.grecaptcha.execute(config.public.recaptchaSiteKey, { action })
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