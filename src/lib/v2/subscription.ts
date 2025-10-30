class Subscription extends EventTarget {
  constructor() {
    super()
  }

  public subscribe(event: string, callback: (data: any) => void) {
    this.addEventListener(event, callback)
  }

  public unsubscribe(event: string, callback: (data: any) => void) {
    this.removeEventListener(event, callback)
  }

  public emit(event: string, data?: any) {
    this.dispatchEvent(new CustomEvent(event, { detail: data }))
  }
}

const subscription = new Subscription()
export default subscription

export enum SUBSCRIPTION_EVENTS {
  AUTH_TOKEN_REFRESHED = 'auth-token-refreshed',
  AUTH_TOKEN_EXPIRED = 'auth-token-expired',
  AUTH_TOKEN_INVALID = 'auth-token-invalid',
}
