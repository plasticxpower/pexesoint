// Game configuration constants
export const GRID_COLUMNS = 4;
export const GRID_ROWS = 3;
export const TOTAL_CARDS = GRID_COLUMNS * GRID_ROWS;
export const PAIRS = Math.floor(TOTAL_CARDS / 2);
export const PLAYER_OPTIONS = [1, 2, 3, 4];

export const CATEGORIES = [
  { key: 'mammals', labelKey: 'Mammals' },
  { key: 'birds', labelKey: 'Birds' },
  { key: 'fish', labelKey: 'Fish' },
  { key: 'reptiles', labelKey: 'Reptiles' },
  { key: 'amphibians', labelKey: 'Amphibians' }
];

export const ANIMAL_KEYWORDS = [
  'Lion','Elephant','Tiger','Giraffe','Zebra','Bear','Wolf','Fox','Kangaroo','Penguin',
  'Dolphin','Whale','Horse','Dog','Cat','Eagle','Owl','Monkey','Gorilla','Panda',
  'Cheetah','Leopard','Rhinoceros','Hippo','Hippopotamus','Crocodile','Alligator','Turtle','Rabbit','Deer','Squirrel',
  'Frog','Toad','Salamander','Newt','Snake','Lizard','Gecko','Iguana','Chameleon',
  'Shark','Salmon','Tuna','Bass','Trout','Goldfish','Angelfish','Clownfish','Swordfish','Marlin'
];