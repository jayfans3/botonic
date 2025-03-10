import { tensor, Tensor2D, Tensor3D } from '@tensorflow/tfjs'

export const LOCALE = 'en'
export const MAX_LENGTH = 12

export const ENTITIES = ['O', 'product', 'color', 'material', 'size']
export const VOCABULARY = [
  '<PAD>',
  '<UNK>',
  'i',
  'looking',
  'a',
  'size',
  's',
  'wool',
  'jacket',
  'xs',
  'linen',
  'm',
  'leather',
  'shirt',
  'xxl',
  't-shirt',
  'hate',
  'red',
  'cotton',
  'white',
  'hat',
  'fur',
  'xxs',
  'hoodie',
  'belts',
  'gray',
  'black',
  'brown',
  'allergic',
  'xl',
  'pink',
  'orange',
  'love',
  'want',
  'return',
  'not',
  'can',
  'someone',
  'tell',
  'where',
  'buy',
  'new',
  'shoes',
  'l',
  'blue',
  'clothes',
  'material',
  'jeans',
  'trousers',
  'sale',
  'people',
  'who',
  'wears',
  'coat',
]

export const SENTENCE = 'I love this t-shirt'

export const SEQUENCE = [
  'i',
  'love',
  't-shirt',
  '<PAD>',
  '<PAD>',
  '<PAD>',
  '<PAD>',
  '<PAD>',
  '<PAD>',
  '<PAD>',
  '<PAD>',
  '<PAD>',
]

export const INPUT = tensor([
  [2, 32, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]) as Tensor2D

export const PREDICTION = tensor([
  [
    [
      0.9980626702308655,
      0.0010326388292014599,
      0.0006149030523374677,
      0.000022631018509855494,
      0.00026725896168500185,
    ],
    [
      0.9847850799560547,
      0.0015261272201314569,
      0.010293391533195972,
      0.0010365151101723313,
      0.002358944620937109,
    ],
    [
      0.005220839288085699,
      0.9752882122993469,
      0.004510148428380489,
      0.012880109250545502,
      0.0021006991155445576,
    ],
    [
      0.9968760013580322,
      0.0028862657491117716,
      0.00004563478796626441,
      0.0000911425959202461,
      0.00010087011469295248,
    ],
    [
      0.9999738931655884,
      0.000018184398868470453,
      0.0000011219073030588333,
      5.422922981779266e-7,
      0.000006209743787621846,
    ],
    [
      0.9999977350234985,
      0.000001099450514630007,
      1.6806004055069934e-7,
      5.281314585658947e-8,
      0.0000011088586688856594,
    ],
    [
      0.9999988079071045,
      4.800530177817564e-7,
      1.0194928989903929e-7,
      2.7354300158322076e-8,
      5.824322215630673e-7,
    ],
    [
      0.9999990463256836,
      3.522574729686312e-7,
      9.168325476593964e-8,
      2.1094113122899216e-8,
      4.308091945404158e-7,
    ],
    [
      0.9999992847442627,
      2.735550594934466e-7,
      1.1736856464494849e-7,
      2.02248617853229e-8,
      3.955283887080441e-7,
    ],
    [
      0.999998927116394,
      2.75353613687912e-7,
      2.720232998854044e-7,
      3.574337625877888e-8,
      6.116069926065393e-7,
    ],
    [
      0.9999969005584717,
      3.9465356849177624e-7,
      0.0000010032919135483098,
      1.190010578966394e-7,
      0.0000016130512676681974,
    ],
    [
      0.9999877214431763,
      8.529913770871644e-7,
      0.000004160698154009879,
      5.689886393156485e-7,
      0.00000663946730128373,
    ],
  ],
]) as Tensor3D
