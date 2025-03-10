import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'

import { TextClassificationConfigStorage } from '../../../../src/tasks/text-classification/storage/config-storage'
import * as helper from '../../../helpers/constants-helper'

describe('Config handler', () => {
  const storer = new TextClassificationConfigStorage()

  test('Load config', () => {
    const config = storer.load(helper.TEXT_CLASSIFIER_MODEL_DIR_PATH)
    expect(config.locale).toEqual(helper.LOCALE)
    expect(config.maxLength).toEqual(helper.MAX_SEQUENCE_LENGTH)
    expect(config.vocabulary).toEqual(helper.VOCABULARY)
    expect(config.classes).toEqual(helper.CLASSES)
  })

  test('Save config', () => {
    const path = join(helper.HELPER_DIR, 'tmp-config-storage')
    storer.save(path, {
      locale: helper.LOCALE,
      maxLength: helper.MAX_SEQUENCE_LENGTH,
      vocabulary: helper.VOCABULARY,
      classes: helper.CLASSES,
    })
    expect(existsSync(join(path, storer.CONFIG_FILENAME))).toBeTruthy()
    rmdirSync(path, { recursive: true })
    expect(existsSync(join(path, storer.CONFIG_FILENAME))).toBeFalsy()
  })
})
