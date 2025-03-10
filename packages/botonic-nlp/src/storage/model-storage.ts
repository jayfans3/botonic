import { LayersModel, loadLayersModel } from '@tensorflow/tfjs-node'
import { mkdirSync } from 'fs'

import { MODEL_FILENAME } from './constants'

export class ModelStorage {
  static async load(path: string): Promise<LayersModel> {
    return await loadLayersModel(`file://${path}/${MODEL_FILENAME}`)
  }

  static async save(model: LayersModel, path: string): Promise<void> {
    mkdirSync(path, { recursive: true })
    await model.save(`file://${path}`)
  }
}
