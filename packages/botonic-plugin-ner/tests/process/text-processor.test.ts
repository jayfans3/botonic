import { PADDING_TOKEN } from '@botonic/nlp/lib/preprocess/constants'

import { TextProcessor } from '../../src/process/text-processor'
import * as constantsHelper from '../helper/constants-helper'
import * as toolsHelper from '../helper/tools-helper'

describe('Text Processor', () => {
  const sut = new TextProcessor(
    constantsHelper.VOCABULARY,
    toolsHelper.preprocessor
  )

  test('Generate Sequence and Input of short text', () => {
    const { sequence, input } = sut.process('I want to buy this pair of shoes.')
    expect(sequence.length).toEqual(constantsHelper.MAX_SEQUENCE_LENGTH)
    expect(sequence).toEqual([
      'i',
      'want',
      'buy',
      'pair',
      'shoes',
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
      PADDING_TOKEN,
    ])
    expect(input.shape).toEqual([1, constantsHelper.MAX_SEQUENCE_LENGTH])
    expect(input.arraySync()).toEqual([[6, 7, 9, 1, 1, 0, 0, 0, 0, 0, 0, 0]])
  })

  test('Generate Sequence and Input of long text', () => {
    const { sequence, input } = sut.process(
      'I want to buy this pair of shoes, this t-shirt and also, this jacket. I also want to know if this fur coat is on sale, because I love it!'
    )
    expect(sequence.length).toEqual(constantsHelper.MAX_SEQUENCE_LENGTH)
    expect(sequence).toEqual([
      'i',
      'want',
      'buy',
      'pair',
      'shoes',
      't-shirt',
      'jacket',
      'i',
      'want',
      'know',
      'fur',
      'coat',
    ])
    expect(input.shape).toEqual([1, constantsHelper.MAX_SEQUENCE_LENGTH])
    expect(input.arraySync()).toEqual([[6, 7, 9, 1, 1, 28, 27, 6, 7, 1, 1, 21]])
  })
})
