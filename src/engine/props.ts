import { drawAnimal, EXTRA_ANIMALS } from './animals';
import { finishSprite } from './finish';
import { HOME } from './objects/home';
import { INDOOR } from './objects/indoor';
import { createKit, type Painter } from './objects/kit';
import { OUTDOOR } from './objects/outdoor';
import type { CustomAsset, PropCategory, PropDefinition } from '../types/map';

// One hand-drawn painter per built-in object.
export const OBJECTS: Record<string, Painter> = { ...HOME, ...INDOOR, ...OUTDOOR };

export const PROP_CATEGORIES: { id: PropCategory; label: string }[] = [
  { id: 'furniture', label: 'Casas y Mobiliario' },
  { id: 'bathroom', label: 'Baño y Aseo' },
  { id: 'village', label: 'Pueblo y Aldea' },
  { id: 'fences', label: 'Vallas y Cercados' },
  { id: 'animals', label: 'Animales y Criaturas' },
  { id: 'tavern', label: 'Tabernas y Cocinas' },
  { id: 'shop', label: 'Tiendas y Comercio' },
  { id: 'dungeon', label: 'Mazmorras y Trampas' },
  { id: 'temple', label: 'Templos y Criptas' },
  { id: 'magic', label: 'Magia y Alquimia' },
  { id: 'storage', label: 'Almacén y Forja' },
  { id: 'camp', label: 'Campamentos y Viaje' },
  { id: 'nature', label: 'Naturaleza y Bosques' },
  { id: 'rugs', label: 'Alfombras y Tapices' },
  { id: 'lighting', label: 'Iluminación y Fuego' },
  { id: 'custom', label: 'Propios (Importados)' },
];

export const BUILTIN_PROPS: PropDefinition[] = [
  // Furniture
  { id: 'bed_teal', name: 'Cama Turquesa', category: 'furniture', widthTiles: 1.2, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cama', 'bed', 'dormitorio'] },
  { id: 'bed_crimson', name: 'Cama Carmesí', category: 'furniture', widthTiles: 1.2, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cama', 'bed', 'posada'] },
  { id: 'bed_double', name: 'Cama Doble', category: 'furniture', widthTiles: 2.0, heightTiles: 2.2, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cama', 'matrimonio'] },
  { id: 'cot_straw', name: 'Camastro Paja', category: 'furniture', widthTiles: 1.1, heightTiles: 1.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cama', 'paja', 'celda'] },
  { id: 'table_round', name: 'Mesa Redonda', category: 'furniture', widthTiles: 1.8, heightTiles: 1.8, defaultLayer: 'above_floor', defaultShadow: true, tags: ['mesa', 'table', 'taberna'] },
  { id: 'table_round_teal', name: 'Mesa Mantel Azul', category: 'furniture', widthTiles: 2.0, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['mesa', 'comedor', 'mantel'] },
  { id: 'table_banquet', name: 'Mesa Banquete', category: 'furniture', widthTiles: 3.0, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['mesa', 'banquete'] },
  { id: 'pew', name: 'Banco Iglesia', category: 'furniture', widthTiles: 2.6, heightTiles: 0.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['banco', 'pew', 'templo'] },
  { id: 'bench_stone', name: 'Banco Piedra', category: 'furniture', widthTiles: 2.2, heightTiles: 0.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['banco', 'piedra', 'jardin'] },
  { id: 'chair', name: 'Silla Madera', category: 'furniture', widthTiles: 0.7, heightTiles: 0.7, defaultLayer: 'above_floor', defaultShadow: true, tags: ['silla', 'chair'] },
  { id: 'stool_wood', name: 'Taburete', category: 'furniture', widthTiles: 0.6, heightTiles: 0.6, defaultLayer: 'above_floor', defaultShadow: true, tags: ['taburete', 'silla', 'bar'] },
  { id: 'throne_gold', name: 'Trono Real', category: 'furniture', widthTiles: 1.3, heightTiles: 1.2, defaultLayer: 'above_floor', defaultShadow: true, tags: ['trono', 'rey', 'palacio'] },
  { id: 'desk', name: 'Escritorio', category: 'furniture', widthTiles: 1.8, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['escritorio', 'estudio'] },
  { id: 'lectern_book', name: 'Atril con Tomo', category: 'furniture', widthTiles: 0.9, heightTiles: 0.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['atril', 'libro', 'iglesia'] },
  { id: 'bookshelf', name: 'Estantería', category: 'furniture', widthTiles: 2.0, heightTiles: 0.65, defaultLayer: 'above_floor', defaultShadow: true, tags: ['libros', 'biblioteca'] },
  { id: 'wardrobe', name: 'Armario Ropero', category: 'furniture', widthTiles: 1.5, heightTiles: 0.8, defaultLayer: 'above_floor', defaultShadow: true, tags: ['armario', 'ropa', 'mueble'] },
  { id: 'sofa_teal', name: 'Diván Turquesa', category: 'furniture', widthTiles: 1.7, heightTiles: 0.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['sofa', 'sillon'] },
  { id: 'sofa_crimson', name: 'Diván Carmesí', category: 'furniture', widthTiles: 1.7, heightTiles: 0.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['sofa', 'sillon', 'rojo'] },
  { id: 'piano_harpsichord', name: 'Clavecín Piano', category: 'furniture', widthTiles: 1.6, heightTiles: 2.1, defaultLayer: 'above_floor', defaultShadow: true, tags: ['piano', 'musica', 'instrumento'] },
  { id: 'mirror_standing', name: 'Espejo de Pie', category: 'furniture', widthTiles: 1.0, heightTiles: 0.55, defaultLayer: 'above_floor', defaultShadow: true, tags: ['espejo', 'cristal'] },
  { id: 'fireplace', name: 'Chimenea', category: 'furniture', widthTiles: 1.8, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['fuego', 'hogar'] },

  // Bathroom & Washroom
  { id: 'bathtub_wood', name: 'Tina de Madera', category: 'bathroom', widthTiles: 1.15, heightTiles: 1.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'tina', 'agua', 'madera'] },
  { id: 'bathtub_copper', name: 'Bañera de Cobre', category: 'bathroom', widthTiles: 1.15, heightTiles: 1.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'banera', 'cobre', 'agua'] },
  { id: 'bathtub_marble', name: 'Bañera de Mármol', category: 'bathroom', widthTiles: 1.4, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'banera', 'marmol', 'lujo', 'termas'] },
  { id: 'privy_wood', name: 'Letrina Madera', category: 'bathroom', widthTiles: 0.95, heightTiles: 0.95, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'letrina', 'wc', 'retrete'] },
  { id: 'toilet_porcelain', name: 'Retrete Cerámica', category: 'bathroom', widthTiles: 0.85, heightTiles: 1.05, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'retrete', 'inodoro', 'wc'] },
  { id: 'washbasin_stand', name: 'Lavabo con Jarra', category: 'bathroom', widthTiles: 1.1, heightTiles: 0.8, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'lavabo', 'palangana', 'jarra'] },
  { id: 'sink_stone', name: 'Lavamanos Piedra', category: 'bathroom', widthTiles: 1.15, heightTiles: 0.8, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'lavabo', 'pila', 'grifo'] },
  { id: 'vanity_mirror', name: 'Tocador Espejo', category: 'bathroom', widthTiles: 1.4, heightTiles: 0.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'tocador', 'espejo', 'perfume'] },
  { id: 'folding_screen', name: 'Biombo Privacidad', category: 'bathroom', widthTiles: 1.8, heightTiles: 0.55, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'biombo', 'vestidor'] },
  { id: 'towel_rack', name: 'Toallero', category: 'bathroom', widthTiles: 1.1, heightTiles: 0.55, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'toallas', 'ropa'] },
  { id: 'laundry_tub', name: 'Barreño Colada', category: 'bathroom', widthTiles: 1.15, heightTiles: 1.15, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'colada', 'lavar', 'agua'] },
  { id: 'chamber_pot', name: 'Orinal y Cubo', category: 'bathroom', widthTiles: 0.85, heightTiles: 0.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'orinal', 'cubo', 'jabon'] },
  { id: 'sauna_brazier', name: 'Estufa de Sauna', category: 'bathroom', widthTiles: 1.2, heightTiles: 1.2, defaultLayer: 'above_floor', defaultShadow: true, tags: ['bano', 'sauna', 'vapor', 'termas'] },

  // Village & Farm
  { id: 'village_well_roofed', name: 'Pozo con Tejadillo', category: 'village', widthTiles: 1.8, heightTiles: 1.8, defaultLayer: 'above_walls', defaultShadow: true, tags: ['pueblo', 'pozo', 'agua', 'plaza'] },
  { id: 'notice_board', name: 'Tablón Misiones', category: 'village', widthTiles: 1.5, heightTiles: 0.55, defaultLayer: 'above_walls', defaultShadow: true, tags: ['pueblo', 'tablon', 'anuncios', 'misiones'] },
  { id: 'street_lamppost', name: 'Farola de Calle', category: 'village', widthTiles: 0.9, heightTiles: 0.9, defaultLayer: 'above_walls', defaultShadow: true, tags: ['pueblo', 'farola', 'luz', 'calle'] },
  { id: 'water_trough', name: 'Abrevadero', category: 'village', widthTiles: 2.0, heightTiles: 0.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'abrevadero', 'agua', 'caballos'] },
  { id: 'hay_bale_round', name: 'Bala de Heno', category: 'village', widthTiles: 1.15, heightTiles: 1.15, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'heno', 'paja', 'granja'] },
  { id: 'hay_pile', name: 'Montón de Paja', category: 'village', widthTiles: 1.8, heightTiles: 1.6, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'paja', 'horca', 'granja'] },
  { id: 'wheelbarrow', name: 'Carretilla', category: 'village', widthTiles: 1.0, heightTiles: 1.55, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'carretilla', 'granja'] },
  { id: 'woodpile_logs', name: 'Leña Apilada', category: 'village', widthTiles: 1.6, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'lena', 'troncos', 'madera'] },
  { id: 'chopping_block', name: 'Tocón con Hacha', category: 'village', widthTiles: 1.0, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'tocon', 'hacha', 'lena'] },
  { id: 'vegetable_patch', name: 'Huerto Verduras', category: 'village', widthTiles: 2.2, heightTiles: 1.8, defaultLayer: 'above_floor', defaultShadow: false, tags: ['pueblo', 'huerto', 'cultivo', 'calabazas'] },
  { id: 'scarecrow', name: 'Espantapájaros', category: 'village', widthTiles: 1.25, heightTiles: 1.25, defaultLayer: 'above_walls', defaultShadow: true, tags: ['pueblo', 'espantapajaros', 'campo', 'granja'] },
  { id: 'clothesline', name: 'Tendedero Ropa', category: 'village', widthTiles: 2.4, heightTiles: 0.65, defaultLayer: 'above_walls', defaultShadow: true, tags: ['pueblo', 'tendedero', 'ropa'] },
  { id: 'chicken_coop', name: 'Gallinero', category: 'village', widthTiles: 1.6, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'gallinero', 'granja'] },
  { id: 'doghouse', name: 'Caseta Perro', category: 'village', widthTiles: 1.0, heightTiles: 1.15, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'caseta', 'perro'] },
  { id: 'beehive_skep', name: 'Colmena Abejas', category: 'village', widthTiles: 0.95, heightTiles: 0.95, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'colmena', 'miel', 'granja'] },
  { id: 'pillory_stocks', name: 'Cepo de Plaza', category: 'village', widthTiles: 1.4, heightTiles: 0.7, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'cepo', 'plaza', 'castigo'] },
  { id: 'fruit_crates', name: 'Cajas de Fruta', category: 'village', widthTiles: 1.4, heightTiles: 1.1, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pueblo', 'fruta', 'manzanas', 'mercado'] },

  // Fences & Enclosures
  { id: 'fence_wood_straight', name: 'Valla Madera (2m)', category: 'fences', widthTiles: 2.0, heightTiles: 0.42, defaultLayer: 'above_floor', defaultShadow: true, tags: ['valla', 'cerca', 'madera', 'pueblo'] },
  { id: 'fence_wood_short', name: 'Valla Madera (1m)', category: 'fences', widthTiles: 1.0, heightTiles: 0.42, defaultLayer: 'above_floor', defaultShadow: true, tags: ['valla', 'cerca', 'madera'] },
  { id: 'fence_wood_corner', name: 'Valla Esquina', category: 'fences', widthTiles: 1.1, heightTiles: 1.1, defaultLayer: 'above_floor', defaultShadow: true, tags: ['valla', 'esquina', 'cerca'] },
  { id: 'fence_gate_wood', name: 'Portón de Valla', category: 'fences', widthTiles: 1.6, heightTiles: 0.55, defaultLayer: 'above_floor', defaultShadow: true, tags: ['valla', 'puerta', 'porton', 'corral'] },
  { id: 'fence_picket_white', name: 'Valla Estacas', category: 'fences', widthTiles: 2.0, heightTiles: 0.42, defaultLayer: 'above_floor', defaultShadow: true, tags: ['valla', 'estacas', 'jardin', 'pueblo'] },
  { id: 'fence_iron_straight', name: 'Verja Hierro', category: 'fences', widthTiles: 2.0, heightTiles: 0.42, defaultLayer: 'above_floor', defaultShadow: true, tags: ['valla', 'verja', 'hierro', 'cementerio'] },
  { id: 'fence_iron_gate', name: 'Cancela Hierro', category: 'fences', widthTiles: 1.8, heightTiles: 0.55, defaultLayer: 'above_floor', defaultShadow: true, tags: ['valla', 'verja', 'puerta', 'cancela'] },
  { id: 'fence_palisade_logs', name: 'Empalizada Troncos', category: 'fences', widthTiles: 2.0, heightTiles: 0.5, defaultLayer: 'above_walls', defaultShadow: true, tags: ['valla', 'empalizada', 'troncos', 'fuerte'] },
  { id: 'fence_rope_posts', name: 'Postes con Cuerda', category: 'fences', widthTiles: 2.0, heightTiles: 0.42, defaultLayer: 'above_floor', defaultShadow: true, tags: ['valla', 'cuerda', 'muelle', 'postes'] },
  { id: 'hitching_post', name: 'Atadero Caballos', category: 'fences', widthTiles: 1.6, heightTiles: 0.5, defaultLayer: 'above_floor', defaultShadow: true, tags: ['valla', 'caballos', 'atadero', 'posada'] },

  // Animals & Creatures
  { id: 'horse_brown', name: 'Caballo Castaño', category: 'animals', widthTiles: 1.1, heightTiles: 2.1, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'caballo', 'montura', 'establo'] },
  { id: 'horse_white', name: 'Caballo Blanco', category: 'animals', widthTiles: 1.1, heightTiles: 2.1, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'caballo', 'blanco', 'montura'] },
  { id: 'draft_mule', name: 'Mula de Carga', category: 'animals', widthTiles: 1.2, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'mula', 'burro', 'carga'] },
  { id: 'cow_spotted', name: 'Vaca Lechera', category: 'animals', widthTiles: 1.2, heightTiles: 1.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'vaca', 'ganado', 'granja'] },
  { id: 'pig_pink', name: 'Cerdo', category: 'animals', widthTiles: 0.9, heightTiles: 1.35, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'cerdo', 'puerco', 'granja'] },
  { id: 'sheep_woolly', name: 'Oveja', category: 'animals', widthTiles: 0.95, heightTiles: 1.35, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'oveja', 'rebano', 'granja'] },
  { id: 'goat_horned', name: 'Cabra', category: 'animals', widthTiles: 0.85, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'cabra', 'monte', 'granja'] },
  { id: 'chickens_flock', name: 'Gallinas', category: 'animals', widthTiles: 1.1, heightTiles: 1.1, defaultLayer: 'above_floor', defaultShadow: false, tags: ['animal', 'gallina', 'pollo', 'gallo'] },
  { id: 'dog_hound', name: 'Perro Sabueso', category: 'animals', widthTiles: 0.75, heightTiles: 1.15, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'perro', 'mascota', 'pueblo'] },
  { id: 'cat_tabby', name: 'Gato Atigrado', category: 'animals', widthTiles: 0.65, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'gato', 'felino', 'mascota'] },
  { id: 'wolf_grey', name: 'Lobo Gris', category: 'animals', widthTiles: 0.85, heightTiles: 1.45, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'lobo', 'bosque', 'bestia'] },
  { id: 'bear_brown', name: 'Oso Pardo', category: 'animals', widthTiles: 1.35, heightTiles: 1.8, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'oso', 'bosque', 'bestia'] },
  { id: 'deer_stag', name: 'Ciervo Astado', category: 'animals', widthTiles: 1.15, heightTiles: 1.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'ciervo', 'venado', 'bosque'] },
  { id: 'boar_wild', name: 'Jabalí', category: 'animals', widthTiles: 0.95, heightTiles: 1.4, defaultLayer: 'above_floor', defaultShadow: true, tags: ['animal', 'jabali', 'bosque', 'caza'] },

  ...EXTRA_ANIMALS,

  // Tavern & Kitchen
  { id: 'bar_counter', name: 'Barra Taberna', category: 'tavern', widthTiles: 3.2, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['barra', 'taberna', 'mostrador'] },
  { id: 'keg_giant', name: 'Tonel Cerveza', category: 'tavern', widthTiles: 1.3, heightTiles: 1.7, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tonel', 'barril', 'cerveza'] },
  { id: 'table_feast', name: 'Mesa Festín', category: 'tavern', widthTiles: 3.2, heightTiles: 1.4, defaultLayer: 'above_floor', defaultShadow: true, tags: ['banquete', 'comida', 'mesa'] },
  { id: 'kitchen_stove', name: 'Fogón Cocina', category: 'tavern', widthTiles: 1.8, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cocina', 'fogon', 'horno'] },
  { id: 'roast_spit', name: 'Asador Carne', category: 'tavern', widthTiles: 1.8, heightTiles: 1.1, defaultLayer: 'above_floor', defaultShadow: true, tags: ['asador', 'fuego', 'comida'] },
  { id: 'cauldron_soup', name: 'Olla Guiso', category: 'tavern', widthTiles: 1.1, heightTiles: 1.1, defaultLayer: 'above_floor', defaultShadow: true, tags: ['caldero', 'sopa', 'cocina'] },
  { id: 'wine_rack', name: 'Botellero Vino', category: 'tavern', widthTiles: 1.8, heightTiles: 0.65, defaultLayer: 'above_floor', defaultShadow: true, tags: ['vino', 'bodega', 'botellas'] },

  // Shops & Market
  { id: 'market_stall_red', name: 'Puesto Mercado Rojo', category: 'shop', widthTiles: 2.6, heightTiles: 1.4, defaultLayer: 'above_walls', defaultShadow: true, tags: ['tienda', 'mercado', 'puesto', 'rojo'] },
  { id: 'market_stall_blue', name: 'Puesto Mercado Azul', category: 'shop', widthTiles: 2.6, heightTiles: 1.4, defaultLayer: 'above_walls', defaultShadow: true, tags: ['tienda', 'mercado', 'puesto', 'azul'] },
  { id: 'shop_counter', name: 'Mostrador Tienda', category: 'shop', widthTiles: 2.8, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tienda', 'mostrador', 'comercio'] },
  { id: 'display_case', name: 'Vitrina Joyas', category: 'shop', widthTiles: 1.8, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tienda', 'vitrina', 'joyeria'] },
  { id: 'cloth_bolts', name: 'Rollos de Tela', category: 'shop', widthTiles: 1.4, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tienda', 'sastre', 'telas'] },
  { id: 'potion_shelf', name: 'Estante Pociones', category: 'shop', widthTiles: 1.9, heightTiles: 0.7, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tienda', 'pociones', 'botica'] },

  // Rugs
  { id: 'rug_teal', name: 'Alfombra Turquesa', category: 'rugs', widthTiles: 3.2, heightTiles: 2.1, defaultLayer: 'above_floor', defaultShadow: false, tags: ['alfombra', 'rug', 'templo'] },
  { id: 'rug_crimson', name: 'Alfombra Carmesí', category: 'rugs', widthTiles: 3.0, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: false, tags: ['alfombra', 'rug', 'persa'] },
  { id: 'rug_emerald', name: 'Alfombra Esmeralda', category: 'rugs', widthTiles: 3.0, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: false, tags: ['alfombra', 'verde'] },
  { id: 'rug_purple_royal', name: 'Tapiz Púrpura', category: 'rugs', widthTiles: 3.2, heightTiles: 2.2, defaultLayer: 'above_floor', defaultShadow: false, tags: ['alfombra', 'purpura', 'real'] },
  { id: 'rug_round', name: 'Alfombra Ovalada', category: 'rugs', widthTiles: 2.4, heightTiles: 1.8, defaultLayer: 'above_floor', defaultShadow: false, tags: ['alfombra', 'oval'] },
  { id: 'rug_runner', name: 'Pasillo Templo', category: 'rugs', widthTiles: 1.4, heightTiles: 3.6, defaultLayer: 'above_floor', defaultShadow: false, tags: ['pasillo', 'runner'] },
  { id: 'rug_bear', name: 'Piel de Oso', category: 'rugs', widthTiles: 2.3, heightTiles: 2.5, defaultLayer: 'above_floor', defaultShadow: false, tags: ['piel', 'oso', 'caza'] },
  { id: 'mat_straw', name: 'Estera Trenzada', category: 'rugs', widthTiles: 2.0, heightTiles: 1.4, defaultLayer: 'above_floor', defaultShadow: false, tags: ['estera', 'paja'] },

  // Temple & Crypt
  { id: 'altar_gold', name: 'Altar Dorado', category: 'temple', widthTiles: 2.4, heightTiles: 2.4, defaultLayer: 'above_floor', defaultShadow: true, tags: ['altar', 'estatua', 'templo'] },
  { id: 'sarcophagus_stone', name: 'Sarcófago Piedra', category: 'temple', widthTiles: 1.3, heightTiles: 2.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tumba', 'cripta', 'sarcofago'] },
  { id: 'sarcophagus_gold', name: 'Sarcófago Real', category: 'temple', widthTiles: 1.35, heightTiles: 2.35, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tumba', 'faraon', 'oro'] },
  { id: 'statue_knight', name: 'Estatua Guerrero', category: 'temple', widthTiles: 1.3, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['estatua', 'caballero'] },
  { id: 'statue_angel', name: 'Estatua Alada', category: 'temple', widthTiles: 1.6, heightTiles: 1.4, defaultLayer: 'above_floor', defaultShadow: true, tags: ['estatua', 'angel'] },
  { id: 'pillar_marble', name: 'Columna Mármol', category: 'temple', widthTiles: 1.1, heightTiles: 1.1, defaultLayer: 'above_floor', defaultShadow: true, tags: ['columna', 'pilar'] },
  { id: 'pillar_ruined', name: 'Columna Rota', category: 'temple', widthTiles: 1.2, heightTiles: 1.2, defaultLayer: 'above_floor', defaultShadow: true, tags: ['columna', 'ruina'] },
  { id: 'obelisk_runic', name: 'Obelisco Rúnico', category: 'temple', widthTiles: 1.3, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['obelisco', 'runa'] },
  { id: 'well', name: 'Pozo de Piedra', category: 'temple', widthTiles: 1.6, heightTiles: 1.6, defaultLayer: 'above_floor', defaultShadow: true, tags: ['pozo', 'patio', 'agua'] },
  { id: 'pool_teal', name: 'Pila Sagrada', category: 'temple', widthTiles: 2.4, heightTiles: 3.0, defaultLayer: 'above_floor', defaultShadow: false, tags: ['agua', 'piscina', 'templo'] },
  { id: 'fountain', name: 'Fuente Piedra', category: 'temple', widthTiles: 2.2, heightTiles: 2.2, defaultLayer: 'above_floor', defaultShadow: true, tags: ['fuente', 'plaza'] },

  // Dungeon & Traps
  { id: 'iron_cage', name: 'Jaula Hierro', category: 'dungeon', widthTiles: 1.5, heightTiles: 1.5, defaultLayer: 'above_floor', defaultShadow: true, tags: ['jaula', 'prision', 'celda'] },
  { id: 'skeleton_remains', name: 'Esqueleto Caído', category: 'dungeon', widthTiles: 1.2, heightTiles: 1.5, defaultLayer: 'above_floor', defaultShadow: false, tags: ['huesos', 'esqueleto', 'cadaver'] },
  { id: 'spike_trap', name: 'Trampa Pinchos', category: 'dungeon', widthTiles: 1.8, heightTiles: 1.8, defaultLayer: 'above_floor', defaultShadow: false, tags: ['trampa', 'pinchos'] },
  { id: 'pit_dark', name: 'Foso Abismal', category: 'dungeon', widthTiles: 2.0, heightTiles: 2.0, defaultLayer: 'above_floor', defaultShadow: false, tags: ['foso', 'agujero', 'trampa'] },
  { id: 'guillotine_rack', name: 'Potro Tortura', category: 'dungeon', widthTiles: 1.3, heightTiles: 2.2, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tortura', 'mazmorra'] },
  { id: 'chains_shackles', name: 'Cadenas Suelo', category: 'dungeon', widthTiles: 1.2, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: false, tags: ['cadenas', 'grilletes'] },
  { id: 'blood_pool', name: 'Charco Sangre', category: 'dungeon', widthTiles: 1.4, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: false, tags: ['sangre', 'combate'] },
  { id: 'rubble_pile', name: 'Escombros', category: 'dungeon', widthTiles: 1.7, heightTiles: 1.5, defaultLayer: 'above_floor', defaultShadow: true, tags: ['escombros', 'piedras', 'ruina'] },
  { id: 'spider_web', name: 'Telaraña Gigante', category: 'dungeon', widthTiles: 2.2, heightTiles: 2.2, defaultLayer: 'above_walls', defaultShadow: false, tags: ['telarana', 'arana'] },

  // Magic & Alchemy
  { id: 'magic_circle', name: 'Círculo Arcano', category: 'magic', widthTiles: 2.8, heightTiles: 2.8, defaultLayer: 'above_floor', defaultShadow: false, tags: ['magia', 'runas', 'ritual'] },
  { id: 'portal_gate', name: 'Portal Dimensional', category: 'magic', widthTiles: 2.2, heightTiles: 2.2, defaultLayer: 'above_floor', defaultShadow: true, tags: ['portal', 'teletransporte'] },
  { id: 'alchemy_table', name: 'Mesa Alquimia', category: 'magic', widthTiles: 2.1, heightTiles: 1.1, defaultLayer: 'above_floor', defaultShadow: true, tags: ['alquimia', 'pociones', 'laboratorio'] },
  { id: 'cauldron_witch', name: 'Caldero Bruja', category: 'magic', widthTiles: 1.3, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['caldero', 'pocion', 'verde'] },
  { id: 'crystal_cluster', name: 'Cristal Maná Azul', category: 'magic', widthTiles: 1.3, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cristal', 'gema', 'azul'] },
  { id: 'crystal_magenta', name: 'Cristal Amatista', category: 'magic', widthTiles: 1.3, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cristal', 'amatista', 'morado'] },
  { id: 'orrery_brass', name: 'Planetario Astral', category: 'magic', widthTiles: 1.8, heightTiles: 1.8, defaultLayer: 'above_floor', defaultShadow: true, tags: ['planetario', 'astros'] },
  { id: 'books_pile', name: 'Pila Grimorios', category: 'magic', widthTiles: 1.0, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['libros', 'magia'] },

  // Storage & Forge
  { id: 'barrel', name: 'Barril Roble', category: 'storage', widthTiles: 0.85, heightTiles: 0.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['barril', 'taberna'] },
  { id: 'crate', name: 'Caja Madera', category: 'storage', widthTiles: 1.0, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['caja', 'almacen'] },
  { id: 'crates_stack', name: 'Pila de Cajas', category: 'storage', widthTiles: 1.6, heightTiles: 1.5, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cajas', 'almacen'] },
  { id: 'sack', name: 'Saco Grano', category: 'storage', widthTiles: 0.85, heightTiles: 0.7, defaultLayer: 'above_floor', defaultShadow: true, tags: ['saco', 'comida'] },
  { id: 'pottery_jars', name: 'Ánforas Barro', category: 'storage', widthTiles: 1.2, heightTiles: 1.0, defaultLayer: 'above_floor', defaultShadow: true, tags: ['anforas', 'vasijas'] },
  { id: 'cart', name: 'Carro Suministros', category: 'storage', widthTiles: 1.5, heightTiles: 2.4, defaultLayer: 'above_floor', defaultShadow: true, tags: ['carro', 'carreta'] },
  { id: 'chest', name: 'Cofre Cerrado', category: 'storage', widthTiles: 1.1, heightTiles: 0.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cofre', 'tesoro'] },
  { id: 'chest_open_gold', name: 'Cofre con Oro', category: 'storage', widthTiles: 1.15, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['cofre', 'oro', 'tesoro'] },
  { id: 'treasure_pile', name: 'Montón de Oro', category: 'storage', widthTiles: 1.8, heightTiles: 1.6, defaultLayer: 'above_floor', defaultShadow: false, tags: ['oro', 'monedas', 'tesoro'] },
  { id: 'weapon_rack', name: 'Armero Espadas', category: 'storage', widthTiles: 1.8, heightTiles: 0.7, defaultLayer: 'above_floor', defaultShadow: true, tags: ['armas', 'espadas', 'armeria'] },
  { id: 'armor_stand', name: 'Maniquí Armadura', category: 'storage', widthTiles: 0.9, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['armadura', 'caballero'] },
  { id: 'anvil', name: 'Yunque Herrero', category: 'storage', widthTiles: 1.1, heightTiles: 0.75, defaultLayer: 'above_floor', defaultShadow: true, tags: ['herrero', 'forja'] },
  { id: 'forge_furnace', name: 'Fragua Encendida', category: 'storage', widthTiles: 1.8, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['fragua', 'horno', 'herrero'] },
  { id: 'minecart', name: 'Vagoneta Mina', category: 'storage', widthTiles: 1.1, heightTiles: 1.4, defaultLayer: 'above_floor', defaultShadow: true, tags: ['vagoneta', 'mina', 'carbon'] },

  // Camp & Exterior
  { id: 'tent_red', name: 'Tienda Roja', category: 'camp', widthTiles: 2.2, heightTiles: 2.6, defaultLayer: 'above_walls', defaultShadow: true, tags: ['tienda', 'campamento'] },
  { id: 'tent_blue', name: 'Tienda Azul', category: 'camp', widthTiles: 2.2, heightTiles: 2.6, defaultLayer: 'above_walls', defaultShadow: true, tags: ['tienda', 'campamento'] },
  { id: 'tent_pavilion', name: 'Pabellón Real', category: 'camp', widthTiles: 2.8, heightTiles: 2.8, defaultLayer: 'above_walls', defaultShadow: true, tags: ['carpa', 'pabellon', 'tienda'] },
  { id: 'campfire', name: 'Hoguera Leña', category: 'camp', widthTiles: 1.3, heightTiles: 1.3, defaultLayer: 'above_floor', defaultShadow: true, tags: ['hoguera', 'fuego', 'campamento'] },
  { id: 'bedroll', name: 'Saco Dormir', category: 'camp', widthTiles: 0.9, heightTiles: 1.7, defaultLayer: 'above_floor', defaultShadow: true, tags: ['saco', 'dormir', 'campamento'] },
  { id: 'wagon_covered', name: 'Carromato Lona', category: 'camp', widthTiles: 2.0, heightTiles: 3.4, defaultLayer: 'above_walls', defaultShadow: true, tags: ['carromato', 'caravana'] },
  { id: 'canoe_boat', name: 'Bote de Remo', category: 'camp', widthTiles: 1.3, heightTiles: 2.8, defaultLayer: 'above_floor', defaultShadow: true, tags: ['barca', 'bote', 'rio'] },
  { id: 'signpost', name: 'Poste Indicador', category: 'camp', widthTiles: 0.9, heightTiles: 0.9, defaultLayer: 'above_walls', defaultShadow: true, tags: ['cartel', 'camino'] },

  // Nature
  { id: 'tree_oak', name: 'Árbol Frondoso', category: 'nature', widthTiles: 2.6, heightTiles: 2.6, defaultLayer: 'above_walls', defaultShadow: true, tags: ['arbol', 'bosque', 'tree'] },
  { id: 'tree_pine', name: 'Pino Conífera', category: 'nature', widthTiles: 2.3, heightTiles: 2.3, defaultLayer: 'above_walls', defaultShadow: true, tags: ['pino', 'bosque'] },
  { id: 'tree_autumn', name: 'Árbol Otoñal', category: 'nature', widthTiles: 2.6, heightTiles: 2.6, defaultLayer: 'above_walls', defaultShadow: true, tags: ['arbol', 'otono', 'naranja'] },
  { id: 'tree_cherry', name: 'Cerezo en Flor', category: 'nature', widthTiles: 2.6, heightTiles: 2.6, defaultLayer: 'above_walls', defaultShadow: true, tags: ['arbol', 'cerezo', 'rosa'] },
  { id: 'tree_dead', name: 'Árbol Seco', category: 'nature', widthTiles: 2.4, heightTiles: 2.4, defaultLayer: 'above_walls', defaultShadow: true, tags: ['arbol', 'muerto', 'ramas'] },
  { id: 'tree_palm', name: 'Palmera', category: 'nature', widthTiles: 2.4, heightTiles: 2.4, defaultLayer: 'above_walls', defaultShadow: true, tags: ['palmera', 'playa', 'desierto'] },
  { id: 'bush', name: 'Arbusto', category: 'nature', widthTiles: 1.25, heightTiles: 1.25, defaultLayer: 'above_floor', defaultShadow: true, tags: ['arbusto', 'planta'] },
  { id: 'flower_bed', name: 'Flores Silvestres', category: 'nature', widthTiles: 1.4, heightTiles: 1.4, defaultLayer: 'above_floor', defaultShadow: false, tags: ['flores', 'jardin'] },
  { id: 'mushroom_giant', name: 'Seta Gigante', category: 'nature', widthTiles: 1.4, heightTiles: 1.4, defaultLayer: 'above_walls', defaultShadow: true, tags: ['seta', 'hongo', 'cueva'] },
  { id: 'lily_pads', name: 'Nenúfares', category: 'nature', widthTiles: 1.5, heightTiles: 1.5, defaultLayer: 'above_floor', defaultShadow: false, tags: ['nenufar', 'agua', 'estanque'] },
  { id: 'fallen_log', name: 'Tronco Caído', category: 'nature', widthTiles: 2.4, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tronco', 'madera', 'bosque'] },
  { id: 'cactus', name: 'Cactus Desierto', category: 'nature', widthTiles: 1.1, heightTiles: 1.1, defaultLayer: 'above_walls', defaultShadow: true, tags: ['cactus', 'desierto'] },
  { id: 'rock', name: 'Roca Musgosa', category: 'nature', widthTiles: 1.1, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['roca', 'piedra'] },
  { id: 'stump', name: 'Tocón Cortado', category: 'nature', widthTiles: 0.95, heightTiles: 0.95, defaultLayer: 'above_floor', defaultShadow: true, tags: ['tocon', 'madera'] },

  // Lighting Fixtures
  { id: 'brazier', name: 'Brasero Fuego', category: 'lighting', widthTiles: 0.95, heightTiles: 0.95, defaultLayer: 'above_floor', defaultShadow: true, tags: ['brasero', 'fuego', 'luz'] },
  { id: 'brazier_teal', name: 'Brasero Arcano', category: 'lighting', widthTiles: 0.95, heightTiles: 0.95, defaultLayer: 'above_floor', defaultShadow: true, tags: ['brasero', 'azul', 'magia'] },
  { id: 'torch_wall', name: 'Antorcha', category: 'lighting', widthTiles: 0.65, heightTiles: 0.65, defaultLayer: 'above_walls', defaultShadow: false, tags: ['antorcha', 'luz'] },
  { id: 'candle_cluster', name: 'Velas', category: 'lighting', widthTiles: 0.65, heightTiles: 0.65, defaultLayer: 'above_floor', defaultShadow: false, tags: ['velas', 'altar'] },
  { id: 'candelabra', name: 'Candelabro Oro', category: 'lighting', widthTiles: 0.9, heightTiles: 0.9, defaultLayer: 'above_floor', defaultShadow: true, tags: ['candelabro', 'velas'] },
  { id: 'chandelier_gold', name: 'Araña de Techo', category: 'lighting', widthTiles: 1.8, heightTiles: 1.8, defaultLayer: 'above_walls', defaultShadow: false, tags: ['lampara', 'arana', 'techo'] },
  { id: 'lantern', name: 'Farol Calle', category: 'lighting', widthTiles: 0.7, heightTiles: 0.7, defaultLayer: 'above_walls', defaultShadow: true, tags: ['farol', 'calle'] },
  { id: 'crystal_lamp', name: 'Farol Arcano', category: 'lighting', widthTiles: 0.85, heightTiles: 0.85, defaultLayer: 'above_floor', defaultShadow: true, tags: ['farol', 'cristal', 'magia'] },
];

const spriteCache = new Map<string, HTMLCanvasElement>();
const thumbCache = new Map<string, string>();
const customImageCache = new Map<string, HTMLImageElement>();

// Props that emit their own light as soon as they are placed (radius in tiles).
export const PROP_LIGHTS: Record<string, { color: string; radius: number; intensity: number }> = {
  brazier: { color: '#ff9a3c', radius: 5, intensity: 1 },
  brazier_teal: { color: '#38bdf8', radius: 5, intensity: 1 },
  torch_wall: { color: '#ffae42', radius: 5, intensity: 1 },
  candle_cluster: { color: '#ffc66e', radius: 2.5, intensity: 0.8 },
  candelabra: { color: '#ffc66e', radius: 4, intensity: 1 },
  chandelier_gold: { color: '#ffd58a', radius: 7, intensity: 1 },
  lantern: { color: '#ffc46b', radius: 5, intensity: 1 },
  crystal_lamp: { color: '#c084fc', radius: 5, intensity: 1 },
  street_lamppost: { color: '#ffd27a', radius: 6, intensity: 1 },
  campfire: { color: '#ff8c2e', radius: 6, intensity: 1 },
  fireplace: { color: '#ff8c2e', radius: 5, intensity: 1 },
  kitchen_stove: { color: '#ff7a1f', radius: 3.5, intensity: 1 },
  forge_furnace: { color: '#ff6a14', radius: 4.5, intensity: 1 },
  roast_spit: { color: '#ff8c2e', radius: 3.5, intensity: 1 },
  sauna_brazier: { color: '#ff9d2e', radius: 3.5, intensity: 0.8 },
  portal_gate: { color: '#a855f7', radius: 5, intensity: 1 },
  magic_circle: { color: '#5eead4', radius: 4, intensity: 0.8 },
  crystal_cluster: { color: '#38bdf8', radius: 3.5, intensity: 0.8 },
  crystal_magenta: { color: '#d946ef', radius: 3.5, intensity: 0.8 },
  obelisk_runic: { color: '#4de3e8', radius: 3.5, intensity: 0.8 },
};

const PX_PER_TILE = 96;

export function getPropDefinition(propId: string, customAssets: CustomAsset[] = []): PropDefinition | undefined {
  if (propId.startsWith('custom:')) {
    const cid = propId.slice('custom:'.length);
    const asset = customAssets.find((a) => a.id === cid);
    if (!asset) return undefined;
    return {
      id: propId,
      name: asset.name,
      category: 'custom',
      widthTiles: asset.widthTiles,
      heightTiles: asset.heightTiles,
      defaultLayer: 'above_floor',
      defaultShadow: true,
      tags: ['custom'],
    };
  }
  return BUILTIN_PROPS.find((p) => p.id === propId);
}

export function getCustomImage(asset: CustomAsset, onLoad?: () => void): HTMLImageElement {
  let img = customImageCache.get(asset.id);
  if (!img) {
    img = new Image();
    img.src = asset.dataUrl;
    if (onLoad) img.onload = onLoad;
    customImageCache.set(asset.id, img);
  }
  return img;
}

// Irregular pool with a clotted rim, wet depth, glints and the splatter around it.
function drawBloodPool(ctx: CanvasRenderingContext2D, w: number, h: number) {
  let seed = 20;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const cx = w * 0.48;
  const cy = h * 0.5;

  // Smooth closed outline whose radius wobbles, with a few lobes reaching further out.
  const points = Array.from({ length: 22 }, (_, i) => {
    const angle = (i / 22) * Math.PI * 2;
    const reach = 0.72 + rand() * 0.28 + (i % 7 === 2 ? 0.22 : 0);
    return { x: Math.cos(angle) * w * 0.33 * reach, y: Math.sin(angle) * h * 0.31 * reach };
  });
  const blob = (scale: number, dx: number, dy: number) => {
    const at = (i: number) => {
      const p = points[i % points.length];
      return { x: cx + dx + p.x * scale, y: cy + dy + p.y * scale };
    };
    const mid = (i: number) => ({
      x: (at(i).x + at(i + 1).x) / 2,
      y: (at(i).y + at(i + 1).y) / 2,
    });
    ctx.beginPath();
    ctx.moveTo(mid(0).x, mid(0).y);
    for (let i = 1; i <= points.length; i++) {
      ctx.quadraticCurveTo(at(i).x, at(i).y, mid(i).x, mid(i).y);
    }
    ctx.closePath();
  };
  const drop = (x: number, y: number, rx: number, ry: number, turn: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, turn, 0, Math.PI * 2);
    ctx.fill();
  };

  // Thin smear soaking into the floor
  ctx.fillStyle = 'rgba(96, 8, 10, 0.32)';
  blob(1.1, 0, 0);
  ctx.fill();

  // Body of the pool: dark and clotted at the rim, richer where it is deeper
  const body = ctx.createRadialGradient(cx - w * 0.05, cy, w * 0.04, cx, cy, w * 0.38);
  body.addColorStop(0, 'rgba(92, 2, 8, 0.96)');
  body.addColorStop(0.55, 'rgba(142, 10, 16, 0.95)');
  body.addColorStop(1, 'rgba(104, 6, 10, 0.92)');
  ctx.fillStyle = body;
  blob(1, 0, 0);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52, 0, 4, 0.75)';
  ctx.lineWidth = Math.max(1.5, w * 0.018);
  ctx.stroke();
  ctx.fillStyle = 'rgba(58, 0, 6, 0.55)';
  blob(0.52, -w * 0.05, h * 0.03);
  ctx.fill();

  // Splashes flung outwards, stretched along the direction they flew
  for (let i = 0; i < 34; i++) {
    const angle = rand() * Math.PI * 2;
    const far = 0.32 + rand() * 0.11;
    const r = w * (0.006 + rand() * rand() * 0.032);
    const x = cx + Math.cos(angle) * w * far;
    const y = cy + Math.sin(angle) * h * far;
    drop(x, y, r * (1 + rand() * 1.4), r, angle, 'rgba(116, 6, 10, 0.9)');
  }
  // Two longer trails ending in a bead
  for (const [angle, far] of [[-0.55, 0.46], [2.5, 0.45]]) {
    const x = cx + Math.cos(angle) * w * far;
    const y = cy + Math.sin(angle) * h * far;
    ctx.strokeStyle = 'rgba(116, 6, 10, 0.88)';
    ctx.lineCap = 'round';
    ctx.lineWidth = w * 0.028;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * w * 0.24, cy + Math.sin(angle) * h * 0.24);
    ctx.quadraticCurveTo((cx + x) / 2 + w * 0.07, (cy + y) / 2 + h * 0.04, x, y);
    ctx.stroke();
    drop(x, y, w * 0.032, w * 0.027, angle, 'rgba(122, 6, 12, 0.95)');
  }

  // Wet reflections
  ctx.strokeStyle = 'rgba(255, 190, 180, 0.5)';
  ctx.lineCap = 'round';
  ctx.lineWidth = w * 0.022;
  ctx.beginPath();
  ctx.ellipse(cx - w * 0.04, cy - h * 0.02, w * 0.19, h * 0.17, 0, 3.55, 4.45);
  ctx.stroke();
  drop(cx + w * 0.13, cy + h * 0.1, w * 0.02, w * 0.012, -0.5, 'rgba(255, 200, 190, 0.42)');
  drop(cx - w * 0.17, cy - h * 0.01, w * 0.01, w * 0.008, 0, 'rgba(255, 200, 190, 0.5)');
}

function renderPropSprite(def: PropDefinition): HTMLCanvasElement {
  const w = Math.max(48, Math.round(def.widthTiles * PX_PER_TILE));
  const h = Math.max(48, Math.round(def.heightTiles * PX_PER_TILE));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  if (drawAnimal(ctx, def.id, w, h)) {
    finishSprite(ctx, w, h); // fur and feather texture
  } else if (def.id === 'blood_pool') {
    drawBloodPool(ctx, w, h);
  } else {
    const seed = [...def.id].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 2147483647, 7);
    OBJECTS[def.id]?.(createKit(ctx, w, h, seed));
  }
  return canvas;
}

export function getPropSprite(propId: string): HTMLCanvasElement | null {
  if (propId.startsWith('custom:')) return null;
  let sprite = spriteCache.get(propId);
  if (!sprite) {
    const def = BUILTIN_PROPS.find((p) => p.id === propId);
    if (!def) return null;
    sprite = renderPropSprite(def);
    spriteCache.set(propId, sprite);
  }
  return sprite;
}

export function getPropThumbnail(propId: string, customAssets: CustomAsset[] = []): string {
  if (propId.startsWith('custom:')) {
    const cid = propId.slice('custom:'.length);
    return customAssets.find((a) => a.id === cid)?.dataUrl ?? '';
  }
  let url = thumbCache.get(propId);
  if (!url) {
    const sprite = getPropSprite(propId);
    if (!sprite) return '';
    url = sprite.toDataURL('image/png');
    thumbCache.set(propId, url);
  }
  return url;
}
