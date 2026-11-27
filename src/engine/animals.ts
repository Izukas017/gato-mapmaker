import type { PropDefinition } from '../types/map';

// Top-down animals (head towards the top of the sprite), built from a few parametric bodies.

interface Look {
  coat: string;
  accent?: string; // pattern, mane, ears, wings
  belly?: string; // back stripe / mask / second tone
  pattern?: 'spots' | 'stripes' | 'patches' | 'rosettes' | 'saddle' | 'wool' | 'dapple';
  ears?: 'point' | 'round' | 'floppy' | 'long' | 'big';
  horns?: 'curved' | 'bull' | 'ram' | 'antlers' | 'moose' | 'unicorn' | 'rhino';
  tail?: 'long' | 'bushy' | 'tuft' | 'short' | 'curl' | 'thin' | 'ringed';
  mane?: 'strip' | 'lion';
  wings?: 'feather' | 'membrane';
  head?: number; // head size factor
  girth?: number; // body width factor
  neck?: number; // extra neck length (0..1)
  muzzle?: string;
  beak?: string;
  crest?: string;
  tusks?: boolean;
  trunk?: boolean;
  hump?: boolean;
  spread?: boolean; // birds in flight
  fan?: boolean; // peacock tail
  hood?: boolean; // cobra
  shell?: boolean;
}

type Body = 'beast' | 'bird' | 'lizard' | 'frog' | 'snake' | 'spider' | 'scorpion' | 'fish' | 'octopus';

type Row = [id: string, name: string, body: Body, width: number, height: number, tags: string, look: Look];

const ROWS: Row[] = [
  // Équidos
  ['horse_black', 'Caballo Negro', 'beast', 1.1, 2.1, 'caballo montura', { coat: '#2b2522', accent: '#0d0b0a', mane: 'strip', tail: 'bushy', ears: 'point', neck: 0.5, girth: 0.9 }],
  ['horse_pinto', 'Caballo Pinto', 'beast', 1.1, 2.1, 'caballo manchas', { coat: '#e8e1d4', accent: '#7a4a28', pattern: 'patches', mane: 'strip', tail: 'bushy', ears: 'point', neck: 0.5, girth: 0.9 }],
  ['horse_dapple', 'Caballo Tordo', 'beast', 1.1, 2.1, 'caballo gris', { coat: '#9aa0a8', accent: '#e3e6ea', pattern: 'dapple', mane: 'strip', tail: 'bushy', ears: 'point', neck: 0.5, girth: 0.9 }],
  ['horse_palomino', 'Caballo Palomino', 'beast', 1.1, 2.1, 'caballo dorado', { coat: '#d3a24f', accent: '#f4ead0', mane: 'strip', tail: 'bushy', ears: 'point', neck: 0.5, girth: 0.9 }],
  ['pony', 'Poni', 'beast', 0.85, 1.45, 'caballo pequeño', { coat: '#8a5a33', accent: '#d9c08a', mane: 'strip', tail: 'bushy', ears: 'point', neck: 0.3 }],
  ['donkey', 'Burro Gris', 'beast', 1, 1.75, 'asno carga', { coat: '#8c857c', accent: '#403a34', mane: 'strip', tail: 'tuft', ears: 'long', neck: 0.35, muzzle: '#d9d2c6' }],
  ['zebra', 'Cebra', 'beast', 1.1, 2, 'sabana rayas', { coat: '#eeece6', accent: '#1d1b19', pattern: 'stripes', mane: 'strip', tail: 'tuft', ears: 'point', neck: 0.5, girth: 0.9, muzzle: '#2c2825' }],
  ['unicorn', 'Unicornio', 'beast', 1.1, 2.1, 'fantasia magia caballo', { coat: '#f5f2fa', accent: '#c9a6f0', mane: 'strip', tail: 'bushy', ears: 'point', horns: 'unicorn', neck: 0.5, girth: 0.9 }],
  ['pegasus', 'Pegaso', 'beast', 2.4, 2.1, 'fantasia alas caballo', { coat: '#f4efe4', accent: '#e0d3b8', wings: 'feather', mane: 'strip', tail: 'bushy', ears: 'point', neck: 0.5, girth: 0.45 }],
  // Bovinos
  ['cow_brown', 'Vaca Parda', 'beast', 1.2, 1.9, 'vaca ganado granja', { coat: '#8b5a35', accent: '#5e3a20', horns: 'curved', ears: 'floppy', tail: 'tuft', girth: 1.15, muzzle: '#e0b9a6' }],
  ['cow_black', 'Vaca Negra', 'beast', 1.2, 1.9, 'vaca ganado granja', { coat: '#2c2927', accent: '#ece7dc', pattern: 'patches', horns: 'curved', ears: 'floppy', tail: 'tuft', girth: 1.15, muzzle: '#caa59a' }],
  ['bull', 'Toro', 'beast', 1.3, 2, 'toro ganado', { coat: '#3b2418', accent: '#1a0f09', horns: 'bull', ears: 'floppy', tail: 'tuft', girth: 1.2, head: 1.15, muzzle: '#8d6f62' }],
  ['ox', 'Buey de Tiro', 'beast', 1.3, 2, 'buey granja carga', { coat: '#b98a56', accent: '#7c5733', horns: 'bull', ears: 'floppy', tail: 'tuft', girth: 1.2, muzzle: '#e3c3a8' }],
  ['bison', 'Bisonte', 'beast', 1.45, 2.1, 'salvaje pradera', { coat: '#5a3b25', accent: '#2f1d11', horns: 'curved', ears: 'round', tail: 'tuft', mane: 'lion', hump: true, girth: 1.2, head: 1.2 }],
  ['yak', 'Yak', 'beast', 1.35, 1.95, 'montaña nieve carga', { coat: '#3a2d27', accent: '#6a564a', pattern: 'wool', horns: 'bull', ears: 'floppy', tail: 'bushy', girth: 1.2 }],
  // Cerdos
  ['pig_spotted', 'Cerdo Manchado', 'beast', 0.9, 1.35, 'cerdo granja', { coat: '#efb3ab', accent: '#5b3a33', pattern: 'spots', ears: 'floppy', tail: 'curl', girth: 1.2, muzzle: '#df8f95' }],
  ['pig_black', 'Cerdo Negro', 'beast', 0.9, 1.35, 'cerdo iberico granja', { coat: '#3d3230', accent: '#1d1716', ears: 'floppy', tail: 'curl', girth: 1.2, muzzle: '#8a6a68' }],
  ['piglet', 'Lechón', 'beast', 0.5, 0.75, 'cerdo cria', { coat: '#f4bcc4', accent: '#e293a1', ears: 'floppy', tail: 'curl', girth: 1.15, head: 1.2, muzzle: '#e18896' }],
  ['warthog', 'Facóquero', 'beast', 0.95, 1.45, 'jabali sabana', { coat: '#85725f', accent: '#4a3a2c', mane: 'strip', ears: 'point', tail: 'tuft', tusks: true, head: 1.2 }],
  ['boar_dark', 'Jabalí Negro', 'beast', 1, 1.5, 'jabali bosque caza', { coat: '#342921', accent: '#130e0a', mane: 'strip', ears: 'point', tail: 'short', tusks: true, head: 1.15, girth: 1.1 }],
  // Ovejas y cabras
  ['sheep_black', 'Oveja Negra', 'beast', 0.95, 1.35, 'oveja rebaño', { coat: '#3b3735', accent: '#57514d', belly: '#171413', pattern: 'wool', ears: 'floppy', tail: 'short', girth: 1.2 }],
  ['ram', 'Carnero', 'beast', 1, 1.45, 'oveja cuernos', { coat: '#e3dac6', accent: '#c9bda2', pattern: 'wool', horns: 'ram', ears: 'floppy', tail: 'short', girth: 1.15 }],
  ['lamb', 'Cordero', 'beast', 0.55, 0.8, 'oveja cria', { coat: '#f7f3ea', accent: '#ddd4c2', pattern: 'wool', ears: 'floppy', tail: 'short', head: 1.2, girth: 1.1 }],
  ['goat_white', 'Cabra Blanca', 'beast', 0.85, 1.3, 'cabra granja', { coat: '#ebe6da', accent: '#b9ae99', horns: 'curved', ears: 'floppy', tail: 'short' }],
  ['goat_black', 'Cabra Negra', 'beast', 0.85, 1.3, 'cabra monte', { coat: '#2f2926', accent: '#8d7b63', horns: 'curved', ears: 'floppy', tail: 'short' }],
  // Perros
  ['dog_black', 'Perro Negro', 'beast', 0.75, 1.15, 'perro mascota', { coat: '#25201d', accent: '#0f0c0b', ears: 'floppy', tail: 'long' }],
  ['dog_white', 'Perro Blanco', 'beast', 0.75, 1.15, 'perro mascota', { coat: '#eeeae0', accent: '#c8bca6', ears: 'point', tail: 'bushy' }],
  ['dog_dalmatian', 'Perro Dálmata', 'beast', 0.75, 1.15, 'perro manchas', { coat: '#f2f0ea', accent: '#1c1a18', pattern: 'spots', ears: 'floppy', tail: 'long' }],
  ['dog_shepherd', 'Perro Pastor', 'beast', 0.85, 1.35, 'perro guardia', { coat: '#b07a3e', accent: '#2a1d12', pattern: 'saddle', ears: 'point', tail: 'bushy' }],
  ['puppy', 'Cachorro', 'beast', 0.45, 0.65, 'perro cria', { coat: '#c99a62', accent: '#7a5230', ears: 'floppy', tail: 'short', head: 1.35 }],
  // Gatos y grandes felinos
  ['cat_black', 'Gato Negro', 'beast', 0.65, 0.9, 'gato felino bruja', { coat: '#201d1f', accent: '#0b0a0b', ears: 'point', tail: 'long' }],
  ['cat_white', 'Gato Blanco', 'beast', 0.65, 0.9, 'gato felino', { coat: '#f3f0ea', accent: '#d6cfc2', ears: 'point', tail: 'long' }],
  ['cat_grey', 'Gato Gris', 'beast', 0.65, 0.9, 'gato felino', { coat: '#8d9199', accent: '#575b63', pattern: 'stripes', ears: 'point', tail: 'long' }],
  ['cat_siamese', 'Gato Siamés', 'beast', 0.65, 0.9, 'gato felino', { coat: '#e6d7bd', accent: '#4a3426', ears: 'point', tail: 'long', muzzle: '#6b4d3a' }],
  ['cat_calico', 'Gato Calicó', 'beast', 0.65, 0.9, 'gato felino tricolor', { coat: '#f1ece2', accent: '#d07a2c', belly: '#2c2523', pattern: 'patches', ears: 'point', tail: 'long' }],
  ['lion', 'León', 'beast', 1.2, 1.9, 'felino sabana fiera', { coat: '#d2a052', accent: '#7a4718', mane: 'lion', ears: 'round', tail: 'tuft', head: 1.2 }],
  ['lioness', 'Leona', 'beast', 1.05, 1.75, 'felino sabana', { coat: '#d9ab63', accent: '#8d6130', ears: 'round', tail: 'tuft' }],
  ['tiger', 'Tigre', 'beast', 1.15, 1.9, 'felino selva rayas', { coat: '#dc7c24', accent: '#201208', pattern: 'stripes', ears: 'round', tail: 'ringed', head: 1.15, muzzle: '#f3e6cf' }],
  ['tiger_white', 'Tigre Blanco', 'beast', 1.15, 1.9, 'felino nieve rayas', { coat: '#eeeae2', accent: '#2a2a31', pattern: 'stripes', ears: 'round', tail: 'ringed', head: 1.15 }],
  ['panther', 'Pantera Negra', 'beast', 1, 1.75, 'felino selva', { coat: '#1c1a22', accent: '#08070b', ears: 'round', tail: 'long' }],
  ['leopard', 'Leopardo', 'beast', 1, 1.75, 'felino manchas', { coat: '#d9a548', accent: '#33200d', pattern: 'rosettes', ears: 'round', tail: 'long' }],
  ['snow_leopard', 'Leopardo de las Nieves', 'beast', 1, 1.8, 'felino nieve', { coat: '#d5d8dc', accent: '#3d424a', pattern: 'rosettes', ears: 'round', tail: 'bushy' }],
  // Cánidos salvajes
  ['wolf_white', 'Lobo Blanco', 'beast', 0.85, 1.45, 'lobo nieve bestia', { coat: '#e8eaee', accent: '#aab1bc', pattern: 'saddle', ears: 'point', tail: 'bushy' }],
  ['wolf_black', 'Lobo Negro', 'beast', 0.85, 1.45, 'lobo bestia', { coat: '#2a2c33', accent: '#0c0d11', pattern: 'saddle', ears: 'point', tail: 'bushy' }],
  ['dire_wolf', 'Lobo Terrible', 'beast', 1.4, 2.3, 'lobo gigante monstruo', { coat: '#4a4038', accent: '#17110d', pattern: 'saddle', mane: 'strip', ears: 'point', tail: 'bushy', head: 1.2, tusks: true }],
  ['fox_red', 'Zorro Rojo', 'beast', 0.65, 1.15, 'zorro bosque', { coat: '#d1651f', accent: '#2c1607', belly: '#f6efe2', ears: 'big', tail: 'bushy' }],
  ['fox_arctic', 'Zorro Ártico', 'beast', 0.65, 1.15, 'zorro nieve', { coat: '#eef1f4', accent: '#a8b2bd', ears: 'big', tail: 'bushy' }],
  ['hyena', 'Hiena', 'beast', 0.9, 1.5, 'sabana carroñero', { coat: '#b59a6e', accent: '#443322', pattern: 'spots', mane: 'strip', ears: 'round', tail: 'tuft', head: 1.15 }],
  // Osos
  ['bear_black', 'Oso Negro', 'beast', 1.35, 1.8, 'oso bosque bestia', { coat: '#221c19', accent: '#0d0a08', ears: 'round', tail: 'short', girth: 1.25, head: 1.25, muzzle: '#8a684b' }],
  ['bear_polar', 'Oso Polar', 'beast', 1.45, 1.95, 'oso nieve bestia', { coat: '#f0f1ec', accent: '#c9ccc4', ears: 'round', tail: 'short', girth: 1.2, head: 1.15, muzzle: '#d6d6cc' }],
  ['panda', 'Panda', 'beast', 1.2, 1.55, 'oso bambu', { coat: '#f1efe9', accent: '#191717', pattern: 'saddle', ears: 'round', tail: 'short', girth: 1.25, head: 1.3 }],
  ['bear_cub', 'Osezno', 'beast', 0.7, 0.9, 'oso cria', { coat: '#7a5030', accent: '#3d2514', ears: 'round', tail: 'short', girth: 1.2, head: 1.4, muzzle: '#c49a72' }],
  // Bosque
  ['deer_doe', 'Cierva', 'beast', 0.95, 1.55, 'ciervo bosque', { coat: '#b57c45', accent: '#6f4823', ears: 'big', tail: 'short', girth: 0.85, neck: 0.4 }],
  ['fawn', 'Cervatillo', 'beast', 0.6, 0.95, 'ciervo cria', { coat: '#c4874a', accent: '#f6ead2', pattern: 'spots', ears: 'big', tail: 'short', girth: 0.85, head: 1.2 }],
  ['moose', 'Alce', 'beast', 2, 2.2, 'bosque nieve astas', { coat: '#5c3f2a', accent: '#c5a978', horns: 'moose', ears: 'point', tail: 'short', girth: 0.65, head: 0.85, neck: 0.3 }],
  ['reindeer', 'Reno', 'beast', 1.3, 1.8, 'nieve astas', { coat: '#8b7058', accent: '#d8c8a8', belly: '#e9e2d4', horns: 'antlers', ears: 'point', tail: 'short', girth: 0.85 }],
  ['rabbit_brown', 'Conejo Pardo', 'beast', 0.5, 0.7, 'conejo bosque caza', { coat: '#a67c55', accent: '#d9b48f', ears: 'long', tail: 'short', girth: 1.15, head: 1.25 }],
  ['rabbit_white', 'Conejo Blanco', 'beast', 0.5, 0.7, 'conejo nieve mascota', { coat: '#f5f2ec', accent: '#e6b8bd', ears: 'long', tail: 'short', girth: 1.15, head: 1.25 }],
  ['squirrel', 'Ardilla', 'beast', 0.5, 0.75, 'bosque pequeño', { coat: '#b35a22', accent: '#d9853f', ears: 'point', tail: 'bushy', head: 1.2 }],
  ['raccoon', 'Mapache', 'beast', 0.6, 0.95, 'bosque ladron', { coat: '#80848a', accent: '#1f2023', belly: '#26272b', ears: 'round', tail: 'ringed', head: 1.15, girth: 1.1 }],
  ['badger', 'Tejón', 'beast', 0.65, 0.95, 'bosque madriguera', { coat: '#6d6b69', accent: '#171615', belly: '#f0ede6', pattern: 'saddle', ears: 'round', tail: 'short', girth: 1.2 }],
  ['rat', 'Rata', 'beast', 0.4, 0.75, 'plaga alcantarilla', { coat: '#6e625a', accent: '#d7a1a0', ears: 'round', tail: 'thin' }],
  ['rat_giant', 'Rata Gigante', 'beast', 1, 1.8, 'monstruo alcantarilla', { coat: '#46403b', accent: '#c4878a', mane: 'strip', ears: 'round', tail: 'thin', tusks: true }],
  ['mouse_white', 'Ratón Blanco', 'beast', 0.3, 0.55, 'pequeño mascota', { coat: '#eeeae4', accent: '#eab0b4', ears: 'big', tail: 'thin', head: 1.2 }],
  // Exóticos
  ['elephant', 'Elefante', 'beast', 2.4, 3.1, 'sabana gigante', { coat: '#8d9097', accent: '#6d7077', trunk: true, tusks: true, ears: 'big', tail: 'tuft', girth: 1.15, head: 1.3 }],
  ['rhino', 'Rinoceronte', 'beast', 1.6, 2.5, 'sabana cuerno', { coat: '#84858a', accent: '#d9d2c0', horns: 'rhino', ears: 'point', tail: 'tuft', girth: 1.2, head: 1.15 }],
  ['camel', 'Camello', 'beast', 1.2, 2.2, 'desierto montura', { coat: '#c79c60', accent: '#8a6535', hump: true, ears: 'round', tail: 'tuft', neck: 0.7, girth: 0.9 }],
  ['giraffe', 'Jirafa', 'beast', 1.2, 2.8, 'sabana cuello', { coat: '#e3b65a', accent: '#7a4a1f', pattern: 'patches', ears: 'point', horns: 'curved', tail: 'tuft', neck: 1, girth: 0.85, head: 0.85 }],
  ['gorilla', 'Gorila', 'beast', 1.3, 1.4, 'simio selva', { coat: '#2c2a2c', accent: '#8b8c92', pattern: 'saddle', ears: 'round', girth: 1.3, head: 1.15, muzzle: '#4a4044' }],
  ['monkey', 'Mono', 'beast', 0.6, 0.95, 'simio selva', { coat: '#8a5c34', accent: '#e0b890', ears: 'big', tail: 'long', head: 1.2, muzzle: '#e0b890' }],
  // Aves
  ['hen_white', 'Gallina Blanca', 'bird', 0.55, 0.7, 'ave granja pollo', { coat: '#f4f1e8', accent: '#ded7c6', beak: '#f2b21d', crest: '#d62828' }],
  ['rooster', 'Gallo', 'bird', 0.65, 0.95, 'ave granja', { coat: '#a8431f', accent: '#14503c', beak: '#f2b21d', crest: '#d62828', fan: false }],
  ['chick', 'Pollito', 'bird', 0.3, 0.38, 'ave cria', { coat: '#fbdc4e', accent: '#e9bd25', beak: '#ec8a1a' }],
  ['duck_white', 'Pato Blanco', 'bird', 0.55, 0.75, 'ave estanque', { coat: '#f6f4ee', accent: '#dcd8cb', beak: '#ef8c1b' }],
  ['duck_mallard', 'Pato Azulón', 'bird', 0.55, 0.75, 'ave estanque', { coat: '#8a7560', accent: '#4d3d30', belly: '#17704a', beak: '#e8b51f' }],
  ['goose', 'Ganso', 'bird', 0.75, 1.15, 'ave granja', { coat: '#b9b2a6', accent: '#756c60', beak: '#ee8a24', neck: 0.6 }],
  ['swan', 'Cisne', 'bird', 0.85, 1.3, 'ave lago', { coat: '#fbfaf6', accent: '#e2dfd4', beak: '#e8681c', neck: 1 }],
  ['turkey', 'Pavo', 'bird', 0.95, 1.1, 'ave granja', { coat: '#4a2f20', accent: '#a9743c', beak: '#d9a441', crest: '#c32f27', fan: true }],
  ['peacock', 'Pavo Real', 'bird', 1.6, 1.7, 'ave jardin', { coat: '#1556a8', accent: '#1f8a5c', beak: '#c9b896', crest: '#2bc4d6', fan: true }],
  ['penguin', 'Pingüino', 'bird', 0.55, 0.8, 'ave hielo', { coat: '#1d222b', accent: '#0d1015', belly: '#f4f4ef', beak: '#ee9a22' }],
  ['flamingo', 'Flamenco', 'bird', 0.7, 1.35, 'ave rosa', { coat: '#f58ca0', accent: '#d9546f', beak: '#2a2224', neck: 1 }],
  ['pigeon', 'Paloma', 'bird', 0.35, 0.55, 'ave ciudad', { coat: '#9aa3b0', accent: '#5f6876', beak: '#d8d2c4' }],
  ['crow', 'Cuervo', 'bird', 0.45, 0.7, 'ave negro', { coat: '#17171c', accent: '#2f3040', beak: '#3a3a42' }],
  ['crow_flying', 'Cuervo en Vuelo', 'bird', 1.1, 0.8, 'ave negro volando', { coat: '#17171c', accent: '#2f3040', beak: '#3a3a42', spread: true }],
  ['owl', 'Búho', 'bird', 0.6, 0.75, 'ave noche', { coat: '#8a6a45', accent: '#4d3822', belly: '#d9c39b', beak: '#d89b2b' }],
  ['owl_snow', 'Búho Nival', 'bird', 0.6, 0.75, 'ave nieve', { coat: '#f2f2ee', accent: '#b9bcbf', beak: '#3d3d40' }],
  ['parrot_red', 'Guacamayo Rojo', 'bird', 0.45, 0.85, 'ave loro pirata', { coat: '#d8261f', accent: '#1d5fc4', beak: '#e8dcc0' }],
  ['parrot_green', 'Loro Verde', 'bird', 0.4, 0.7, 'ave pirata', { coat: '#2f9e44', accent: '#176b2c', beak: '#d9a23a' }],
  ['eagle', 'Águila', 'bird', 2, 1.2, 'ave rapaz volando', { coat: '#5b3b22', accent: '#33200f', belly: '#f3efe4', beak: '#eeb21f', spread: true }],
  ['hawk', 'Halcón', 'bird', 1.4, 0.95, 'ave rapaz volando', { coat: '#9a6a3c', accent: '#5a3a1d', beak: '#d8a52b', spread: true }],
  ['vulture', 'Buitre', 'bird', 2.1, 1.25, 'ave carroñero volando', { coat: '#3a302a', accent: '#1c1612', belly: '#d9b8a2', beak: '#c9b27c', spread: true }],
  ['seagull', 'Gaviota', 'bird', 1.1, 0.7, 'ave puerto volando', { coat: '#f5f6f8', accent: '#8d97a6', beak: '#e8a41f', spread: true }],
  ['bat', 'Murciélago', 'bird', 1, 0.6, 'cueva noche volando', { coat: '#3a2c33', accent: '#241a20', wings: 'membrane', ears: 'point', spread: true }],
  ['bat_giant', 'Murciélago Gigante', 'bird', 2.4, 1.4, 'monstruo cueva volando', { coat: '#2b1f26', accent: '#4a2f38', wings: 'membrane', ears: 'point', spread: true }],
  // Reptiles y anfibios
  ['crocodile', 'Cocodrilo', 'lizard', 1.2, 2.9, 'rio pantano reptil', { coat: '#4f6b2f', accent: '#2c3f18', pattern: 'spots', head: 1.15 }],
  ['alligator_dark', 'Caimán Oscuro', 'lizard', 1.1, 2.6, 'pantano reptil', { coat: '#2f3b30', accent: '#141c15', pattern: 'stripes', head: 1.1 }],
  ['lizard_green', 'Lagarto Verde', 'lizard', 0.5, 1, 'reptil bosque', { coat: '#4ea13a', accent: '#23561a', pattern: 'spots' }],
  ['lizard_desert', 'Lagarto del Desierto', 'lizard', 0.5, 1, 'reptil arena', { coat: '#c99a54', accent: '#7c5525', pattern: 'stripes' }],
  ['salamander', 'Salamandra', 'lizard', 0.45, 0.95, 'fuego anfibio', { coat: '#1d1a19', accent: '#f6b11c', pattern: 'patches' }],
  ['turtle', 'Tortuga Verde', 'lizard', 0.9, 1.1, 'agua caparazon', { coat: '#6a9a4a', accent: '#2f5a28', shell: true }],
  ['tortoise', 'Tortuga de Tierra', 'lizard', 0.9, 1.1, 'caparazon', { coat: '#a89060', accent: '#5c4223', shell: true }],
  ['dragon_red', 'Dragón Rojo', 'lizard', 3.6, 4, 'monstruo fantasia jefe', { coat: '#a62a1e', accent: '#e07a2c', wings: 'membrane', horns: 'curved', pattern: 'stripes', head: 1.2 }],
  ['dragon_green', 'Dragón Verde', 'lizard', 3.6, 4, 'monstruo fantasia jefe', { coat: '#2f7a39', accent: '#a9c43f', wings: 'membrane', horns: 'curved', pattern: 'stripes', head: 1.2 }],
  ['dragon_black', 'Dragón Negro', 'lizard', 3.6, 4, 'monstruo fantasia jefe', { coat: '#26232c', accent: '#6b4a8a', wings: 'membrane', horns: 'curved', pattern: 'stripes', head: 1.2 }],
  ['dragon_blue', 'Dragón Azul', 'lizard', 3.6, 4, 'monstruo fantasia jefe', { coat: '#1f5a9c', accent: '#74c0e8', wings: 'membrane', horns: 'curved', pattern: 'stripes', head: 1.2 }],
  ['dragon_white', 'Dragón Blanco', 'lizard', 3.6, 4, 'monstruo hielo jefe', { coat: '#d8e6ee', accent: '#7fa9c4', wings: 'membrane', horns: 'curved', pattern: 'stripes', head: 1.2 }],
  ['drake', 'Cría de Dragón', 'lizard', 1.2, 1.4, 'monstruo fantasia', { coat: '#c4542a', accent: '#f0a44a', wings: 'membrane', horns: 'curved', head: 1.35 }],
  ['frog_green', 'Rana Verde', 'frog', 0.45, 0.5, 'anfibio charca', { coat: '#4faa35', accent: '#245c17' }],
  ['frog_poison', 'Rana Venenosa', 'frog', 0.4, 0.45, 'anfibio selva veneno', { coat: '#1f6fd6', accent: '#101318' }],
  ['frog_red', 'Rana Roja', 'frog', 0.4, 0.45, 'anfibio selva', { coat: '#d6362a', accent: '#17120f' }],
  ['toad', 'Sapo', 'frog', 0.55, 0.6, 'anfibio pantano', { coat: '#8a7440', accent: '#4a3c1c' }],
  ['frog_giant', 'Sapo Gigante', 'frog', 1.8, 2, 'monstruo pantano', { coat: '#5f7a2c', accent: '#2f3d12' }],
  // Serpientes
  ['snake_green', 'Serpiente Verde', 'snake', 0.8, 1.7, 'reptil selva', { coat: '#4c9e32', accent: '#c9d94a' }],
  ['snake_coral', 'Serpiente Coral', 'snake', 0.7, 1.5, 'reptil veneno', { coat: '#d12c20', accent: '#161313', belly: '#f4d83a' }],
  ['snake_viper', 'Víbora del Desierto', 'snake', 0.7, 1.5, 'reptil arena veneno', { coat: '#c4a064', accent: '#6e4d24' }],
  ['cobra', 'Cobra', 'snake', 0.9, 1.8, 'reptil veneno', { coat: '#6a5530', accent: '#e0c47a', hood: true }],
  ['python', 'Pitón', 'snake', 1.4, 2.8, 'reptil gigante', { coat: '#8c7a3c', accent: '#3a2c12', head: 1.2 }],
  ['snake_giant', 'Serpiente Gigante', 'snake', 2.2, 4.2, 'monstruo reptil jefe', { coat: '#2f3a44', accent: '#8a2f3c', head: 1.3, hood: true }],
  // Arácnidos
  ['spider_black', 'Araña Negra', 'spider', 0.7, 0.8, 'insecto veneno', { coat: '#1b171c', accent: '#c01f2c' }],
  ['spider_brown', 'Tarántula', 'spider', 0.7, 0.8, 'insecto selva', { coat: '#5a3a24', accent: '#c98a3c' }],
  ['spider_giant', 'Araña Gigante', 'spider', 2.2, 2.4, 'monstruo cueva', { coat: '#2a2230', accent: '#8d3fb0' }],
  ['scorpion', 'Escorpión', 'scorpion', 0.75, 1.1, 'desierto veneno', { coat: '#c28a36', accent: '#6e4a14' }],
  ['scorpion_black', 'Escorpión Negro', 'scorpion', 0.75, 1.1, 'veneno cueva', { coat: '#25202a', accent: '#6a2a3a' }],
  ['scorpion_giant', 'Escorpión Gigante', 'scorpion', 2, 2.9, 'monstruo desierto', { coat: '#8c3a22', accent: '#3d150b' }],
  // Acuáticos
  ['fish_orange', 'Pez Naranja', 'fish', 0.4, 0.7, 'agua estanque', { coat: '#f07b1f', accent: '#f9c060' }],
  ['fish_blue', 'Pez Azul', 'fish', 0.4, 0.7, 'agua rio', { coat: '#2e78c9', accent: '#8ecbf0' }],
  ['koi', 'Carpa Koi', 'fish', 0.5, 0.95, 'agua estanque jardin', { coat: '#f4f0e8', accent: '#e0521f', pattern: 'patches' }],
  ['shark', 'Tiburón', 'fish', 1.5, 3.1, 'mar depredador', { coat: '#6d7f8e', accent: '#3f505e' }],
  ['dolphin', 'Delfín', 'fish', 1, 2.1, 'mar', { coat: '#7f9bb4', accent: '#5a748c' }],
  ['octopus', 'Pulpo', 'octopus', 1.1, 1.2, 'mar tentaculos', { coat: '#b0476a', accent: '#e592a8' }],
  ['kraken', 'Kraken', 'octopus', 4, 4.2, 'monstruo mar jefe', { coat: '#3f2f66', accent: '#8f74c4' }],
];

export const EXTRA_ANIMALS: PropDefinition[] = ROWS.map(
  ([id, name, body, widthTiles, heightTiles, tags]) => ({
    id,
    name,
    category: 'animals',
    widthTiles,
    heightTiles,
    defaultLayer: 'above_floor',
    defaultShadow: body !== 'fish',
    tags: ['animal', ...tags.split(' ')],
  })
);

const LOOKS = new Map(ROWS.map((row) => [row[0], { body: row[2], look: row[6] }]));
const OUTLINE = 'rgba(18, 11, 6, 0.85)';
const TAU = Math.PI * 2;

// Draws the animal with that id and returns true; false if the id is not one of these.
export function drawAnimal(
  ctx: CanvasRenderingContext2D,
  id: string,
  w: number,
  h: number
): boolean {
  const entry = LOOKS.get(id);
  if (!entry) return false;
  const { body, look } = entry;
  const accent = look.accent ?? look.coat;
  const line = Math.max(1.5, Math.min(w, h) * 0.025);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const shape = (fill: string, path: () => void, outline = true) => {
    ctx.beginPath();
    path();
    ctx.fillStyle = fill;
    ctx.fill();
    if (outline) {
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = line;
      ctx.stroke();
    }
  };
  // All coordinates are fractions of the sprite size.
  const oval = (fill: string, x: number, y: number, rx: number, ry: number, turn = 0, outline = true) =>
    shape(fill, () => ctx.ellipse(x * w, y * h, rx * w, ry * h, turn, 0, TAU), outline);
  const dot = (fill: string, x: number, y: number, r: number) =>
    shape(fill, () => ctx.arc(x * w, y * h, r * Math.min(w, h), 0, TAU), false);
  const stroke = (color: string, width: number, path: () => void, outline = true) => {
    ctx.beginPath();
    path();
    if (outline) {
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = width + line * 1.6;
      ctx.stroke();
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };
  const move = (x: number, y: number) => ctx.moveTo(x * w, y * h);
  const to = (x: number, y: number) => ctx.lineTo(x * w, y * h);
  const curve = (ax: number, ay: number, x: number, y: number) =>
    ctx.quadraticCurveTo(ax * w, ay * h, x * w, y * h);
  const eyes = (y: number, gap: number, color = '#0d0906', r = 0.028) => {
    for (const side of [-1, 1]) dot(color, 0.5 + side * gap, y, r);
  };

  // Markings clipped to an oval body.
  const markings = (x: number, y: number, rx: number, ry: number) => {
    if (!look.pattern) return;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x * w, y * h, rx * w - line / 2, ry * h - line / 2, 0, 0, TAU);
    ctx.clip();
    const at = (fx: number, fy: number) => [x + fx * rx, y + fy * ry] as const;
    const scatter: [number, number][] = [
      [-0.55, -0.65], [0.35, -0.75], [0.65, -0.2], [-0.15, -0.25], [-0.7, 0.2],
      [0.2, 0.25], [0.7, 0.55], [-0.35, 0.65], [0.15, 0.82], [-0.05, -0.9],
    ];
    if (look.pattern === 'spots' || look.pattern === 'dapple') {
      scatter.forEach(([fx, fy], i) =>
        dot(accent, ...at(fx, fy), (look.pattern === 'dapple' ? 0.035 : 0.05) + (i % 3) * 0.012)
      );
    } else if (look.pattern === 'rosettes') {
      scatter.forEach(([fx, fy]) => {
        const [px, py] = at(fx, fy);
        stroke(accent, line * 1.2, () => ctx.arc(px * w, py * h, 0.055 * w, 0.5, TAU - 0.3), false);
      });
    } else if (look.pattern === 'patches') {
      oval(accent, ...at(-0.65, -0.45), rx * 0.55, ry * 0.32, 0.5, false);
      oval(accent, ...at(0.6, 0.25), rx * 0.6, ry * 0.36, -0.4, false);
      oval(look.belly ?? accent, ...at(-0.3, 0.75), rx * 0.45, ry * 0.22, 0.2, false);
    } else if (look.pattern === 'stripes') {
      for (let i = -3; i <= 3; i++) {
        for (const side of [-1, 1]) {
          const fy = i * 0.27;
          stroke(accent, line * 1.7, () => {
            move(...at(side * 1.05, fy));
            curve(...at(side * 0.55, fy + 0.04), ...at(side * 0.1, fy + 0.13));
          }, false);
        }
      }
    } else if (look.pattern === 'saddle') {
      oval(accent, ...at(0, -0.05), rx * 0.62, ry * 0.72, 0, false);
    } else if (look.pattern === 'wool') {
      scatter.forEach(([fx, fy]) => {
        const [px, py] = at(fx, fy);
        stroke(accent, line, () => ctx.arc(px * w, py * h, 0.09 * w, 3.4, 6.1), false);
      });
    }
    ctx.restore();
  };

  const membraneWing = (side: number, y: number, reach: number, drop: number) => {
    const x = (f: number) => 0.5 + side * f;
    shape(accent, () => {
      move(x(0.08), y - drop * 0.35);
      curve(x(reach * 0.55), y - drop * 1.25, x(reach), y - drop * 0.55);
      curve(x(reach * 0.8), y, x(reach * 0.85), y + drop * 0.55);
      curve(x(reach * 0.62), y + drop * 0.2, x(reach * 0.5), y + drop * 0.7);
      curve(x(reach * 0.34), y + drop * 0.25, x(0.08), y + drop * 0.45);
      ctx.closePath();
    });
    for (const [tx, ty] of [[reach, -0.55], [reach * 0.85, 0.55], [reach * 0.5, 0.7]]) {
      stroke(look.coat, line, () => {
        move(x(0.1), y - drop * 0.2);
        to(x(tx), y + drop * ty);
      }, false);
    }
  };

  const featherWing = (side: number, y: number, reach: number, drop: number, color: string) => {
    const x = (f: number) => 0.5 + side * f;
    shape(color, () => {
      move(x(0.08), y - drop * 0.5);
      curve(x(reach * 0.65), y - drop, x(reach), y - drop * 0.15);
      for (let i = 4; i >= 1; i--) {
        const f = (reach * i) / 5;
        curve(x(f + reach * 0.16), y + drop * (0.75 - i * 0.08), x(f), y + drop * (0.62 - i * 0.05));
      }
      to(x(0.08), y + drop * 0.45);
      ctx.closePath();
    });
  };

  if (body === 'beast') {
    const girth = look.girth ?? 1;
    const head = look.head ?? 1;
    const neck = look.neck ?? 0;
    const rx = 0.27 * girth;
    const headY = 0.27 - neck * 0.11;
    const hx = 0.15 * head * (look.wings ? 0.45 : look.horns === 'moose' ? 0.65 : 1);
    const hy = 0.11 * head;

    if (look.wings) for (const side of [-1, 1]) featherWing(side, 0.54, 0.48, 0.24, accent);

    // Legs peeking out of both flanks
    for (const side of [-1, 1]) {
      for (const y of [0.43, 0.71]) {
        oval(look.pattern === 'saddle' ? accent : look.coat, 0.5 + side * rx * 0.88, y, rx * 0.3, 0.07, side * (y < 0.5 ? 0.4 : -0.4));
      }
    }

    // Tail
    const tailPath = () => {
      move(0.5, 0.76);
      curve(0.66, 0.85, 0.55, 0.96);
    };
    const tail = look.tail;
    if (tail === 'long') stroke(look.coat, w * 0.075, tailPath);
    if (tail === 'thin') stroke(accent, w * 0.045, tailPath);
    if (tail === 'ringed') {
      stroke(look.coat, w * 0.12, tailPath);
      ctx.setLineDash([h * 0.025, h * 0.03]);
      stroke(accent, w * 0.12, tailPath, false);
      ctx.setLineDash([]);
    }
    if (tail === 'tuft') {
      stroke(look.coat, w * 0.04, tailPath);
      oval(accent, 0.55, 0.94, 0.06, 0.045, -0.4);
    }
    if (tail === 'bushy') {
      oval(look.mane ? accent : look.coat, 0.52, 0.84, 0.13, 0.15, -0.15);
      oval(look.belly ?? accent, 0.54, 0.94, 0.06, 0.045, -0.2, false);
    }
    if (tail === 'short') oval(look.coat, 0.5, 0.82, 0.07, 0.055);
    if (tail === 'curl') stroke(accent, line * 1.4, () => ctx.arc(0.53 * w, 0.86 * h, 0.07 * w, 3.6, 3.6 + 5), false);

    oval(look.coat, 0.5, 0.57, rx, 0.25);
    markings(0.5, 0.57, rx, 0.25);
    if (look.hump) oval(accent, 0.5, 0.54, rx * 0.58, 0.11);

    // Neck
    const neckWidth = Math.min(rx, hx) * 0.72;
    shape(look.coat, () => {
      move(0.5 - rx * 0.55, 0.4);
      curve(0.5 - neckWidth, 0.34, 0.5 - neckWidth, headY);
      to(0.5 + neckWidth, headY);
      curve(0.5 + neckWidth, 0.34, 0.5 + rx * 0.55, 0.4);
    });
    if (look.mane === 'lion') oval(accent, 0.5, headY + 0.045, hx * 1.65, hy * 1.6);
    if (look.mane === 'strip') stroke(accent, w * 0.065, () => { move(0.5, headY); to(0.5, 0.52); }, false);

    // Ears
    for (const side of [-1, 1]) {
      const ex = 0.5 + side * hx * 0.82;
      const inner = look.muzzle ?? accent;
      if (look.ears === 'point' || look.ears === undefined) {
        shape(look.coat, () => {
          move(ex - side * hx * 0.45, headY);
          to(ex + side * hx * 0.45, headY - hy * 0.55);
          to(ex + side * hx * 0.2, headY + hy * 0.5);
          ctx.closePath();
        });
      } else if (look.ears === 'round') {
        oval(look.pattern === 'saddle' ? accent : look.coat, ex, headY + hy * 0.15, hx * 0.36, hy * 0.4);
      } else if (look.ears === 'floppy') {
        oval(accent, ex + side * hx * 0.18, headY + hy * 0.4, hx * 0.5, hy * 0.38, side * 0.35);
      } else if (look.ears === 'long') {
        oval(look.coat, ex - side * hx * 0.25, headY + hy * 1.05, hx * 0.25, hy * 0.95, -side * 0.35);
        oval(inner, ex - side * hx * 0.25, headY + hy * 1.1, hx * 0.1, hy * 0.62, -side * 0.35, false);
      } else {
        const size = look.trunk ? 1.25 : 0.55;
        oval(look.trunk ? accent : look.coat, ex + side * hx * 0.25, headY + hy * 0.4, hx * size, hy * size * 0.85, side * 0.4);
      }
    }

    oval(look.coat, 0.5, headY, hx, hy);
    if (look.belly && look.ears !== 'big') {
      oval(look.belly, 0.5, headY - hy * 0.2, hx * 0.28, hy * 0.75, 0, false);
    }
    if (!look.trunk) {
      oval(look.muzzle ?? look.coat, 0.5, headY - hy * 0.72, hx * 0.52, hy * 0.5);
      dot('#17100c', 0.5, headY - hy * 1.05, 0.03 * head);
    }
    eyes(headY - hy * 0.1, hx * 0.52, '#0d0906', 0.026 * head);

    if (look.tusks) {
      for (const side of [-1, 1]) {
        stroke('#f1e9d2', w * 0.035, () => {
          move(0.5 + side * hx * 0.45, headY - hy * 0.45);
          curve(0.5 + side * hx * 0.95, headY - hy * 0.9, 0.5 + side * hx * 0.7, headY - hy * 1.4);
        });
      }
    }
    if (look.trunk) {
      stroke(look.coat, w * 0.11, () => {
        move(0.5, headY - hy * 0.6);
        curve(0.46, headY - hy * 1.5, 0.58, Math.max(0.04, headY - hy * 1.75));
      });
    }

    // Horns
    for (const side of [-1, 1]) {
      const x = (f: number) => 0.5 + side * f;
      const bone = look.horns === 'antlers' || look.horns === 'moose' ? '#d6bd8a' : '#e3d9bd';
      if (look.horns === 'curved' || look.horns === 'bull') {
        const out = look.horns === 'bull' ? 2 : 1.25;
        stroke(bone, w * 0.045, () => {
          move(x(hx * 0.6), headY + hy * 0.1);
          curve(x(hx * out), headY + hy * 0.1, x(hx * out * 0.9), headY - hy * 0.85);
        });
      } else if (look.horns === 'ram') {
        stroke('#a8906a', w * 0.075, () =>
          ctx.arc(x(hx * 1.05) * w, (headY + hy * 0.2) * h, hx * 0.65 * w, -Math.PI / 2, side > 0 ? 2.4 : 0.75 - TAU, side < 0)
        );
      } else if (look.horns === 'antlers') {
        stroke(bone, w * 0.032, () => {
          move(x(hx * 0.5), headY + hy * 0.2);
          curve(x(0.36), headY + hy * 0.1, x(0.4), headY - hy * 1.3);
          move(x(0.31), headY);
          to(x(0.47), headY + hy * 0.7);
          move(x(0.38), headY - hy * 0.55);
          to(x(0.24), headY - hy * 1.35);
        });
      } else if (look.horns === 'moose') {
        shape(bone, () => {
          move(x(hx * 0.7), headY + hy * 0.3);
          curve(x(0.3), headY + hy * 1.1, x(0.47), headY + hy * 0.7);
          to(x(0.4), headY + hy * 0.15);
          to(x(0.48), headY - hy * 0.45);
          to(x(0.38), headY - hy * 0.4);
          to(x(0.41), headY - hy * 1.15);
          curve(x(0.24), headY - hy * 0.4, x(hx * 0.7), headY - hy * 0.1);
          ctx.closePath();
        });
      }
    }
    if (look.horns === 'unicorn' || look.horns === 'rhino') {
      const base = headY - hy * (look.horns === 'rhino' ? 0.55 : 0.35);
      shape(look.horns === 'rhino' ? accent : '#f2d36b', () => {
        move(0.5 - hx * 0.22, base);
        to(0.5, Math.max(0.01, base - hy * 1.45));
        to(0.5 + hx * 0.22, base);
        ctx.closePath();
      });
    }
  } else if (body === 'bird') {
    const neck = look.neck ?? 0;
    const bat = look.wings === 'membrane';
    if (look.fan) {
      for (let i = -4; i <= 4; i++) {
        const a = i * 0.32;
        const fx = 0.5 + Math.sin(a) * 0.38;
        const fy = 0.56 + Math.cos(a) * 0.36;
        oval(accent, fx, fy, 0.09, 0.1, -a);
        dot(look.crest ?? look.coat, fx, fy + 0.02, 0.035);
      }
    }
    if (look.spread) {
      for (const side of [-1, 1]) {
        if (bat) membraneWing(side, 0.5, 0.48, 0.34);
        else featherWing(side, 0.48, 0.48, 0.28, accent);
      }
    }
    if (!look.fan && !bat) {
      shape(accent, () => {
        move(0.5 - 0.07, 0.68);
        to(0.5 - (look.spread ? 0.13 : 0.2), 0.95);
        curve(0.5, 0.99, 0.5 + (look.spread ? 0.13 : 0.2), 0.95);
        to(0.57, 0.68);
        ctx.closePath();
      });
    }
    const rx = look.spread ? 0.12 : 0.29;
    oval(look.coat, 0.5, 0.57, rx, bat ? 0.22 : 0.23);
    if (look.belly && !look.spread && neck === 0) oval(look.belly, 0.5, 0.52, rx * 0.5, 0.14, 0, false);
    if (!look.spread) {
      for (const side of [-1, 1]) oval(accent, 0.5 + side * rx * 0.72, 0.6, rx * 0.34, 0.18, -side * 0.15);
    }
    const headY = 0.29 - neck * 0.12;
    const hr = look.spread ? 0.09 : neck > 0 ? 0.14 : 0.2;
    if (neck > 0) stroke(look.coat, w * 0.13, () => { move(0.5, 0.45); curve(0.34, 0.31, 0.5, headY); });
    if (look.beak) {
      shape(look.beak, () => {
        move(0.5 - hr * 0.42, headY - 0.06);
        to(0.5, Math.max(0.015, headY - 0.19));
        to(0.5 + hr * 0.42, headY - 0.06);
        ctx.closePath();
      });
    }
    if (bat) {
      for (const side of [-1, 1]) {
        shape(look.coat, () => {
          move(0.5 + side * 0.02, headY);
          to(0.5 + side * 0.1, headY - 0.17);
          to(0.5 + side * 0.09, headY + 0.03);
          ctx.closePath();
        });
      }
    }
    oval(look.belly && (look.spread || neck === 0) ? look.belly : look.coat, 0.5, headY, hr, 0.115);
    if (look.crest) oval(look.crest, 0.5, headY + 0.03, hr * 0.25, 0.065);
    eyes(headY - 0.025, hr * 0.55, bat ? '#e8402c' : '#0d0906', 0.04);
  } else if (body === 'lizard') {
    const head = look.head ?? 1;
    const winged = look.wings === 'membrane';
    const rx = winged ? 0.12 : look.shell ? 0.33 : 0.2;
    if (winged) for (const side of [-1, 1]) membraneWing(side, 0.45, 0.49, 0.22);
    for (const side of [-1, 1]) {
      for (const [y, bend] of [[0.4, -0.08], [0.62, 0.08]]) {
        const footX = 0.5 + side * (rx + (winged ? 0.1 : 0.15));
        stroke(look.coat, Math.min(w * 0.09, h * 0.045), () => {
          move(0.5, y);
          curve(0.5 + side * (rx + 0.13), y - 0.01, footX, y + bend);
        });
        dot(look.coat, footX, y + bend, 0.045);
      }
    }
    if (!look.shell) {
      shape(look.coat, () => {
        move(0.5 - rx * 0.65, 0.62);
        curve(0.5 - rx * 0.4, 0.82, 0.66, 0.97);
        curve(0.5 + rx * 0.7, 0.8, 0.5 + rx * 0.65, 0.62);
        ctx.closePath();
      });
    } else {
      oval(look.coat, 0.5, 0.84, 0.06, 0.09);
    }
    oval(look.coat, 0.5, 0.5, rx, look.shell ? 0.28 : 0.21);
    if (look.shell) {
      oval(accent, 0.5, 0.52, rx * 0.88, 0.24);
      for (const [x, y] of [[0.5, 0.52], [0.38, 0.42], [0.62, 0.42], [0.38, 0.63], [0.62, 0.63], [0.5, 0.35], [0.5, 0.7]]) {
        oval(look.coat, x, y, 0.075, 0.06);
      }
    } else {
      markings(0.5, 0.5, rx, 0.21);
      if (winged) {
        for (let y = 0.34; y < 0.8; y += 0.07) {
          shape(accent, () => { move(0.47, y + 0.03); to(0.5, y - 0.02); to(0.53, y + 0.03); ctx.closePath(); });
        }
      }
    }
    const hx = (winged ? 0.09 : 0.15) * head;
    const headY = 0.18;
    if (!look.shell) stroke(look.coat, w * hx * 1.1, () => { move(0.5, 0.34); to(0.5, headY + 0.03); });
    if (look.horns) {
      for (const side of [-1, 1]) {
        stroke('#e8dcc0', w * 0.022, () => {
          move(0.5 + side * hx * 0.6, headY + 0.02);
          curve(0.5 + side * hx * 1.7, headY + 0.05, 0.5 + side * hx * 1.5, headY + 0.14);
        });
      }
    }
    shape(look.coat, () => {
      move(0.5 - hx, headY + 0.05);
      curve(0.5 - hx * 0.9, headY - 0.04, 0.5 - hx * 0.35, headY - 0.13);
      curve(0.5, headY - 0.17, 0.5 + hx * 0.35, headY - 0.13);
      curve(0.5 + hx * 0.9, headY - 0.04, 0.5 + hx, headY + 0.05);
      curve(0.5, headY + 0.12, 0.5 - hx, headY + 0.05);
    });
    eyes(headY, hx * 0.62, winged ? '#ffd23c' : '#0d0906', 0.022);
  } else if (body === 'frog') {
    for (const side of [-1, 1]) {
      oval(look.coat, 0.5 + side * 0.3, 0.7, 0.13, 0.22, side * 0.55);
      stroke(look.coat, w * 0.09, () => { move(0.5 + side * 0.36, 0.8); to(0.5 + side * 0.24, 0.93); });
      stroke(look.coat, w * 0.08, () => { move(0.5 + side * 0.18, 0.4); to(0.5 + side * 0.39, 0.26); });
    }
    oval(look.coat, 0.5, 0.55, 0.26, 0.28);
    oval(look.coat, 0.5, 0.3, 0.22, 0.16);
    for (const [x, y, r] of [[0.4, 0.48, 0.05], [0.6, 0.58, 0.065], [0.47, 0.68, 0.045], [0.58, 0.43, 0.03]]) {
      dot(accent, x, y, r);
    }
    for (const side of [-1, 1]) {
      oval(look.coat, 0.5 + side * 0.15, 0.22, 0.09, 0.08);
      dot('#0d0906', 0.5 + side * 0.15, 0.2, 0.045);
    }
  } else if (body === 'snake') {
    const head = look.head ?? 1;
    const path = () => {
      move(0.5, 0.2);
      ctx.bezierCurveTo(0.5 * w, 0.34 * h, 0.92 * w, 0.34 * h, 0.76 * w, 0.52 * h);
      ctx.bezierCurveTo(0.58 * w, 0.7 * h, 0.12 * w, 0.56 * h, 0.22 * w, 0.76 * h);
      ctx.bezierCurveTo(0.3 * w, 0.9 * h, 0.6 * w, 0.82 * h, 0.68 * w, 0.93 * h);
    };
    stroke(look.coat, w * 0.17, path);
    ctx.setLineDash([h * 0.04, h * 0.065]);
    stroke(accent, w * 0.13, path, false);
    if (look.belly) {
      ctx.lineDashOffset = -h * 0.045;
      stroke(look.belly, w * 0.13, path, false);
      ctx.lineDashOffset = 0;
    }
    ctx.setLineDash([]);
    stroke('#c81e2c', line, () => { move(0.5, 0.1); to(0.5, 0.05); to(0.45, 0.02); move(0.5, 0.05); to(0.55, 0.02); }, false);
    if (look.hood) {
      oval(look.coat, 0.5, 0.23, 0.27 * head, 0.1);
      for (const side of [-1, 1]) dot(accent, 0.5 + side * 0.14, 0.235, 0.045);
    }
    oval(look.coat, 0.5, 0.16, 0.14 * head, 0.075);
    eyes(0.14, 0.075 * head, '#0d0906', 0.03);
  } else if (body === 'spider') {
    for (const side of [-1, 1]) {
      for (const [from, knee, end] of [[0.37, 0.14, 0.06], [0.42, 0.3, 0.27], [0.47, 0.55, 0.68], [0.52, 0.7, 0.93]]) {
        stroke(look.coat, Math.min(w, h) * 0.055, () => {
          move(0.5, from);
          curve(0.5 + side * 0.44, knee - 0.04, 0.5 + side * 0.45, end);
        });
      }
      stroke(look.coat, w * 0.04, () => { move(0.5 + side * 0.06, 0.28); to(0.5 + side * 0.04, 0.18); });
    }
    oval(look.coat, 0.5, 0.66, 0.22, 0.22);
    shape(accent, () => { move(0.5, 0.55); to(0.57, 0.66); to(0.5, 0.78); to(0.43, 0.66); ctx.closePath(); }, false);
    oval(look.coat, 0.5, 0.39, 0.15, 0.12);
    eyes(0.31, 0.045, '#ff3b30', 0.028);
    eyes(0.34, 0.095, '#ff3b30', 0.018);
  } else if (body === 'scorpion') {
    for (const side of [-1, 1]) {
      for (const y of [0.42, 0.49, 0.56, 0.63]) {
        stroke(look.coat, w * 0.045, () => { move(0.5, y); curve(0.5 + side * 0.33, y - 0.03, 0.5 + side * 0.4, y + 0.1); });
      }
      stroke(look.coat, w * 0.085, () => { move(0.5 + side * 0.1, 0.38); curve(0.5 + side * 0.4, 0.34, 0.5 + side * 0.28, 0.2); });
      oval(look.coat, 0.5 + side * 0.27, 0.15, 0.12, 0.09, side * 0.3);
      stroke(OUTLINE, line, () => { move(0.5 + side * 0.24, 0.16); to(0.5 + side * 0.22, 0.06); }, false);
    }
    oval(look.coat, 0.5, 0.5, 0.19, 0.18);
    for (let i = 0; i < 5; i++) {
      oval(i % 2 ? accent : look.coat, 0.5 + i * i * 0.008, 0.69 + i * 0.055, 0.11 - i * 0.012, 0.04);
    }
    shape(accent, () => { move(0.6, 0.93); to(0.76, 0.86); to(0.67, 0.97); ctx.closePath(); });
    eyes(0.37, 0.05, '#0d0906', 0.025);
  } else if (body === 'fish') {
    shape(accent, () => { move(0.5, 0.72); to(0.2, 0.97); curve(0.5, 0.86, 0.8, 0.97); ctx.closePath(); });
    for (const side of [-1, 1]) {
      shape(accent, () => {
        move(0.5 + side * 0.18, 0.36);
        curve(0.5 + side * 0.46, 0.44, 0.5 + side * 0.46, 0.62);
        to(0.5 + side * 0.18, 0.52);
        ctx.closePath();
      });
    }
    shape(look.coat, () => {
      move(0.5, 0.04);
      ctx.bezierCurveTo(0.86 * w, 0.2 * h, 0.8 * w, 0.52 * h, 0.55 * w, 0.8 * h);
      to(0.45, 0.8);
      ctx.bezierCurveTo(0.2 * w, 0.52 * h, 0.14 * w, 0.2 * h, 0.5 * w, 0.04 * h);
    });
    markings(0.5, 0.4, 0.23, 0.3);
    stroke(accent, w * 0.07, () => { move(0.5, 0.34); to(0.5, 0.62); }, false);
    eyes(0.2, 0.15);
  } else {
    // octopus
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.4;
      const bend = i % 2 ? 0.55 : -0.55;
      const tip: [number, number] = [0.5 + Math.cos(a) * 0.45, 0.52 + Math.sin(a) * 0.45];
      const knee: [number, number] = [0.5 + Math.cos(a + bend) * 0.36, 0.52 + Math.sin(a + bend) * 0.36];
      const path = () => { move(0.5, 0.52); curve(knee[0], knee[1], tip[0], tip[1]); };
      stroke(look.coat, Math.min(w, h) * 0.09, path);
      ctx.setLineDash([2, h * 0.05]);
      stroke(accent, Math.min(w, h) * 0.035, path, false);
      ctx.setLineDash([]);
    }
    oval(look.coat, 0.5, 0.44, 0.2, 0.24);
    for (const side of [-1, 1]) {
      dot('#f6e9a8', 0.5 + side * 0.09, 0.52, 0.05);
      dot('#0d0906', 0.5 + side * 0.09, 0.52, 0.024);
    }
  }
  return true;
}
