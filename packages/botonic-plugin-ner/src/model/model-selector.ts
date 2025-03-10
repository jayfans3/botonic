import { Locale } from '@botonic/nlp/lib/types'

import { getUri } from '../utils/environment-utils'
import { ModelInfo } from './model-info'
import { NamedEntityRecognizer } from './ner'

export class ModelSelector {
  private models: { [locale: string]: NamedEntityRecognizer } = {}

  private constructor(readonly locales: Locale[]) {}

  static async build(locales: Locale[]): Promise<ModelSelector> {
    const selector = new ModelSelector(locales)
    const modelsInfo = selector.loadModelsInfo()
    await selector.loadModels(modelsInfo)
    return selector
  }

  private loadModelsInfo(): ModelInfo[] {
    return this.locales.map(locale => new ModelInfo(locale, getUri(locale)))
  }

  private async loadModels(modelsInfo: ModelInfo[]): Promise<void> {
    for (const modelInfo of modelsInfo) {
      const locale = modelInfo.locale
      const config = await modelInfo.getConfig()
      const model = await modelInfo.getModel()
      this.models[locale] = new NamedEntityRecognizer(config, model)
    }
  }

  select(locale: Locale): NamedEntityRecognizer {
    return this.models[locale]
  }
}
