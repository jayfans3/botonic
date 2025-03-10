/* eslint-disable @typescript-eslint/naming-convention */
import { lstatSync, readdirSync, readFileSync } from 'fs'
import { load as loadYaml } from 'js-yaml'
import { extname, join } from 'path'

import { unique } from '../utils/array-utils'
import { DataAugmenter } from './data-augmenter'
import { Dataset } from './dataset'
import { EntitiesParser } from './entities-parser'
import { Sample } from './types'

const YAML_EXTENSION = '.yaml'
const YML_EXTENSION = '.yml'

export class DatasetLoader {
  private static ALLOWED_FILE_EXTENSIONS = [YAML_EXTENSION, YML_EXTENSION]
  private static CLASS_FIELD = 'class'
  private static ENTITIES_FIELD = 'entities'
  private static DATA_AUGMENTATION_FIELD = 'data-augmentation'
  private static SAMPLES_FIELD = 'samples'

  static load(path: string): Dataset {
    const stat = lstatSync(path)

    if (stat.isFile()) {
      return this.loadFile(path)
    }

    if (stat.isDirectory()) {
      return this.loadDirectory(path)
    }

    throw new Error(`path "${path}" must be a directory or file.`)
  }

  private static loadDirectory(path: string): Dataset {
    const files = readdirSync(path)
    const datasets = files.map(filePath => this.loadFile(join(path, filePath)))
    const classes: string[] = unique(
      datasets.reduce((classes, dataset) => classes.concat(dataset.classes), [])
    )
    const entities: string[] = unique(
      datasets.reduce(
        (entities, dataset) => entities.concat(dataset.entities),
        []
      )
    )
    const samples: Sample[] = datasets.reduce(
      (samples, dataset) => samples.concat(dataset.samples),
      []
    )

    return new Dataset(classes, entities, samples)
  }

  private static loadFile(path: string): Dataset {
    if (!this.ALLOWED_FILE_EXTENSIONS.includes(extname(path))) {
      throw new Error(
        `File '${path}' must be a ${this.ALLOWED_FILE_EXTENSIONS.join(',')}.`
      )
    }

    const content = loadYaml(readFileSync(path))

    if (!(this.SAMPLES_FIELD in content)) {
      throw new Error('File must contain "samples" field')
    }

    const className =
      this.CLASS_FIELD in content ? content[this.CLASS_FIELD] : ''

    const classes: string[] = this.CLASS_FIELD in content ? [className] : []
    const entities: string[] =
      this.ENTITIES_FIELD in content ? unique(content[this.ENTITIES_FIELD]) : []

    let sentences = content[this.SAMPLES_FIELD]

    if (this.DATA_AUGMENTATION_FIELD in content) {
      const augmenter = new DataAugmenter(
        content[this.DATA_AUGMENTATION_FIELD],
        entities
      )
      sentences = augmenter.augment(sentences)
    }

    let samples: Sample[] = sentences.map(s => {
      return { text: s, class: className, entities: [] }
    })

    if (this.ENTITIES_FIELD in content) {
      samples = EntitiesParser.parse(samples, entities)
    }

    return new Dataset(classes, entities, samples)
  }
}
