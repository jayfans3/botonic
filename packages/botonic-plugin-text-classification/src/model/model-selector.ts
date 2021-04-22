import { Locale } from '@botonic/nlp/lib/types'

export class ModelSelector {
  // TODO: pending to be implemented.

  private constructor(readonly locales: Locale[]) {}

  static async build(locales: Locale[]): Promise<ModelSelector> {
    const selector = new ModelSelector(locales)
    // TODO: pending to be implemented.
    return selector
  }

  private loadModelsInfo(): any[] {
    // TODO: pending to be implemented.
    return null
  }

  private async loadModels(modelsInfo: any[]): Promise<void> {
    // TODO: pending to be implemented.
  }

  select(locale: Locale): any {
    // TODO: pending to be implemented.
    return null
  }
}
