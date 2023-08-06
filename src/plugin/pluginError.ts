export class PluginError extends Error {
  originalError: string

  constructor(message: string, originalError: string) {
    super(message)
    this.originalError = originalError

    Object.setPrototypeOf(this, PluginError.prototype)
  }
}
