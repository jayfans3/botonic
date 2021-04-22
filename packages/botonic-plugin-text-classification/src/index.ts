import type { Plugin, PluginPostRequest, PluginPreRequest } from '@botonic/core'
import { INPUT } from '@botonic/core'

import { ModelSelector } from './model/model-selector'
import type { PluginOptions } from './types'
import { detectLocale } from './utils/locale-utils'

export default class BotonicPluginTextClassification implements Plugin {
  private readonly modelsSelector: Promise<ModelSelector>

  constructor(readonly options: PluginOptions) {
    this.modelsSelector = ModelSelector.build(this.options.locales)
  }

  async pre(request: PluginPreRequest): Promise<void> {
    try {
      if (request.input.type == INPUT.TEXT && !request.input.payload) {
        const inputText = request.input.data
        const detectedLocale = detectLocale(inputText, this.options.locales)
        //   TODO: Pending to be implemented.
      }
    } catch (e) {
      console.error(`Cannot classify the input: ${request.input}`)
    }
  }

  async post(request: PluginPostRequest): Promise<void> {}
}
