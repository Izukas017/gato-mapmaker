import type { CustomAsset, PropCategory, PropDefinition } from '../types/map';

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

function renderPropSprite(def: PropDefinition): HTMLCanvasElement {
  const w = Math.max(48, Math.round(def.widthTiles * PX_PER_TILE));
  const h = Math.max(48, Math.round(def.heightTiles * PX_PER_TILE));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const cx = w / 2;
  const cy = h / 2;

  switch (def.id) {
    case 'bed_teal':
    case 'bed_crimson':
    case 'bed_double': {
      const isDouble = def.id === 'bed_double';
      const blanketMain = def.id === 'bed_teal' ? '#3d8f8b' : def.id === 'bed_crimson' ? '#9c363b' : '#4a6b8a';
      const blanketLight = def.id === 'bed_teal' ? '#58ada7' : def.id === 'bed_crimson' ? '#bd4c52' : '#6588a8';
      const trim = '#d8b66c';
      // Wooden frame
      ctx.fillStyle = '#5c3d24';
      ctx.strokeStyle = '#24150a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, w - 8, h - 8, 6);
      ctx.fill();
      ctx.stroke();
      // Headboard
      ctx.fillStyle = '#472d18';
      ctx.fillRect(4, 4, w - 8, 14);
      // Mattress / sheet
      ctx.fillStyle = '#e6decb';
      ctx.beginPath();
      ctx.roundRect(10, 18, w - 20, h - 28, 4);
      ctx.fill();
      // Pillows
      const pillowCount = isDouble ? 2 : 1;
      const pw = (w - 28) / pillowCount - (isDouble ? 4 : 0);
      for (let i = 0; i < pillowCount; i++) {
        const px = 14 + i * (pw + 8);
        ctx.fillStyle = '#f4efe2';
        ctx.strokeStyle = '#b5aa94';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(px, 22, pw, 26, 8);
        ctx.fill();
        ctx.stroke();
      }
      // Blanket
      const by = 52;
      const bh = h - by - 12;
      const grad = ctx.createLinearGradient(0, by, 0, by + bh);
      grad.addColorStop(0, blanketLight);
      grad.addColorStop(1, blanketMain);
      ctx.fillStyle = grad;
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(10, by, w - 20, bh, 5);
      ctx.fill();
      ctx.stroke();
      // Folded top cuff
      ctx.fillStyle = '#dcd4be';
      ctx.fillRect(10, by, w - 20, 12);
      // Gold embroidered medallion
      ctx.strokeStyle = trim;
      ctx.lineWidth = 2;
      ctx.strokeRect(18, by + 20, w - 36, bh - 30);
      ctx.beginPath();
      ctx.arc(cx, by + bh * 0.56, Math.min(w, bh) * 0.16, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'table_round':
    case 'table_round_teal': {
      const r = Math.min(w, h) * 0.45;
      const grad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.1, cx, cy, r);
      grad.addColorStop(0, '#c29763');
      grad.addColorStop(0.7, '#996f41');
      grad.addColorStop(1, '#6e4b27');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#2d1c0d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Plank seams
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = 'rgba(42,24,10,0.32)';
      ctx.lineWidth = 1.5;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * (r * 0.34), cy - r);
        ctx.lineTo(cx + i * (r * 0.34), cy + r);
        ctx.stroke();
      }
      if (def.id === 'table_round_teal') {
        // Teal table runner like screenshot 1
        ctx.fillStyle = '#2e7c77';
        ctx.fillRect(cx - r * 0.26, cy - r, r * 0.52, r * 2);
        ctx.strokeStyle = '#d9b96c';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - r * 0.23, cy - r, r * 0.46, r * 2);
      } else {
        // Wooden mug & plate
        ctx.fillStyle = '#d9cfb8';
        ctx.beginPath();
        ctx.arc(cx - r * 0.32, cy - r * 0.2, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#5a3b22';
        ctx.beginPath();
        ctx.arc(cx + r * 0.28, cy + r * 0.18, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    case 'table_banquet': {
      ctx.fillStyle = '#8b6138';
      ctx.strokeStyle = '#29180a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 6);
      ctx.fill();
      ctx.stroke();
      // Plank lines
      ctx.strokeStyle = 'rgba(35,20,8,0.32)';
      ctx.lineWidth = 1.5;
      for (let y = 26; y < h - 18; y += 22) {
        ctx.beginPath();
        ctx.moveTo(8, y);
        ctx.lineTo(w - 8, y);
        ctx.stroke();
      }
      // Subtle highlight
      ctx.strokeStyle = 'rgba(255,235,200,0.18)';
      ctx.strokeRect(10, 12, w - 20, h - 24);
      break;
    }

    case 'pew': {
      // Carved church pew like screenshots 1 & 2
      ctx.fillStyle = '#734d2e';
      ctx.strokeStyle = '#241409';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 4);
      ctx.fill();
      ctx.stroke();
      // Backrest rail
      ctx.fillStyle = '#4e311a';
      ctx.fillRect(8, 8, w - 16, 13);
      // Seat highlight
      ctx.fillStyle = '#8f633e';
      ctx.fillRect(10, 24, w - 20, h - 38);
      // End armrests
      ctx.fillStyle = '#472b15';
      ctx.fillRect(4, 6, 11, h - 12);
      ctx.fillRect(w - 15, 6, 11, h - 12);
      break;
    }

    case 'chair': {
      ctx.fillStyle = '#845935';
      ctx.strokeStyle = '#26160b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(10, 12, w - 20, h - 20, 5);
      ctx.fill();
      ctx.stroke();
      // Backrest
      ctx.fillStyle = '#57371d';
      ctx.fillRect(8, 8, w - 16, 11);
      ctx.strokeRect(8, 8, w - 16, 11);
      break;
    }

    case 'desk': {
      ctx.fillStyle = '#7a5230';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 4);
      ctx.fill();
      ctx.stroke();
      // Parchment sheet
      ctx.save();
      ctx.translate(cx - 10, cy);
      ctx.rotate(-0.08);
      ctx.fillStyle = '#ece1c4';
      ctx.fillRect(-20, -14, 40, 28);
      ctx.strokeStyle = '#9c8c6c';
      ctx.lineWidth = 1;
      ctx.strokeRect(-20, -14, 40, 28);
      ctx.restore();
      // Inkwell
      ctx.fillStyle = '#22262e';
      ctx.beginPath();
      ctx.arc(cx + 32, cy - 10, 6, 0, Math.PI * 2);
      ctx.fill();
      // Candle
      ctx.fillStyle = '#f7e5b7';
      ctx.beginPath();
      ctx.arc(cx + 46, cy + 10, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'bookshelf': {
      ctx.fillStyle = '#5c3b20';
      ctx.strokeStyle = '#221308';
      ctx.lineWidth = 3;
      ctx.fillRect(4, 6, w - 8, h - 12);
      ctx.strokeRect(4, 6, w - 8, h - 12);
      const bookColors = ['#8c2f32', '#2f5c6e', '#4c6e3b', '#8c6b2f', '#5b3c6e', '#7a452d'];
      let bx = 10;
      let idx = 0;
      while (bx < w - 18) {
        const bw = 9 + ((idx * 7) % 7);
        ctx.fillStyle = bookColors[idx % bookColors.length];
        ctx.fillRect(bx, 12, bw, h - 24);
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, 12, bw, h - 24);
        bx += bw + 1;
        idx++;
      }
      break;
    }

    case 'sofa_teal': {
      ctx.fillStyle = '#337d79';
      ctx.strokeStyle = '#183b39';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 10);
      ctx.fill();
      ctx.stroke();
      // Back & arms
      ctx.fillStyle = '#286461';
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, 18, 6);
      ctx.fill();
      ctx.fillRect(6, 8, 16, h - 16);
      ctx.fillRect(w - 22, 8, 16, h - 16);
      // Cushions
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(24, 28, (w - 48) / 2 - 2, h - 40);
      ctx.strokeRect(cx + 2, 28, (w - 48) / 2 - 2, h - 40);
      break;
    }

    case 'fireplace': {
      ctx.fillStyle = '#6c6862';
      ctx.strokeStyle = '#242220';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, w - 8, h - 8, 4);
      ctx.fill();
      ctx.stroke();
      // Hearth pit
      ctx.fillStyle = '#231914';
      ctx.fillRect(22, 18, w - 44, h - 28);
      // Glowing embers
      const grad = ctx.createRadialGradient(cx, cy + 4, 4, cx, cy + 4, w * 0.28);
      grad.addColorStop(0, '#fff2a6');
      grad.addColorStop(0.4, '#ff7b24');
      grad.addColorStop(1, 'rgba(180,40,10,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(22, 18, w - 44, h - 28);
      break;
    }

    case 'rug_teal':
    case 'rug_crimson':
    case 'rug_runner': {
      const main = def.id === 'rug_crimson' ? '#842b31' : '#3c857e';
      const inner = def.id === 'rug_crimson' ? '#631d22' : '#2e6b65';
      const gold = '#d6b66f';
      // Fringe
      ctx.strokeStyle = '#cbb98f';
      ctx.lineWidth = 2;
      for (let y = 10; y < h - 10; y += 6) {
        ctx.beginPath();
        ctx.moveTo(2, y);
        ctx.lineTo(10, y);
        ctx.moveTo(w - 10, y);
        ctx.lineTo(w - 2, y);
        ctx.stroke();
      }
      ctx.fillStyle = main;
      ctx.fillRect(10, 6, w - 20, h - 12);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 3;
      ctx.strokeRect(16, 12, w - 32, h - 24);
      ctx.fillStyle = inner;
      ctx.fillRect(24, 20, w - 48, h - 40);
      // Ornate center medallion
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, 28);
      ctx.lineTo(w - 32, cy);
      ctx.lineTo(cx, h - 28);
      ctx.lineTo(32, cy);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.14, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'rug_round': {
      ctx.fillStyle = '#4b6485';
      ctx.strokeStyle = '#c9b37d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.45, h * 0.43, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.34, h * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'altar_gold': {
      const r = Math.min(w, h) * 0.46;
      // Stone dais
      ctx.fillStyle = '#9c927d';
      ctx.strokeStyle = '#332d23';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#b8ae96';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
      ctx.fill();
      // Golden shrine figure
      const grad = ctx.createRadialGradient(cx - 8, cy - 10, 6, cx, cy, r * 0.6);
      grad.addColorStop(0, '#fae08c');
      grad.addColorStop(0.6, '#c7993c');
      grad.addColorStop(1, '#755318');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#3b2809';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.52, r * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.14, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'well': {
      const r = Math.min(w, h) * 0.44;
      // Stone rim
      ctx.fillStyle = '#7e7970';
      ctx.strokeStyle = '#262420';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Dark water interior
      const grad = ctx.createRadialGradient(cx - 6, cy - 6, 4, cx, cy, r * 0.66);
      grad.addColorStop(0, '#2a4a57');
      grad.addColorStop(1, '#101c24');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.66, 0, Math.PI * 2);
      ctx.fill();
      // Stone wedge lines
      ctx.strokeStyle = 'rgba(30,28,24,0.55)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 0.66, cy + Math.sin(a) * r * 0.66);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }
      break;
    }

    case 'pool_teal': {
      // Stone border
      ctx.fillStyle = '#9c9586';
      ctx.strokeStyle = '#332f28';
      ctx.lineWidth = 3;
      ctx.fillRect(4, 4, w - 8, h - 8);
      ctx.strokeRect(4, 4, w - 8, h - 8);
      // Glowing sanctuary water
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.55);
      grad.addColorStop(0, '#5bc5c9');
      grad.addColorStop(0.55, '#2b8694');
      grad.addColorStop(1, '#174d5c');
      ctx.fillStyle = grad;
      ctx.fillRect(14, 14, w - 28, h - 28);
      // Caustic ripples
      ctx.strokeStyle = 'rgba(210,250,255,0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx - 12, cy - 20, 26, 14, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + 16, cy + 28, 22, 12, -0.4, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'fountain': {
      const r = Math.min(w, h) * 0.46;
      ctx.fillStyle = '#8b867d';
      ctx.strokeStyle = '#2d2b27';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#3c8da1';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a49e94';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'barrel': {
      const r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#8c6239';
      ctx.strokeStyle = '#291a0d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Iron band
      ctx.strokeStyle = '#43464d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
      ctx.stroke();
      // Plank seams
      ctx.strokeStyle = 'rgba(35,20,8,0.45)';
      ctx.lineWidth = 1.5;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 10, cy - r + 6);
        ctx.lineTo(cx + i * 10, cy + r - 6);
        ctx.stroke();
      }
      break;
    }

    case 'crate': {
      ctx.fillStyle = '#996f43';
      ctx.strokeStyle = '#2b1b0c';
      ctx.lineWidth = 3;
      ctx.fillRect(8, 8, w - 16, h - 16);
      ctx.strokeRect(8, 8, w - 16, h - 16);
      // Cross brace
      ctx.strokeStyle = '#6c4926';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(14, 14);
      ctx.lineTo(w - 14, h - 14);
      ctx.stroke();
      ctx.strokeStyle = '#2b1b0c';
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 16, w - 32, h - 32);
      break;
    }

    case 'sack': {
      ctx.fillStyle = '#b09872';
      ctx.strokeStyle = '#3b2f1f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.4, h * 0.38, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#856e4d';
      ctx.beginPath();
      ctx.arc(cx + 8, cy - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'cart': {
      // Wheels
      ctx.fillStyle = '#472d18';
      ctx.fillRect(4, h * 0.35, 10, h * 0.3);
      ctx.fillRect(w - 14, h * 0.35, 10, h * 0.3);
      // Shafts
      ctx.strokeStyle = '#5c3c22';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, 10);
      ctx.lineTo(w * 0.3, h * 0.32);
      ctx.moveTo(w * 0.7, 10);
      ctx.lineTo(w * 0.7, h * 0.32);
      ctx.stroke();
      // Cart bed
      ctx.fillStyle = '#855a34';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.fillRect(14, h * 0.26, w - 28, h * 0.64);
      ctx.strokeRect(14, h * 0.26, w - 28, h * 0.64);
      // Cargo grain/sacks
      ctx.fillStyle = '#c4ab76';
      ctx.beginPath();
      ctx.ellipse(cx, h * 0.56, w * 0.26, h * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'chest': {
      ctx.fillStyle = '#754926';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(8, 10, w - 16, h - 20, 4);
      ctx.fill();
      ctx.stroke();
      // Iron straps
      ctx.fillStyle = '#474c54';
      ctx.fillRect(20, 10, 9, h - 20);
      ctx.fillRect(w - 29, 10, 9, h - 20);
      // Gold clasp
      ctx.fillStyle = '#d9b252';
      ctx.fillRect(cx - 7, h - 18, 14, 9);
      break;
    }

    case 'anvil': {
      ctx.fillStyle = '#4a4f57';
      ctx.strokeStyle = '#191b1f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(12, cy);
      ctx.lineTo(36, 16);
      ctx.lineTo(w - 14, 16);
      ctx.lineTo(w - 14, h - 16);
      ctx.lineTo(36, h - 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'tree_oak': {
      const r = Math.min(w, h) * 0.44;
      // Rich layered painted canopy clusters (like screenshot 1)
      const puffs = [
        { dx: -0.22, dy: -0.18, rr: 0.44, c: '#294a30' },
        { dx: 0.24, dy: -0.14, rr: 0.42, c: '#2f5436' },
        { dx: -0.18, dy: 0.24, rr: 0.42, c: '#24402a' },
        { dx: 0.2, dy: 0.22, rr: 0.4, c: '#213b27' },
        { dx: 0, dy: 0, rr: 0.52, c: '#3b6b41' },
        { dx: -0.15, dy: -0.15, rr: 0.34, c: '#4d8750' },
        { dx: 0.14, dy: -0.12, rr: 0.3, c: '#5c9c59' },
        { dx: -0.08, dy: -0.22, rr: 0.2, c: '#79b86c' },
      ];
      for (const p of puffs) {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(cx + p.dx * r, cy + p.dy * r, p.rr * r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Subtle leaf stipples
      ctx.fillStyle = 'rgba(165,220,130,0.32)';
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const dist = (0.18 + (i % 3) * 0.18) * r;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * dist - 6, cy + Math.sin(a) * dist - 6, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'tree_pine': {
      const r = Math.min(w, h) * 0.45;
      const tiers = [
        { scale: 1.0, color: '#213d2e' },
        { scale: 0.72, color: '#2e573f' },
        { scale: 0.44, color: '#457856' },
      ];
      for (const tier of tiers) {
        ctx.fillStyle = tier.color;
        ctx.beginPath();
        const spikes = 10;
        for (let i = 0; i < spikes * 2; i++) {
          const rad = (i % 2 === 0 ? 1 : 0.58) * r * tier.scale;
          const a = (i / (spikes * 2)) * Math.PI * 2;
          const x = cx + Math.cos(a) * rad;
          const y = cy + Math.sin(a) * rad;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
      break;
    }

    case 'bush': {
      const r = Math.min(w, h) * 0.4;
      const puffs = [
        { dx: -0.25, dy: 0.1, rr: 0.48, c: '#2e5232' },
        { dx: 0.25, dy: 0.08, rr: 0.45, c: '#36613a' },
        { dx: 0, dy: -0.18, rr: 0.5, c: '#4a7c48' },
        { dx: -0.08, dy: -0.22, rr: 0.28, c: '#6da360' },
      ];
      for (const p of puffs) {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(cx + p.dx * r, cy + p.dy * r, p.rr * r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'rock': {
      ctx.fillStyle = '#73706a';
      ctx.strokeStyle = '#292825';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.25);
      ctx.lineTo(w * 0.65, h * 0.12);
      ctx.lineTo(w * 0.88, h * 0.48);
      ctx.lineTo(w * 0.72, h * 0.84);
      ctx.lineTo(w * 0.25, h * 0.8);
      ctx.lineTo(w * 0.12, h * 0.52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Facet highlight
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.moveTo(w * 0.22, h * 0.27);
      ctx.lineTo(w * 0.63, h * 0.15);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'stump': {
      const r = Math.min(w, h) * 0.4;
      ctx.fillStyle = '#634329';
      ctx.strokeStyle = '#26170b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#b89464';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.76, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(92,60,30,0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.48, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'brazier': {
      const r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#473c33';
      ctx.strokeStyle = '#1c1713';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Brass rim
      ctx.strokeStyle = '#c99c4a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
      ctx.stroke();
      // Fire core
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 0.72);
      grad.addColorStop(0, '#fff7c2');
      grad.addColorStop(0.45, '#ff9d2e');
      grad.addColorStop(0.85, '#c93814');
      grad.addColorStop(1, '#3d150c');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'torch_wall':
    case 'lantern':
    case 'candle_cluster': {
      const r = Math.min(w, h) * 0.34;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 1.15);
      grad.addColorStop(0, '#fff7cc');
      grad.addColorStop(0.5, '#ffaa38');
      grad.addColorStop(1, 'rgba(255,120,20,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = def.id === 'candle_cluster' ? '#f2e8cf' : '#3a3d45';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'cot_straw': {
      ctx.fillStyle = '#63462b';
      ctx.strokeStyle = '#24160a';
      ctx.lineWidth = 2.5;
      ctx.fillRect(6, 6, w - 12, h - 12);
      ctx.strokeRect(6, 6, w - 12, h - 12);
      ctx.fillStyle = '#c9ae6a';
      ctx.fillRect(12, 12, w - 24, h - 24);
      ctx.strokeStyle = 'rgba(120,90,30,0.45)';
      ctx.lineWidth = 1.5;
      for (let i = 16; i < h - 16; i += 8) {
        ctx.beginPath();
        ctx.moveTo(14, i);
        ctx.lineTo(w - 14, i + 4);
        ctx.stroke();
      }
      break;
    }

    case 'bench_stone': {
      ctx.fillStyle = '#8b877e';
      ctx.strokeStyle = '#2c2a27';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 10, w - 12, h - 20, 4);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(12, 15, w - 24, h - 30);
      break;
    }

    case 'stool_wood': {
      const r = Math.min(w, h) * 0.38;
      ctx.fillStyle = '#875b36';
      ctx.strokeStyle = '#29180b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#9e6f46';
      ctx.beginPath();
      ctx.arc(cx - 2, cy - 2, r * 0.65, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'throne_gold': {
      ctx.fillStyle = '#b58d3d';
      ctx.strokeStyle = '#332409';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(10, 10, w - 20, h - 20, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#8f242b';
      ctx.fillRect(22, 24, w - 44, h - 42);
      ctx.fillStyle = '#e3be68';
      ctx.fillRect(8, 8, w - 16, 14);
      ctx.fillRect(8, 18, 12, h - 30);
      ctx.fillRect(w - 20, 18, 12, h - 30);
      break;
    }

    case 'lectern_book': {
      ctx.fillStyle = '#6e4726';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(10, 10, w - 20, h - 20, 4);
      ctx.fill();
      ctx.stroke();
      // Open book pages
      ctx.fillStyle = '#f2e8cf';
      ctx.fillRect(16, 16, w - 32, h - 32);
      ctx.strokeStyle = '#8c2d2d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, 16);
      ctx.lineTo(cx, h - 16);
      ctx.stroke();
      break;
    }

    case 'wardrobe': {
      ctx.fillStyle = '#5e3c20';
      ctx.strokeStyle = '#1f1208';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 4);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#855934';
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 14, cx - 14, h - 28);
      ctx.strokeRect(cx + 2, 14, cx - 14, h - 28);
      break;
    }

    case 'sofa_crimson': {
      ctx.fillStyle = '#8a2b32';
      ctx.strokeStyle = '#330f12';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#6b1e23';
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, 18, 6);
      ctx.fill();
      ctx.fillRect(6, 8, 16, h - 16);
      ctx.fillRect(w - 22, 8, 16, h - 16);
      break;
    }

    case 'piano_harpsichord': {
      ctx.fillStyle = '#3d2414';
      ctx.strokeStyle = '#170d06';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10, h - 12);
      ctx.lineTo(10, 12);
      ctx.lineTo(w - 12, 12);
      ctx.quadraticCurveTo(w - 10, cy, w * 0.62, h - 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // White & black keys along bottom
      ctx.fillStyle = '#f5f0e6';
      ctx.fillRect(16, h - 26, w * 0.45, 10);
      ctx.fillStyle = '#1a1a1a';
      for (let x = 20; x < 16 + w * 0.42; x += 7) {
        ctx.fillRect(x, h - 26, 3, 6);
      }
      break;
    }

    case 'bathtub_wood':
    case 'bathtub_copper': {
      const isCopper = def.id === 'bathtub_copper';
      // Outer rim
      ctx.fillStyle = isCopper ? '#b86635' : '#6e4929';
      ctx.strokeStyle = isCopper ? '#381b0a' : '#26170b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.44, h * 0.46, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Iron hoop or copper highlight band
      ctx.strokeStyle = isCopper ? '#e69d67' : '#3a3e45';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.41, h * 0.43, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Warm bathwater gradient
      const wGrad = ctx.createRadialGradient(cx - 6, cy - 10, 6, cx, cy, h * 0.38);
      wGrad.addColorStop(0, '#7dd3e8');
      wGrad.addColorStop(0.65, '#3b95ad');
      wGrad.addColorStop(1, '#225e70');
      ctx.fillStyle = wGrad;
      ctx.strokeStyle = 'rgba(20,40,48,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.34, h * 0.37, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Foam bubbles
      ctx.fillStyle = 'rgba(244, 253, 255, 0.82)';
      for (const [bx, by, br] of [
        [-10, -24, 9],
        [4, -28, 7],
        [14, -20, 6],
        [-14, 18, 8],
        [-3, 24, 6],
        [10, 16, 7],
      ]) {
        ctx.beginPath();
        ctx.arc(cx + bx, cy + by, br, 0, Math.PI * 2);
        ctx.fill();
      }
      if (isCopper) {
        // Brass faucet at top end
        ctx.fillStyle = '#e0b858';
        ctx.strokeStyle = '#3b2b0a';
        ctx.lineWidth = 1.8;
        ctx.fillRect(cx - 10, 6, 20, 8);
        ctx.strokeRect(cx - 10, 6, 20, 8);
        ctx.fillRect(cx - 3, 12, 6, 12);
      } else {
        // Bath caddy plank & soap bar across lower third
        ctx.fillStyle = '#8c6239';
        ctx.strokeStyle = '#29180b';
        ctx.lineWidth = 2;
        ctx.fillRect(cx - w * 0.42, cy + 8, w * 0.84, 13);
        ctx.strokeRect(cx - w * 0.42, cy + 8, w * 0.84, 13);
        ctx.fillStyle = '#f5d0c5';
        ctx.fillRect(cx + 6, cy + 10, 12, 8);
      }
      break;
    }

    case 'mirror_standing': {
      ctx.fillStyle = '#8c6936';
      ctx.strokeStyle = '#2b1e0c';
      ctx.lineWidth = 2.5;
      ctx.fillRect(10, cy - 7, w - 20, 14);
      ctx.strokeRect(10, cy - 7, w - 20, 14);
      ctx.fillStyle = '#9ad9eb';
      ctx.fillRect(16, cy - 4, w - 32, 8);
      break;
    }

    case 'bar_counter': {
      ctx.fillStyle = '#6b4423';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 10, w - 12, h - 20, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#875932';
      ctx.fillRect(12, 16, w - 24, h - 32);
      // Mugs on counter
      ctx.fillStyle = '#d9b86c';
      ctx.beginPath();
      ctx.arc(w * 0.25, cy, 7, 0, Math.PI * 2);
      ctx.arc(w * 0.65, cy - 4, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'keg_giant': {
      ctx.fillStyle = '#7a502c';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(12, 10, w - 24, h - 20, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#3f434a';
      ctx.fillRect(12, h * 0.26, w - 24, 8);
      ctx.fillRect(12, h * 0.68, w - 24, 8);
      ctx.fillStyle = '#c9a14b';
      ctx.fillRect(cx - 5, h - 12, 10, 8);
      break;
    }

    case 'table_feast': {
      ctx.fillStyle = '#805632';
      ctx.strokeStyle = '#26170b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 6);
      ctx.fill();
      ctx.stroke();
      // White table runner
      ctx.fillStyle = '#e8dfc8';
      ctx.fillRect(14, cy - 14, w - 28, 28);
      // Plates & roast
      for (let x = 32; x < w - 28; x += 44) {
        ctx.fillStyle = '#c99749';
        ctx.beginPath();
        ctx.arc(x, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#a63e26';
        ctx.beginPath();
        ctx.arc(x, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'kitchen_stove':
    case 'forge_furnace': {
      const isForge = def.id === 'forge_furnace';
      ctx.fillStyle = '#52555c';
      ctx.strokeStyle = '#1c1d21';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 6, w - 12, h - 12, 6);
      ctx.fill();
      ctx.stroke();
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, Math.min(w, h) * 0.35);
      grad.addColorStop(0, '#fff3a1');
      grad.addColorStop(0.5, '#ff6a14');
      grad.addColorStop(1, '#291510');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.32, 0, Math.PI * 2);
      ctx.fill();
      if (!isForge) {
        ctx.strokeStyle = '#22252a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx - 32, cy, 14, 0, Math.PI * 2);
        ctx.arc(cx + 32, cy, 14, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    case 'roast_spit': {
      ctx.fillStyle = '#3b2e28';
      ctx.fillRect(12, cy - 16, w - 24, 32);
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, w * 0.35);
      grad.addColorStop(0, '#ffdf85');
      grad.addColorStop(0.5, '#f26419');
      grad.addColorStop(1, 'rgba(80,20,10,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(14, cy - 14, w - 28, 28);
      // Spit rod & roast meat
      ctx.strokeStyle = '#2b2d30';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(8, cy);
      ctx.lineTo(w - 8, cy);
      ctx.stroke();
      ctx.fillStyle = '#9c4722';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 24, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'cauldron_soup':
    case 'cauldron_witch': {
      const isWitch = def.id === 'cauldron_witch';
      const r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#2d3036';
      ctx.strokeStyle = '#121317';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const grad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, r * 0.78);
      grad.addColorStop(0, isWitch ? '#b9ff66' : '#f5c26b');
      grad.addColorStop(1, isWitch ? '#2d8a3e' : '#9c5221');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'wine_rack': {
      ctx.fillStyle = '#59381f';
      ctx.strokeStyle = '#211309';
      ctx.lineWidth = 3;
      ctx.fillRect(6, 8, w - 12, h - 16);
      ctx.strokeRect(6, 8, w - 12, h - 16);
      for (let x = 16; x < w - 16; x += 16) {
        ctx.fillStyle = '#295939';
        ctx.beginPath();
        ctx.arc(x, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8c232c';
        ctx.beginPath();
        ctx.arc(x, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'rug_emerald':
    case 'rug_purple_royal': {
      const isPurple = def.id === 'rug_purple_royal';
      const main = isPurple ? '#532b6e' : '#296e4c';
      const inner = isPurple ? '#3b1d52' : '#1d5238';
      const gold = '#deb868';
      ctx.fillStyle = main;
      ctx.fillRect(10, 6, w - 20, h - 12);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 3;
      ctx.strokeRect(16, 12, w - 32, h - 24);
      ctx.fillStyle = inner;
      ctx.fillRect(24, 20, w - 48, h - 40);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.16, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'rug_bear': {
      // Claws protruding from the 4 paws
      const drawClaws = (px: number, py: number, baseAngle: number) => {
        ctx.fillStyle = '#ede2cc';
        ctx.strokeStyle = '#2e2014';
        ctx.lineWidth = 1.4;
        for (let i = -1.5; i <= 1.5; i += 1) {
          const a = baseAngle + i * 0.24;
          ctx.save();
          ctx.translate(px + Math.cos(a) * 12, py + Math.sin(a) * 12);
          ctx.rotate(a);
          ctx.beginPath();
          ctx.moveTo(-2, -3);
          ctx.lineTo(10, 0);
          ctx.lineTo(-2, 3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      };

      const flX = w * 0.17;
      const flY = h * 0.31;
      const frX = w * 0.83;
      const frY = h * 0.31;
      const rlX = w * 0.19;
      const rlY = h * 0.8;
      const rrX = w * 0.81;
      const rrY = h * 0.8;

      drawClaws(flX, flY, -Math.PI * 0.78);
      drawClaws(frX, frY, -Math.PI * 0.22);
      drawClaws(rlX, rlY, Math.PI * 0.78);
      drawClaws(rrX, rrY, Math.PI * 0.22);

      // Continuous organic splayed bearskin pelt silhouette
      const peltGrad = ctx.createRadialGradient(cx, cy + 10, 12, cx, cy + 10, w * 0.48);
      peltGrad.addColorStop(0, '#4a2c18');
      peltGrad.addColorStop(0.45, '#6e4529');
      peltGrad.addColorStop(1, '#57361f');
      ctx.fillStyle = peltGrad;
      ctx.strokeStyle = '#22130a';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';

      ctx.beginPath();
      // Start left side of neck
      ctx.moveTo(cx - 20, h * 0.2);
      // Out to front-left shoulder & paw
      ctx.quadraticCurveTo(w * 0.28, h * 0.2, flX - 8, flY - 8);
      ctx.arc(flX, flY, 15, -Math.PI * 0.75, Math.PI * 0.45, true);
      // Curve inward to left waist
      ctx.quadraticCurveTo(w * 0.33, h * 0.48, w * 0.31, h * 0.58);
      // Out to rear-left leg & paw
      ctx.quadraticCurveTo(w * 0.24, h * 0.68, rlX - 10, rlY - 6);
      ctx.arc(rlX, rlY, 15, -Math.PI * 0.85, Math.PI * 0.35, true);
      // Curve into rump & stubby bear tail
      ctx.quadraticCurveTo(w * 0.36, h * 0.84, cx - 12, h * 0.89);
      ctx.quadraticCurveTo(cx, h * 0.96, cx + 12, h * 0.89);
      // Out to rear-right leg & paw
      ctx.quadraticCurveTo(w * 0.64, h * 0.84, rrX - 10, rrY + 10);
      ctx.arc(rrX, rrY, 15, Math.PI * 0.65, -Math.PI * 0.15, true);
      // Curve inward to right waist
      ctx.quadraticCurveTo(w * 0.76, h * 0.68, w * 0.69, h * 0.58);
      ctx.quadraticCurveTo(w * 0.67, h * 0.48, frX - 8, frY + 12);
      // Out to front-right paw & back to right neck
      ctx.arc(frX, frY, 15, Math.PI * 0.55, -Math.PI * 0.25, true);
      ctx.quadraticCurveTo(w * 0.72, h * 0.2, cx + 20, h * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Darker dorsal fur ridge & fur texture strokes
      ctx.strokeStyle = 'rgba(36, 20, 10, 0.48)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.24);
      ctx.lineTo(cx, h * 0.86);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(156, 108, 72, 0.28)';
      ctx.lineWidth = 2;
      for (let y = h * 0.3; y <= h * 0.8; y += 16) {
        ctx.beginPath();
        ctx.moveTo(cx - 6, y);
        ctx.lineTo(cx - 28, y + 6);
        ctx.moveTo(cx + 6, y);
        ctx.lineTo(cx + 28, y + 6);
        ctx.stroke();
      }

      // Bear ears (separate subpaths!)
      const headY = h * 0.17;
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#4f301b';
        ctx.strokeStyle = '#211209';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx + side * 21, headY + 5, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#2e1a0d';
        ctx.beginPath();
        ctx.arc(cx + side * 21, headY + 5, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bear skull / head
      ctx.fillStyle = '#694126';
      ctx.strokeStyle = '#211209';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.ellipse(cx, headY, 24, 21, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Tan muzzle / snout pointing forward
      ctx.fillStyle = '#a67d58';
      ctx.strokeStyle = '#2e1b0e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, headY - 13, 11, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Black nose tip
      ctx.fillStyle = '#171210';
      ctx.beginPath();
      ctx.ellipse(cx, headY - 21, 6, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#140e0a';
        ctx.beginPath();
        ctx.arc(cx + side * 9.5, headY - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.beginPath();
        ctx.arc(cx + side * 9.5 - 0.8, headY - 5.8, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'mat_straw': {
      ctx.fillStyle = '#bfa66b';
      ctx.strokeStyle = '#6e5c34';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(8, 8, w - 16, h - 16, 6);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'sarcophagus_stone':
    case 'sarcophagus_gold': {
      const isGold = def.id === 'sarcophagus_gold';
      ctx.fillStyle = isGold ? '#b8923b' : '#7d7970';
      ctx.strokeStyle = isGold ? '#382909' : '#292724';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.25, 8);
      ctx.lineTo(cx + w * 0.25, 8);
      ctx.lineTo(w - 10, 44);
      ctx.lineTo(w - 14, h - 8);
      ctx.lineTo(14, h - 8);
      ctx.lineTo(10, 44);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = isGold ? '#2b5c8f' : 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 2;
      ctx.strokeRect(22, 30, w - 44, h - 54);
      break;
    }

    case 'statue_knight':
    case 'statue_angel': {
      const r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#87837a';
      ctx.strokeStyle = '#292825';
      ctx.lineWidth = 3;
      ctx.fillRect(10, 10, w - 20, h - 20);
      ctx.strokeRect(10, 10, w - 20, h - 20);
      if (def.id === 'statue_angel') {
        // Wings
        ctx.fillStyle = '#b5b0a4';
        ctx.beginPath();
        ctx.ellipse(cx - 18, cy, 22, 10, -0.5, 0, Math.PI * 2);
        ctx.ellipse(cx + 18, cy, 22, 10, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#a8a399';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'pillar_marble':
    case 'pillar_ruined': {
      const r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#cfc9bc';
      ctx.strokeStyle = '#3d3a33';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(70,65,55,0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      if (def.id === 'pillar_ruined') {
        ctx.strokeStyle = '#2b2924';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.7, cy - r * 0.3);
        ctx.lineTo(cx + r * 0.1, cy + r * 0.2);
        ctx.lineTo(cx + r * 0.7, cy - r * 0.1);
        ctx.stroke();
      }
      break;
    }

    case 'obelisk_runic': {
      ctx.fillStyle = '#383447';
      ctx.strokeStyle = '#16141f';
      ctx.lineWidth = 3;
      ctx.fillRect(12, 12, w - 24, h - 24);
      ctx.strokeRect(12, 12, w - 24, h - 24);
      ctx.strokeStyle = '#4de3e8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, 12);
      ctx.lineTo(w - 12, h - 12);
      ctx.moveTo(w - 12, 12);
      ctx.lineTo(12, h - 12);
      ctx.stroke();
      ctx.fillStyle = '#73f7ff';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'iron_cage': {
      ctx.fillStyle = 'rgba(30,32,38,0.45)';
      ctx.strokeStyle = '#4a505c';
      ctx.lineWidth = 4;
      ctx.fillRect(8, 8, w - 16, h - 16);
      ctx.strokeRect(8, 8, w - 16, h - 16);
      ctx.lineWidth = 2;
      for (let i = 20; i < w - 12; i += 14) {
        ctx.beginPath();
        ctx.moveTo(i, 8);
        ctx.lineTo(i, h - 8);
        ctx.moveTo(8, i);
        ctx.lineTo(w - 8, i);
        ctx.stroke();
      }
      break;
    }

    case 'skeleton_remains': {
      ctx.fillStyle = '#ded7c5';
      ctx.strokeStyle = '#4a453b';
      ctx.lineWidth = 2;
      // Skull
      ctx.beginPath();
      ctx.arc(cx, 24, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Ribcage & bones
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ded7c5';
      for (let y = 42; y <= 72; y += 8) {
        ctx.beginPath();
        ctx.moveTo(cx - 14, y);
        ctx.lineTo(cx + 14, y + 3);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - 6, 78);
      ctx.lineTo(cx - 18, h - 16);
      ctx.moveTo(cx + 6, 78);
      ctx.lineTo(cx + 16, h - 18);
      ctx.stroke();
      break;
    }

    case 'spike_trap': {
      ctx.fillStyle = '#33363d';
      ctx.strokeStyle = '#181a1f';
      ctx.lineWidth = 2.5;
      ctx.fillRect(8, 8, w - 16, h - 16);
      ctx.strokeRect(8, 8, w - 16, h - 16);
      for (let r = 24; r < h - 16; r += 24) {
        for (let c = 24; c < w - 16; c += 24) {
          ctx.fillStyle = '#c4cbd4';
          ctx.beginPath();
          ctx.arc(c, r, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(c - 1, r - 1, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    case 'pit_dark': {
      const r = Math.min(w, h) * 0.44;
      const grad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
      grad.addColorStop(0, '#07080a');
      grad.addColorStop(0.75, '#1b1d24');
      grad.addColorStop(1, '#4f4a42');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'guillotine_rack': {
      ctx.fillStyle = '#5c3c22';
      ctx.strokeStyle = '#211309';
      ctx.lineWidth = 3;
      ctx.fillRect(12, 8, w - 24, h - 16);
      ctx.strokeRect(12, 8, w - 24, h - 16);
      ctx.fillStyle = '#383c42';
      ctx.fillRect(16, 18, w - 32, 12);
      ctx.fillRect(16, h - 30, w - 32, 12);
      break;
    }

    case 'chains_shackles': {
      ctx.strokeStyle = '#7c8491';
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(22 + i * 14, cy + (i % 2) * 6 - 3, 7, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    case 'blood_pool': {
      ctx.fillStyle = 'rgba(138, 18, 24, 0.82)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.38, h * 0.32, 0.3, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy - 12, 14, 0, Math.PI * 2);
      ctx.arc(cx - 20, cy + 14, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'rubble_pile': {
      const stones = [
        [-18, -10, 18],
        [14, -12, 16],
        [-8, 14, 20],
        [18, 12, 15],
        [0, 0, 22],
      ];
      for (const [dx, dy, sr] of stones) {
        ctx.fillStyle = '#757067';
        ctx.strokeStyle = '#292723';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'spider_web': {
      ctx.strokeStyle = 'rgba(235, 240, 245, 0.55)';
      ctx.lineWidth = 1.5;
      const r = Math.min(w, h) * 0.45;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }
      for (let rad = r * 0.25; rad <= r; rad += r * 0.25) {
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    case 'magic_circle': {
      const r = Math.min(w, h) * 0.44;
      ctx.strokeStyle = '#5eead4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
      ctx.stroke();
      // Hexagram star
      for (let offset = 0; offset < 2; offset++) {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = (offset * Math.PI) / 3 + (i * Math.PI * 2) / 3;
          const x = cx + Math.cos(a) * r * 0.78;
          const y = cy + Math.sin(a) * r * 0.78;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      break;
    }

    case 'portal_gate': {
      const r = Math.min(w, h) * 0.43;
      ctx.fillStyle = '#5c586b';
      ctx.strokeStyle = '#1d1b24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, r * 0.76);
      grad.addColorStop(0, '#f0abfc');
      grad.addColorStop(0.5, '#9333ea');
      grad.addColorStop(1, '#3b0764');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.76, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'alchemy_table': {
      ctx.fillStyle = '#6b4728';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 5);
      ctx.fill();
      ctx.stroke();
      // Potion flasks
      const flasks: [number, number, string][] = [
        [cx - 38, cy - 6, '#ef4444'],
        [cx - 14, cy + 8, '#3b82f6'],
        [cx + 16, cy - 4, '#22c55e'],
        [cx + 42, cy + 6, '#eab308'],
      ];
      for (const [fx, fy, col] of flasks) {
        ctx.fillStyle = col;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(fx, fy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'crystal_cluster':
    case 'crystal_magenta': {
      const isMag = def.id === 'crystal_magenta';
      const main = isMag ? '#d946ef' : '#38bdf8';
      const dark = isMag ? '#86198f' : '#0369a1';
      const shards = [
        [0, -18, 16, 36, -0.2],
        [-16, 6, 14, 28, -0.6],
        [16, 8, 14, 30, 0.5],
        [0, 4, 18, 32, 0.1],
      ];
      for (const [dx, dy, sw, sh, rot] of shards) {
        ctx.save();
        ctx.translate(cx + dx, cy + dy);
        ctx.rotate(rot);
        ctx.fillStyle = main;
        ctx.strokeStyle = dark;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -sh / 2);
        ctx.lineTo(sw / 2, 0);
        ctx.lineTo(0, sh / 2);
        ctx.lineTo(-sw / 2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      break;
    }

    case 'orrery_brass': {
      const r = Math.min(w, h) * 0.42;
      ctx.strokeStyle = '#d4a64a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ffcf59';
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx + r * 0.65, cy, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'books_pile': {
      const books: [number, number, number, string][] = [
        [-6, -4, -0.2, '#7f1d1d'],
        [6, 4, 0.3, '#1e3a8a'],
        [0, -2, 0.05, '#14532d'],
      ];
      for (const [dx, dy, rot, col] of books) {
        ctx.save();
        ctx.translate(cx + dx, cy + dy);
        ctx.rotate(rot);
        ctx.fillStyle = col;
        ctx.strokeStyle = '#d9b35b';
        ctx.lineWidth = 2;
        ctx.fillRect(-18, -14, 36, 28);
        ctx.strokeRect(-18, -14, 36, 28);
        ctx.restore();
      }
      break;
    }

    case 'crates_stack': {
      const boxes = [
        [10, 14, 58, 58],
        [w - 68, 18, 56, 56],
        [cx - 28, cy - 24, 56, 56],
      ];
      for (const [bx, by, bw, bh] of boxes) {
        ctx.fillStyle = '#996f43';
        ctx.strokeStyle = '#2b1b0c';
        ctx.lineWidth = 2.5;
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeRect(bx, by, bw, bh);
      }
      break;
    }

    case 'pottery_jars': {
      const jars = [
        [cx - 18, cy - 6, 16],
        [cx + 16, cy - 8, 15],
        [cx + 2, cy + 14, 17],
      ];
      for (const [jx, jy, jr] of jars) {
        ctx.fillStyle = '#b55d3d';
        ctx.strokeStyle = '#3d1c10';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(jx, jy, jr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#26140c';
        ctx.beginPath();
        ctx.arc(jx, jy, jr * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'chest_open_gold': {
      ctx.fillStyle = '#754926';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 3;
      ctx.fillRect(8, 10, w - 16, h - 20);
      ctx.strokeRect(8, 10, w - 16, h - 20);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(16, 18, w - 32, h - 36);
      break;
    }

    case 'treasure_pile': {
      const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, Math.min(w, h) * 0.45);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.55, '#eab308');
      grad.addColorStop(1, 'rgba(161, 98, 7, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.44, h * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      // Rubies & emeralds
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx - 16, cy - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(cx + 18, cy + 8, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'weapon_rack': {
      ctx.fillStyle = '#5c3c22';
      ctx.strokeStyle = '#211308';
      ctx.lineWidth = 3;
      ctx.fillRect(8, 12, w - 16, h - 24);
      ctx.strokeRect(8, 12, w - 16, h - 24);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      for (let x = 22; x < w - 18; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 8);
        ctx.lineTo(x, h - 8);
        ctx.stroke();
      }
      break;
    }

    case 'armor_stand': {
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.38, h * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'minecart': {
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(12, 10, w - 24, h - 20, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#334155';
      ctx.fillRect(18, 18, w - 36, h - 36);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx - 8, cy - 10, 8, 0, Math.PI * 2);
      ctx.arc(cx + 10, cy + 8, 9, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'tent_red':
    case 'tent_blue': {
      const isBlue = def.id === 'tent_blue';
      const c1 = isBlue ? '#2563eb' : '#b91c1c';
      const c2 = isBlue ? '#1d4ed8' : '#7f1d1d';
      ctx.fillStyle = c1;
      ctx.strokeStyle = '#1e1b18';
      ctx.lineWidth = 3;
      ctx.fillRect(10, 10, cx - 10, h - 20);
      ctx.fillStyle = c2;
      ctx.fillRect(cx, 10, cx - 10, h - 20);
      ctx.strokeRect(10, 10, w - 20, h - 20);
      ctx.beginPath();
      ctx.moveTo(cx, 6);
      ctx.lineTo(cx, h - 6);
      ctx.stroke();
      break;
    }

    case 'tent_pavilion': {
      const r = Math.min(w, h) * 0.45;
      for (let i = 0; i < 12; i++) {
        const a1 = (i * Math.PI * 2) / 12;
        const a2 = ((i + 1) * Math.PI * 2) / 12;
        ctx.fillStyle = i % 2 === 0 ? '#b91c1c' : '#f5f0e1';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, a1, a2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = '#291d12';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'campfire': {
      const r = Math.min(w, h) * 0.4;
      // Ring of stones & logs
      ctx.strokeStyle = '#5c3c20';
      ctx.lineWidth = 8;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }
      const grad = ctx.createRadialGradient(cx, cy, 3, cx, cy, r * 0.85);
      grad.addColorStop(0, '#fff7ad');
      grad.addColorStop(0.5, '#ff7b1c');
      grad.addColorStop(1, 'rgba(200,30,10,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'bedroll': {
      ctx.fillStyle = '#3f6212';
      ctx.strokeStyle = '#1a2e05';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(10, 10, w - 20, h - 20, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d6d3d1';
      ctx.beginPath();
      ctx.roundRect(14, 14, w - 28, 22, 6);
      ctx.fill();
      break;
    }

    case 'wagon_covered': {
      ctx.fillStyle = '#5c3c22';
      ctx.fillRect(6, 24, w - 12, h - 48);
      ctx.fillStyle = '#e7e0ce';
      ctx.strokeStyle = '#3d3529';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(12, 16, w - 24, h - 32, 18);
      ctx.fill();
      ctx.stroke();
      for (let y = 44; y < h - 36; y += 36) {
        ctx.beginPath();
        ctx.moveTo(12, y);
        ctx.lineTo(w - 12, y);
        ctx.stroke();
      }
      break;
    }

    case 'canoe_boat': {
      ctx.fillStyle = '#7c4d28';
      ctx.strokeStyle = '#29170a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, 6);
      ctx.quadraticCurveTo(w - 6, cy, cx, h - 6);
      ctx.quadraticCurveTo(6, cy, cx, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#5c371b';
      ctx.fillRect(22, cy - 34, w - 44, 10);
      ctx.fillRect(22, cy + 24, w - 44, 10);
      break;
    }

    case 'signpost': {
      ctx.fillStyle = '#6e4726';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 2.5;
      ctx.fillRect(cx - 24, cy - 8, 48, 16);
      ctx.strokeRect(cx - 24, cy - 8, 48, 16);
      ctx.fillStyle = '#472c16';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'tree_autumn':
    case 'tree_cherry': {
      const isCherry = def.id === 'tree_cherry';
      const r = Math.min(w, h) * 0.44;
      const puffs = isCherry
        ? [
            { dx: -0.22, dy: -0.18, rr: 0.44, c: '#be185d' },
            { dx: 0.24, dy: -0.14, rr: 0.42, c: '#db2777' },
            { dx: -0.18, dy: 0.24, rr: 0.42, c: '#9d174d' },
            { dx: 0, dy: 0, rr: 0.52, c: '#f472b6' },
            { dx: -0.12, dy: -0.15, rr: 0.32, c: '#fbcfe8' },
          ]
        : [
            { dx: -0.22, dy: -0.18, rr: 0.44, c: '#9a3412' },
            { dx: 0.24, dy: -0.14, rr: 0.42, c: '#c2410c' },
            { dx: -0.18, dy: 0.24, rr: 0.42, c: '#7c2d12' },
            { dx: 0, dy: 0, rr: 0.52, c: '#ea580c' },
            { dx: -0.12, dy: -0.15, rr: 0.32, c: '#f59e0b' },
          ];
      for (const p of puffs) {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(cx + p.dx * r, cy + p.dy * r, p.rr * r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'tree_dead': {
      ctx.strokeStyle = '#4a3728';
      ctx.lineCap = 'round';
      const r = Math.min(w, h) * 0.42;
      for (let i = 0; i < 7; i++) {
        const a = (i * Math.PI * 2) / 7;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const mx = cx + Math.cos(a) * r * 0.6;
        const my = cy + Math.sin(a) * r * 0.6;
        ctx.lineTo(mx, my);
        ctx.stroke();
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(cx + Math.cos(a - 0.3) * r, cy + Math.sin(a - 0.3) * r);
        ctx.moveTo(mx, my);
        ctx.lineTo(cx + Math.cos(a + 0.3) * r, cy + Math.sin(a + 0.3) * r);
        ctx.stroke();
      }
      break;
    }

    case 'tree_palm': {
      const r = Math.min(w, h) * 0.44;
      for (let i = 0; i < 7; i++) {
        const a = (i * Math.PI * 2) / 7;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        ctx.fillStyle = i % 2 === 0 ? '#4d7c0f' : '#65a30d';
        ctx.beginPath();
        ctx.ellipse(r * 0.5, 0, r * 0.48, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'flower_bed': {
      ctx.fillStyle = '#3f6212';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.4, 0, Math.PI * 2);
      ctx.fill();
      const cols = ['#f43f5e', '#fbbf24', '#a855f7', '#38bdf8', '#ffffff'];
      for (let i = 0; i < 14; i++) {
        const a = (i * Math.PI * 2) / 14;
        const rad = (i % 3) * 12 + 8;
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'mushroom_giant': {
      const r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fef2f2';
      for (const [dx, dy, sr] of [
        [-14, -12, 8],
        [14, -8, 7],
        [4, 14, 9],
        [-12, 10, 6],
      ]) {
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'lily_pads': {
      const pads = [
        [cx - 16, cy - 10, 18],
        [cx + 16, cy + 8, 16],
        [cx - 4, cy + 18, 14],
      ];
      for (const [px, py, pr] of pads) {
        ctx.fillStyle = '#4d7c0f';
        ctx.beginPath();
        ctx.arc(px, py, pr, 0.25, Math.PI * 1.9);
        ctx.lineTo(px, py);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(cx - 16, cy - 10, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'fallen_log': {
      ctx.fillStyle = '#634224';
      ctx.strokeStyle = '#241508';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(8, 14, w - 16, h - 28, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4d7c0f';
      ctx.beginPath();
      ctx.arc(cx - 20, cy - 6, 12, 0, Math.PI * 2);
      ctx.arc(cx + 28, cy + 4, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'cactus': {
      ctx.fillStyle = '#15803d';
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.35, 0, Math.PI * 2);
      ctx.arc(cx - 18, cy, 12, 0, Math.PI * 2);
      ctx.arc(cx + 18, cy, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'brazier_teal': {
      const r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 0.75);
      grad.addColorStop(0, '#e0f2fe');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(1, '#0369a1');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.75, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'candelabra':
    case 'chandelier_gold': {
      const r = Math.min(w, h) * 0.42;
      ctx.strokeStyle = '#d4a64a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const lx = cx + Math.cos(a) * r * 0.72;
        const ly = cy + Math.sin(a) * r * 0.72;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(lx, ly, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'crystal_lamp': {
      const r = Math.min(w, h) * 0.36;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 1.15);
      grad.addColorStop(0, '#f0abfc');
      grad.addColorStop(0.5, '#a855f7');
      grad.addColorStop(1, 'rgba(147,51,234,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'market_stall_red':
    case 'market_stall_blue': {
      const isBlue = def.id === 'market_stall_blue';
      const stripe = isBlue ? '#2563eb' : '#b91c1c';
      ctx.fillStyle = '#5c3c22';
      ctx.fillRect(6, 6, w - 12, h - 12);
      const stripes = 6;
      const sw = (w - 16) / stripes;
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? stripe : '#f3ead8';
        ctx.fillRect(8 + i * sw, 8, sw, h - 16);
      }
      ctx.strokeStyle = '#24160b';
      ctx.lineWidth = 3;
      ctx.strokeRect(8, 8, w - 16, h - 16);
      break;
    }

    case 'shop_counter': {
      ctx.fillStyle = '#734b28';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 10, w - 12, h - 20, 4);
      ctx.fill();
      ctx.stroke();
      // Ledger + gold scale
      ctx.fillStyle = '#efe5cc';
      ctx.fillRect(20, cy - 12, 34, 24);
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(w - 38, cy, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'display_case': {
      ctx.fillStyle = '#634123';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.fillRect(6, 8, w - 12, h - 16);
      ctx.strokeRect(6, 8, w - 12, h - 16);
      ctx.fillStyle = 'rgba(147, 197, 253, 0.35)';
      ctx.fillRect(14, 14, w - 28, h - 28);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx - 24, cy, 7, 0, Math.PI * 2);
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.arc(cx + 24, cy, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'cloth_bolts': {
      const colors = ['#b91c1c', '#2563eb', '#15803d', '#a16207'];
      const bw = (w - 20) / colors.length;
      colors.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.strokeStyle = '#1f1a16';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(10 + i * bw, 12, bw - 3, h - 24, 6);
        ctx.fill();
        ctx.stroke();
      });
      break;
    }

    case 'potion_shelf': {
      ctx.fillStyle = '#5c3b20';
      ctx.strokeStyle = '#211308';
      ctx.lineWidth = 3;
      ctx.fillRect(6, 8, w - 12, h - 16);
      ctx.strokeRect(6, 8, w - 12, h - 16);
      const cols = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#eab308', '#06b6d4'];
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath();
        ctx.arc(18 + i * 20, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    // --- Bathroom & Washroom ---
    case 'bathtub_marble': {
      ctx.fillStyle = '#e8e2d5';
      ctx.strokeStyle = '#3d3930';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(8, 8, w - 16, h - 16, 18);
      ctx.fill();
      ctx.stroke();
      // Gold trim inlay
      ctx.strokeStyle = '#d4af53';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(14, 14, w - 28, h - 28, 14);
      ctx.stroke();
      // Clear azure water
      const wg = ctx.createRadialGradient(cx, cy, 8, cx, cy, h * 0.38);
      wg.addColorStop(0, '#8ce6f5');
      wg.addColorStop(0.7, '#3ea4bd');
      wg.addColorStop(1, '#23697d');
      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.roundRect(22, 24, w - 44, h - 48, 22);
      ctx.fill();
      // Floating rose petals & foam
      ctx.fillStyle = '#e11d48';
      for (const [px, py] of [
        [-16, -24],
        [14, -18],
        [-10, 22],
        [18, 28],
        [4, 2],
      ]) {
        ctx.beginPath();
        ctx.ellipse(cx + px, cy + py, 4.5, 3, px * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
      // Golden spout at top
      ctx.fillStyle = '#e0b853';
      ctx.strokeStyle = '#4a380c';
      ctx.lineWidth = 1.8;
      ctx.fillRect(cx - 14, 10, 28, 8);
      ctx.strokeRect(cx - 14, 10, 28, 8);
      ctx.fillRect(cx - 4, 16, 8, 12);
      break;
    }

    case 'privy_wood': {
      // Wooden bench box
      ctx.fillStyle = '#734b28';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(8, 10, w - 16, h - 18, 5);
      ctx.fill();
      ctx.stroke();
      // Plank lines
      ctx.strokeStyle = 'rgba(32,18,8,0.38)';
      ctx.lineWidth = 1.5;
      for (let x = 22; x < w - 16; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, 12);
        ctx.lineTo(x, h - 10);
        ctx.stroke();
      }
      // Hinged wooden backrest / lid at top
      ctx.fillStyle = '#57371c';
      ctx.fillRect(12, 8, w - 24, 14);
      ctx.strokeRect(12, 8, w - 24, 14);
      // Beveled seat ring & dark pit
      ctx.fillStyle = '#8c5e35';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy + 6, w * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#14100d';
      ctx.beginPath();
      ctx.arc(cx, cy + 6, w * 0.17, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'toilet_porcelain': {
      // Oval ceramic bowl
      ctx.fillStyle = '#f0ece1';
      ctx.strokeStyle = '#3c3a35';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, w * 0.34, h * 0.33, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Water inside bowl
      ctx.fillStyle = '#7dd3e8';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12, w * 0.17, h * 0.17, 0, 0, Math.PI * 2);
      ctx.fill();
      // Carved wood seat rim
      ctx.strokeStyle = '#6e4523';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, w * 0.26, h * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Rear porcelain cistern tank
      ctx.fillStyle = '#f7f4eb';
      ctx.strokeStyle = '#3c3a35';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(12, 8, w - 24, 24, 5);
      ctx.fill();
      ctx.stroke();
      // Brass flush lever
      ctx.fillStyle = '#d9b24c';
      ctx.fillRect(w - 22, 14, 10, 5);
      break;
    }

    case 'washbasin_stand': {
      ctx.fillStyle = '#784f2b';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(8, 10, w - 16, h - 20, 5);
      ctx.fill();
      ctx.stroke();
      // Ceramic washbowl with water
      ctx.fillStyle = '#f2eee4';
      ctx.strokeStyle = '#47433c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 10, cy, h * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#6ec8de';
      ctx.beginPath();
      ctx.arc(cx - 10, cy, h * 0.21, 0, Math.PI * 2);
      ctx.fill();
      // Ceramic pitcher & soap
      ctx.fillStyle = '#e8e1cf';
      ctx.beginPath();
      ctx.arc(cx + 24, cy - 6, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f4b8b0';
      ctx.fillRect(cx + 18, cy + 10, 12, 8);
      break;
    }

    case 'sink_stone': {
      ctx.fillStyle = '#8f8a80';
      ctx.strokeStyle = '#2c2a26';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(6, 8, w - 12, h - 16, 5);
      ctx.fill();
      ctx.stroke();
      // Recessed stone water basin
      ctx.fillStyle = '#53aec4';
      ctx.strokeStyle = '#2c2a26';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(18, 22, w - 36, h - 38, 8);
      ctx.fill();
      ctx.stroke();
      // Brass faucet & handles
      ctx.fillStyle = '#deb552';
      ctx.fillRect(cx - 3, 11, 6, 15);
      ctx.beginPath();
      ctx.arc(cx - 14, 15, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 14, 15, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'vanity_mirror': {
      // Wooden dressing table
      ctx.fillStyle = '#734928';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(8, 14, w - 16, h - 24, 8);
      ctx.fill();
      ctx.stroke();
      // Framed mirror strip at back
      ctx.fillStyle = '#b58d3d';
      ctx.fillRect(18, 8, w - 36, 13);
      ctx.strokeRect(18, 8, w - 36, 13);
      ctx.fillStyle = '#a5e2f2';
      ctx.fillRect(24, 11, w - 48, 7);
      // Perfume bottles & brush
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(cx - 26, cy + 6, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(cx - 12, cy + 10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d4a64a';
      ctx.beginPath();
      ctx.ellipse(cx + 22, cy + 8, 10, 6, 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'folding_screen': {
      // 3-panel zig-zag wooden & silk privacy screen
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const pts: [number, number][] = [
        [10, h - 14],
        [w * 0.36, 14],
        [w * 0.64, h - 14],
        [w - 10, 14],
      ];
      ctx.strokeStyle = '#241409';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();

      ctx.strokeStyle = '#d9cfb4';
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.strokeStyle = '#5c3a1e';
      ctx.lineWidth = 3;
      ctx.stroke();
      for (const [px, py] of pts) {
        ctx.fillStyle = '#4a2e16';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'towel_rack': {
      ctx.fillStyle = '#5e3c20';
      ctx.strokeStyle = '#211308';
      ctx.lineWidth = 2.5;
      ctx.fillRect(8, cy - 5, w - 16, 10);
      ctx.strokeRect(8, cy - 5, w - 16, 10);
      // Folded colorful towels draped over rail
      const towels: [number, number, string][] = [
        [16, 26, '#f2eee4'],
        [48, 28, '#3b95ad'],
        [78, 22, '#c9644a'],
      ];
      for (const [tx, tw, col] of towels) {
        if (tx + tw > w - 10) continue;
        ctx.fillStyle = col;
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.lineWidth = 1.8;
        ctx.fillRect(tx, cy - 12, tw, 24);
        ctx.strokeRect(tx, cy - 12, tw, 24);
      }
      break;
    }

    case 'laundry_tub': {
      const r = Math.min(w, h) * 0.43;
      ctx.fillStyle = '#734b28';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#6ec6db';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
      ctx.fill();
      // Soapy foam
      ctx.fillStyle = 'rgba(248,254,255,0.85)';
      for (const [dx, dy, sr] of [
        [-10, -8, 10],
        [8, -12, 8],
        [-6, 10, 9],
      ]) {
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      // Washboard leaning out
      ctx.save();
      ctx.translate(cx + 8, cy + 4);
      ctx.rotate(0.45);
      ctx.fillStyle = '#8c6239';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 2;
      ctx.fillRect(-14, -22, 28, 38);
      ctx.strokeRect(-14, -22, 28, 38);
      ctx.fillStyle = '#aeb6bf';
      ctx.fillRect(-10, -14, 20, 22);
      ctx.restore();
      break;
    }

    case 'chamber_pot': {
      // Ceramic chamber pot on left
      ctx.fillStyle = '#ebe5d8';
      ctx.strokeStyle = '#3b3730';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx - 14, cy + 2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#cfc7b6';
      ctx.beginPath();
      ctx.arc(cx - 14, cy + 2, 10, 0, Math.PI * 2);
      ctx.fill();
      // Wooden water bucket & sponge on right
      ctx.fillStyle = '#734b28';
      ctx.strokeStyle = '#241509';
      ctx.beginPath();
      ctx.arc(cx + 16, cy - 2, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4fa8bd';
      ctx.beginPath();
      ctx.arc(cx + 16, cy - 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(cx + 6, cy + 16, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'sauna_brazier': {
      const r = Math.min(w, h) * 0.43;
      ctx.fillStyle = '#3d4148';
      ctx.strokeStyle = '#16181c';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Warm glowing ember bed beneath stones
      const eg = ctx.createRadialGradient(cx, cy, 4, cx, cy, r * 0.8);
      eg.addColorStop(0, '#ff9d2e');
      eg.addColorStop(1, '#2b221e');
      ctx.fillStyle = eg;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
      // Hot river cobbles
      for (const [dx, dy, sr] of [
        [-14, -12, 11],
        [12, -14, 10],
        [-16, 10, 10],
        [14, 12, 11],
        [0, -2, 12],
        [-2, 16, 9],
      ]) {
        ctx.fillStyle = '#5c5852';
        ctx.strokeStyle = '#262320';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    // --- Village & Farm ---
    case 'village_well_roofed': {
      const r = Math.min(w, h) * 0.4;
      // Cobble well base
      ctx.fillStyle = '#7e7970';
      ctx.strokeStyle = '#262420';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1d4c5e';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
      ctx.fill();
      // Wooden bucket inside
      ctx.fillStyle = '#7c512d';
      ctx.beginPath();
      ctx.arc(cx + 10, cy + 8, 9, 0, Math.PI * 2);
      ctx.fill();
      // Overhead pitched shingle roof canopy
      ctx.fillStyle = '#754829';
      ctx.strokeStyle = '#241409';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(12, cy - 22, w - 24, 44, 4);
      ctx.fill();
      ctx.stroke();
      // Ridge beam
      ctx.fillStyle = '#99643c';
      ctx.fillRect(10, cy - 4, w - 20, 8);
      ctx.strokeRect(10, cy - 4, w - 20, 8);
      break;
    }

    case 'notice_board': {
      // Shingle roof beam + 2 posts
      ctx.fillStyle = '#5e3c20';
      ctx.strokeStyle = '#211308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(10, cy - 10, w - 20, 20, 4);
      ctx.fill();
      ctx.stroke();
      // Posts at ends
      ctx.fillStyle = '#472c16';
      ctx.beginPath();
      ctx.arc(16, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w - 16, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Pinned parchment flyers along front edge
      for (const [px, col] of [
        [34, '#f5ecd4'],
        [62, '#efe0b9'],
        [92, '#f7f2e4'],
        [114, '#f2d9c9'],
      ] as [number, string][]) {
        if (px > w - 28) continue;
        ctx.fillStyle = col;
        ctx.fillRect(px, cy + 7, 16, 6);
      }
      break;
    }

    case 'street_lamppost': {
      // Warm outer lantern glow
      const g = ctx.createRadialGradient(cx + 8, cy, 2, cx + 8, cy, w * 0.44);
      g.addColorStop(0, '#fff7bd');
      g.addColorStop(0.45, 'rgba(255, 174, 56, 0.7)');
      g.addColorStop(1, 'rgba(255, 140, 20, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx + 8, cy, w * 0.44, 0, Math.PI * 2);
      ctx.fill();
      // Iron cross-arm & base post
      ctx.strokeStyle = '#1f242d';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy);
      ctx.lineTo(cx + 14, cy);
      ctx.stroke();
      ctx.fillStyle = '#2f3542';
      ctx.strokeStyle = '#12151c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx - 10, cy, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Glowing lantern head
      ctx.fillStyle = '#fde047';
      ctx.fillRect(cx + 6, cy - 7, 14, 14);
      ctx.strokeRect(cx + 6, cy - 7, 14, 14);
      break;
    }

    case 'water_trough': {
      ctx.fillStyle = '#6e4929';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(8, 12, w - 16, h - 24, 5);
      ctx.fill();
      ctx.stroke();
      const wg = ctx.createLinearGradient(0, 18, 0, h - 18);
      wg.addColorStop(0, '#388ea6');
      wg.addColorStop(0.5, '#64bed4');
      wg.addColorStop(1, '#2b6f82');
      ctx.fillStyle = wg;
      ctx.fillRect(16, 20, w - 32, h - 40);
      // Iron end brackets
      ctx.fillStyle = '#3b3f47';
      ctx.fillRect(8, 12, 8, h - 24);
      ctx.fillRect(w - 16, 12, 8, h - 24);
      break;
    }

    case 'hay_bale_round': {
      const r = Math.min(w, h) * 0.43;
      const hg = ctx.createRadialGradient(cx - 6, cy - 6, 4, cx, cy, r);
      hg.addColorStop(0, '#ebd078');
      hg.addColorStop(0.7, '#cfa848');
      hg.addColorStop(1, '#997528');
      ctx.fillStyle = hg;
      ctx.strokeStyle = '#47340d';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Spiral straw rings & twine
      ctx.strokeStyle = 'rgba(92, 65, 15, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'hay_pile': {
      const tufts = [
        [-18, -8, 34, '#c79e3e'],
        [18, -6, 32, '#cfa848'],
        [-10, 14, 34, '#b88f32'],
        [16, 14, 30, '#d9b554'],
        [0, 0, 38, '#e8c96b'],
      ] as [number, number, number, string][];
      for (const [dx, dy, tr, col] of tufts) {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, tr, 0, Math.PI * 2);
        ctx.fill();
      }
      // Stray golden stalks
      ctx.strokeStyle = '#8f6b1e';
      ctx.lineWidth = 2;
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 14, cy + Math.sin(a) * 14);
        ctx.lineTo(cx + Math.cos(a + 0.2) * 44, cy + Math.sin(a + 0.2) * 38);
        ctx.stroke();
      }
      // Pitchfork resting across haystack
      ctx.strokeStyle = '#5c3b1e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 38, cy + 28);
      ctx.lineTo(cx + 20, cy - 16);
      ctx.stroke();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      for (const off of [-6, 0, 6]) {
        ctx.beginPath();
        ctx.moveTo(cx + 18 + off * 0.6, cy - 14 + off * 0.8);
        ctx.lineTo(cx + 32 + off * 0.6, cy - 25 + off * 0.8);
        ctx.stroke();
      }
      break;
    }

    case 'wheelbarrow': {
      // Front wheel
      ctx.fillStyle = '#3d2817';
      ctx.strokeStyle = '#1a1008';
      ctx.lineWidth = 2;
      ctx.fillRect(cx - 5, 8, 10, 26);
      ctx.strokeRect(cx - 5, 8, 10, 26);
      // Wooden handles extending to bottom
      ctx.strokeStyle = '#6e4726';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - 6, 24);
      ctx.lineTo(18, h - 10);
      ctx.moveTo(cx + 6, 24);
      ctx.lineTo(w - 18, h - 10);
      ctx.stroke();
      // Trapezoidal tray
      ctx.fillStyle = '#875932';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(cx - 18, 30);
      ctx.lineTo(cx + 18, 30);
      ctx.lineTo(w - 14, h - 34);
      ctx.lineTo(14, h - 34);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Soil / vegetables inside
      ctx.fillStyle = '#543d28';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2, 18, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#65a30d';
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 4, 7, 0, Math.PI * 2);
      ctx.arc(cx + 7, cy + 6, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'woodpile_logs': {
      const logs = [
        [14, 16, w - 28, 16],
        [18, 32, w - 36, 16],
        [12, 48, w - 24, 16],
        [20, 24, w - 40, 15],
        [16, 40, w - 32, 15],
      ];
      for (const [lx, ly, lw, lh] of logs) {
        if (ly + lh > h - 8) continue;
        ctx.fillStyle = '#6b4526';
        ctx.strokeStyle = '#241509';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.roundRect(lx, ly, lw, lh, 6);
        ctx.fill();
        ctx.stroke();
        // Pale cut log ends
        ctx.fillStyle = '#cfa976';
        ctx.beginPath();
        ctx.arc(lx + 6, ly + lh / 2, lh * 0.36, 0, Math.PI * 2);
        ctx.arc(lx + lw - 6, ly + lh / 2, lh * 0.36, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'chopping_block': {
      const r = Math.min(w, h) * 0.38;
      // Scattered wood chips
      ctx.fillStyle = '#cfa976';
      for (const [dx, dy] of [
        [-28, 18],
        [26, 20],
        [-22, -24],
        [24, -18],
      ]) {
        ctx.fillRect(cx + dx, cy + dy, 8, 4);
      }
      // Stump
      ctx.fillStyle = '#5e3e24';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#c49d68';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
      ctx.fill();
      // Embedded axe
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.55);
      ctx.fillStyle = '#734926';
      ctx.strokeStyle = '#1f1208';
      ctx.lineWidth = 2;
      ctx.fillRect(-4, -6, 8, 38);
      ctx.strokeRect(-4, -6, 8, 38);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(-14, -14);
      ctx.lineTo(12, -10);
      ctx.lineTo(12, 2);
      ctx.lineTo(-14, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'vegetable_patch': {
      // Tilled soil bed
      ctx.fillStyle = '#4a3522';
      ctx.strokeStyle = '#261a10';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(8, 8, w - 16, h - 16, 8);
      ctx.fill();
      ctx.stroke();
      // Furrow rows & crops
      const rows = 3;
      for (let r = 0; r < rows; r++) {
        const ry = 28 + r * ((h - 56) / (rows - 1));
        ctx.strokeStyle = '#362516';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(22, ry);
        ctx.lineTo(w - 22, ry);
        ctx.stroke();

        for (let x = 30; x <= w - 30; x += 28) {
          ctx.fillStyle = r === 1 ? '#ea580c' : '#4d7c0f';
          ctx.strokeStyle = '#1a2e05';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(x, ry, r === 1 ? 9 : 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#84cc16';
          ctx.beginPath();
          ctx.arc(x - 2, ry - 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    case 'scarecrow': {
      // Cross arms pole
      ctx.strokeStyle = '#5c3c20';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(12, cy);
      ctx.lineTo(w - 12, cy);
      ctx.stroke();
      // Straw cuffs at ends
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(8, cy - 6);
      ctx.lineTo(16, cy + 6);
      ctx.moveTo(w - 8, cy - 6);
      ctx.lineTo(w - 16, cy + 6);
      ctx.stroke();
      // Burlap shoulders
      ctx.fillStyle = '#8a5a36';
      ctx.strokeStyle = '#29180b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.28, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Wide straw hat at center
      ctx.fillStyle = '#d9b455';
      ctx.strokeStyle = '#47350d';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'clothesline': {
      // Rope line
      ctx.strokeStyle = '#c2b28f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(14, cy);
      ctx.lineTo(w - 14, cy);
      ctx.stroke();
      // Billowing hung garments
      const clothes: [number, number, string][] = [
        [32, 34, '#f8fafc'],
        [76, 30, '#38bdf8'],
        [118, 36, '#f43f5e'],
        [164, 30, '#fde047'],
      ];
      for (const [lx, lw, col] of clothes) {
        if (lx + lw > w - 20) continue;
        ctx.fillStyle = col;
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(lx, cy);
        ctx.lineTo(lx + lw, cy);
        ctx.quadraticCurveTo(lx + lw + 6, cy + 18, lx + lw - 4, cy + 20);
        ctx.lineTo(lx + 4, cy + 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      // End wooden poles
      for (const px of [14, w - 14]) {
        ctx.fillStyle = '#5c3c20';
        ctx.strokeStyle = '#211308';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(px, cy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'chicken_coop': {
      // Cleated ramp sticking out bottom
      ctx.fillStyle = '#8c6239';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 2;
      ctx.fillRect(cx - 12, h - 34, 24, 28);
      ctx.strokeRect(cx - 12, h - 34, 24, 28);
      // Pitched wooden roof
      ctx.fillStyle = '#7c4a27';
      ctx.strokeStyle = '#241409';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(12, 10, w - 24, h - 36, 5);
      ctx.fill();
      ctx.stroke();
      // Roof ridge & plank lines
      ctx.fillStyle = '#5c3419';
      ctx.fillRect(10, (h - 26) / 2 - 4, w - 20, 8);
      // Straw nest box on side
      ctx.fillStyle = '#e0bd5a';
      ctx.fillRect(w - 22, 24, 14, 28);
      ctx.strokeRect(w - 22, 24, 14, 28);
      break;
    }

    case 'doghouse': {
      // White bone in front
      ctx.fillStyle = '#f5f2eb';
      ctx.strokeStyle = '#47433b';
      ctx.lineWidth = 1.6;
      ctx.fillRect(cx + 12, h - 20, 16, 5);
      ctx.strokeRect(cx + 12, h - 20, 16, 5);
      // Pitched terracotta shingle roof
      ctx.fillStyle = '#9c3b2b';
      ctx.strokeStyle = '#2b120d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(12, 12, w - 24, h - 32, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#73281c';
      ctx.fillRect(cx - 4, 10, 8, h - 28);
      break;
    }

    case 'beehive_skep': {
      const r = Math.min(w, h) * 0.42;
      // Wooden base square
      ctx.fillStyle = '#6e4929';
      ctx.strokeStyle = '#241509';
      ctx.lineWidth = 2.5;
      ctx.fillRect(10, 10, w - 20, h - 20);
      ctx.strokeRect(10, 10, w - 20, h - 20);
      // Golden woven straw dome
      ctx.fillStyle = '#deb549';
      ctx.strokeStyle = '#4a360b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const rr of [0.6, 0.35]) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * rr, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = '#6e4910';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'pillory_stocks': {
      // Wooden platform
      ctx.fillStyle = '#6b4728';
      ctx.strokeStyle = '#241409';
      ctx.lineWidth = 2.5;
      ctx.fillRect(10, 12, w - 20, h - 24);
      ctx.strokeRect(10, 12, w - 20, h - 24);
      // Heavy top beam with head & hand holes
      ctx.fillStyle = '#8c5e35';
      ctx.fillRect(8, cy - 8, w - 16, 16);
      ctx.strokeRect(8, cy - 8, w - 16, 16);
      ctx.fillStyle = '#1a120b';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.arc(cx - 24, cy, 4.5, 0, Math.PI * 2);
      ctx.arc(cx + 24, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'fruit_crates': {
      const crates: [number, number, number, string][] = [
        [10, 12, -0.08, '#dc2626'], // Red apples
        [cx - 4, 18, 0.1, '#f97316'], // Oranges
        [24, cy - 2, 0.04, '#65a30d'], // Green pears/cabbages
      ];
      for (const [bx, by, rot, fruitCol] of crates) {
        ctx.save();
        ctx.translate(bx + 26, by + 22);
        ctx.rotate(rot);
        ctx.fillStyle = '#855832';
        ctx.strokeStyle = '#241509';
        ctx.lineWidth = 2.5;
        ctx.fillRect(-26, -20, 52, 40);
        ctx.strokeRect(-26, -20, 52, 40);
        for (let fx = -16; fx <= 16; fx += 11) {
          for (let fy = -10; fy <= 10; fy += 10) {
            ctx.fillStyle = fruitCol;
            ctx.beginPath();
            ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }
      break;
    }

    // --- Fences & Enclosures ---
    case 'fence_wood_straight':
    case 'fence_wood_short': {
      // Horizontal rails
      ctx.fillStyle = '#8c5e35';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 2.5;
      ctx.fillRect(4, cy - 6, w - 8, 12);
      ctx.strokeRect(4, cy - 6, w - 8, 12);
      // Square timber posts
      const posts = def.id === 'fence_wood_short' ? [10, w - 10] : [10, cx, w - 10];
      for (const px of posts) {
        ctx.fillStyle = '#633f20';
        ctx.fillRect(px - 8, cy - 10, 16, 20);
        ctx.strokeRect(px - 8, cy - 10, 16, 20);
      }
      break;
    }

    case 'fence_wood_corner': {
      ctx.fillStyle = '#8c5e35';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 2.5;
      // Horizontal arm right + vertical arm down from corner (cx, cy)
      ctx.fillRect(cx - 6, cy - 6, w - cx, 12);
      ctx.strokeRect(cx - 6, cy - 6, w - cx, 12);
      ctx.fillRect(cx - 6, cy - 6, 12, h - cy);
      ctx.strokeRect(cx - 6, cy - 6, 12, h - cy);
      for (const [px, py] of [
        [cx, cy],
        [w - 12, cy],
        [cx, h - 12],
      ]) {
        ctx.fillStyle = '#633f20';
        ctx.fillRect(px - 9, py - 9, 18, 18);
        ctx.strokeRect(px - 9, py - 9, 18, 18);
      }
      break;
    }

    case 'fence_gate_wood': {
      // Swing gate leaf slightly angled
      ctx.save();
      ctx.translate(18, cy);
      ctx.rotate(0.14);
      ctx.fillStyle = '#996a3e';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 2.5;
      ctx.fillRect(0, -5, w - 38, 10);
      ctx.strokeRect(0, -5, w - 38, 10);
      // Iron hinge strap
      ctx.fillStyle = '#3f444d';
      ctx.fillRect(2, -3, 24, 6);
      ctx.restore();
      // Heavy gateposts left & right
      for (const px of [14, w - 14]) {
        ctx.fillStyle = '#5c3a1d';
        ctx.strokeStyle = '#1f1208';
        ctx.lineWidth = 2.8;
        ctx.fillRect(px - 10, cy - 11, 20, 22);
        ctx.strokeRect(px - 10, cy - 11, 20, 22);
      }
      break;
    }

    case 'fence_picket_white': {
      ctx.fillStyle = '#cfc7b4';
      ctx.strokeStyle = '#3b352c';
      ctx.lineWidth = 2;
      ctx.fillRect(4, cy - 4, w - 8, 8);
      ctx.strokeRect(4, cy - 4, w - 8, 8);
      for (let x = 10; x <= w - 10; x += 14) {
        ctx.fillStyle = '#f2ede1';
        ctx.fillRect(x - 4, cy - 9, 8, 18);
        ctx.strokeRect(x - 4, cy - 9, 8, 18);
      }
      break;
    }

    case 'fence_iron_straight': {
      // Iron rail
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.fillRect(8, cy - 3, w - 16, 6);
      ctx.strokeRect(8, cy - 3, w - 16, 6);
      // Forged vertical spear bars
      for (let x = 26; x <= w - 26; x += 14) {
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(x, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      // Stone end pillars
      for (const px of [12, w - 12]) {
        ctx.fillStyle = '#8c877d';
        ctx.strokeStyle = '#292723';
        ctx.lineWidth = 2.5;
        ctx.fillRect(px - 9, cy - 10, 18, 20);
        ctx.strokeRect(px - 9, cy - 10, 18, 20);
      }
      break;
    }

    case 'fence_iron_gate': {
      // Double wrought-iron leaves slightly parted
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(side < 0 ? 18 : w - 18, cy);
        ctx.rotate(side < 0 ? 0.16 : -0.16);
        const len = cx - 20;
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.fillRect(side < 0 ? 0 : -len, -4, len, 8);
        ctx.strokeRect(side < 0 ? 0 : -len, -4, len, 8);
        ctx.restore();
      }
      // Stone gate piers with brass finials
      for (const px of [14, w - 14]) {
        ctx.fillStyle = '#8c877d';
        ctx.strokeStyle = '#292723';
        ctx.lineWidth = 2.5;
        ctx.fillRect(px - 10, cy - 12, 20, 24);
        ctx.strokeRect(px - 10, cy - 12, 20, 24);
        ctx.fillStyle = '#d4af53';
        ctx.beginPath();
        ctx.arc(px, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'fence_palisade_logs': {
      for (let x = 14; x <= w - 14; x += 18) {
        ctx.fillStyle = '#5e3c20';
        ctx.strokeStyle = '#211308';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, cy, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#c29b65';
        ctx.beginPath();
        ctx.arc(x, cy, 6.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'fence_rope_posts': {
      ctx.strokeStyle = '#bfa675';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(14, cy);
      ctx.quadraticCurveTo(cx * 0.5 + 7, cy + 7, cx, cy);
      ctx.quadraticCurveTo(cx * 1.5 - 7, cy + 7, w - 14, cy);
      ctx.stroke();
      for (const px of [14, cx, w - 14]) {
        ctx.fillStyle = '#633f20';
        ctx.strokeStyle = '#211308';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(px, cy, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'hitching_post': {
      ctx.fillStyle = '#784e29';
      ctx.strokeStyle = '#241408';
      ctx.lineWidth = 2.8;
      ctx.fillRect(10, cy - 5, w - 20, 10);
      ctx.strokeRect(10, cy - 5, w - 20, 10);
      // Iron hitching rings & coiled rope
      for (const rx of [w * 0.34, w * 0.66]) {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(rx, cy + 9, 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (const px of [16, w - 16]) {
        ctx.fillStyle = '#57361a';
        ctx.strokeStyle = '#1f1208';
        ctx.fillRect(px - 8, cy - 10, 16, 20);
        ctx.strokeRect(px - 8, cy - 10, 16, 20);
      }
      break;
    }

    // --- Animals & Creatures (top-down facing -Y / up, rotatable) ---
    case 'horse_brown':
    case 'horse_white':
    case 'draft_mule': {
      const isWhite = def.id === 'horse_white';
      const isMule = def.id === 'draft_mule';
      const coat = isWhite ? '#e5e2dc' : isMule ? '#9c7c58' : '#784726';
      const mane = isWhite ? '#9ca3af' : '#26170c';
      const outline = '#1f140b';

      // Flowing tail at bottom
      ctx.fillStyle = mane;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 6, h * 0.78);
      ctx.quadraticCurveTo(cx - 12, h * 0.92, cx, h - 8);
      ctx.quadraticCurveTo(cx + 12, h * 0.92, cx + 6, h * 0.78);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Torso / barrel
      ctx.fillStyle = coat;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12, w * 0.3, h * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Saddle or cargo packs
      if (isMule) {
        for (const side of [-1, 1]) {
          ctx.fillStyle = '#b59a6d';
          ctx.strokeStyle = '#3b2e1b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(cx + side * 22 - 11, cy - 6, 22, 34, 6);
          ctx.fill();
          ctx.stroke();
        }
        ctx.fillStyle = '#6b4423';
        ctx.fillRect(cx - 24, cy + 6, 48, 8);
      } else {
        ctx.fillStyle = isWhite ? '#2c4c70' : '#4a2c16';
        ctx.strokeStyle = outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx - w * 0.24, cy - 4, w * 0.48, 30, 6);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#d4af53';
        ctx.strokeRect(cx - w * 0.18, cy + 1, w * 0.36, 20);
      }

      // Neck & head reaching upward
      ctx.fillStyle = coat;
      ctx.strokeStyle = outline;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(cx - 13, cy - 18);
      ctx.lineTo(cx - 9, 24);
      ctx.quadraticCurveTo(cx, 10, cx + 9, 24);
      ctx.lineTo(cx + 13, cy - 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ears (longer for mule!)
      const earLen = isMule ? 15 : 9;
      for (const side of [-1, 1]) {
        ctx.fillStyle = coat;
        ctx.beginPath();
        ctx.ellipse(cx + side * 9, 26, 3.8, earLen, side * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Mane strip along neck
      ctx.strokeStyle = mane;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, 26);
      ctx.lineTo(cx, cy - 8);
      ctx.stroke();
      break;
    }

    case 'cow_spotted': {
      // Tail
      ctx.strokeStyle = '#29221c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.8);
      ctx.quadraticCurveTo(cx + 8, h * 0.9, cx + 4, h - 8);
      ctx.stroke();

      // Plump white body
      ctx.fillStyle = '#f2ede2';
      ctx.strokeStyle = '#241e19';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, w * 0.34, h * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Spotted patches clipped to body
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, w * 0.33, h * 0.29, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#332820';
      ctx.beginPath();
      ctx.arc(cx - 16, cy - 4, 18, 0, Math.PI * 2);
      ctx.arc(cx + 18, cy + 16, 20, 0, Math.PI * 2);
      ctx.arc(cx - 8, cy + 32, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Horns & ears
      for (const side of [-1, 1]) {
        ctx.strokeStyle = '#dfd5be';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx + side * 12, 32);
        ctx.quadraticCurveTo(cx + side * 24, 24, cx + side * 20, 14);
        ctx.stroke();

        ctx.fillStyle = '#332820';
        ctx.beginPath();
        ctx.ellipse(cx + side * 16, 36, 7, 4, side * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cow head & pink muzzle
      ctx.fillStyle = '#f2ede2';
      ctx.strokeStyle = '#241e19';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, 32, 14, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f2b6b6';
      ctx.beginPath();
      ctx.ellipse(cx, 19, 10, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'pig_pink': {
      // Curly pink tail
      ctx.strokeStyle = '#d98292';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx + 3, h - 14, 5, 0, Math.PI * 1.6);
      ctx.stroke();
      // Plump body
      ctx.fillStyle = '#f0a8b4';
      ctx.strokeStyle = '#4a252c';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 6, w * 0.35, h * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Head, snout & floppy ears
      ctx.beginPath();
      ctx.arc(cx, 28, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e38898';
      ctx.beginPath();
      ctx.ellipse(cx, 14, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#e895a4';
        ctx.beginPath();
        ctx.ellipse(cx + side * 12, 26, 7, 4.5, side * -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'sheep_woolly': {
      // Fluffy scalloped cream fleece puffs
      const puffs = [
        [0, 14, 20],
        [-12, 4, 16],
        [12, 4, 16],
        [-12, 22, 15],
        [12, 22, 15],
        [0, -4, 17],
        [0, 30, 15],
      ];
      ctx.fillStyle = '#ede7d8';
      ctx.strokeStyle = '#3d3932';
      ctx.lineWidth = 2.2;
      for (const [dx, dy, pr] of puffs) {
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, pr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#f7f3e8';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12, 20, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      // Dark head & horizontal ears
      ctx.fillStyle = '#2e2b29';
      ctx.strokeStyle = '#141210';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(cx + side * 14, 26, 7, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.ellipse(cx, 24, 10, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'goat_horned': {
      ctx.fillStyle = '#bfa98e';
      ctx.strokeStyle = '#2e251c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, w * 0.28, h * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Head
      ctx.beginPath();
      ctx.ellipse(cx, 26, 9, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Swept-back curved horns
      ctx.strokeStyle = '#474038';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + side * 4, 24);
        ctx.quadraticCurveTo(cx + side * 16, 30, cx + side * 14, 44);
        ctx.stroke();
      }
      break;
    }

    case 'chickens_flock': {
      const birds: [number, number, number, string][] = [
        [cx - 18, cy - 12, -0.4, '#f5f2eb'],
        [cx + 18, cy - 4, 0.8, '#9c5a32'],
        [cx - 4, cy + 18, 2.1, '#d97736'],
      ];
      for (const [bx, by, rot, col] of birds) {
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(rot);
        // Yellow beak
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(-3, -12);
        ctx.lineTo(0, -18);
        ctx.lineTo(3, -12);
        ctx.closePath();
        ctx.fill();
        // Plump chicken body
        ctx.fillStyle = col;
        ctx.strokeStyle = '#291c12';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Red comb on head
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.ellipse(0, -8, 3, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      break;
    }

    case 'dog_hound': {
      // Wagging tail
      ctx.strokeStyle = '#7c4d28';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.76);
      ctx.quadraticCurveTo(cx + 10, h * 0.88, cx + 6, h - 10);
      ctx.stroke();
      // Hound body
      ctx.fillStyle = '#9c6334';
      ctx.strokeStyle = '#26160a';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 6, w * 0.28, h * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Red collar
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx - 9, 34);
      ctx.lineTo(cx + 9, 34);
      ctx.stroke();
      // Floppy dark ears & head
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#4f2f16';
        ctx.beginPath();
        ctx.ellipse(cx + side * 11, 26, 4.5, 8, side * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#9c6334';
      ctx.strokeStyle = '#26160a';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(cx, 23, 9, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#17120e';
      ctx.beginPath();
      ctx.arc(cx, 12, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'cat_tabby': {
      // S-curved feline tail
      ctx.strokeStyle = '#c26a27';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.72);
      ctx.bezierCurveTo(cx + 16, h * 0.82, cx - 10, h * 0.92, cx + 8, h - 8);
      ctx.stroke();
      // Sleek orange tabby body
      ctx.fillStyle = '#d97b29';
      ctx.strokeStyle = '#2e1808';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, w * 0.27, h * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Tabby stripes
      ctx.strokeStyle = '#7c3f10';
      ctx.lineWidth = 2;
      for (const sy of [cy - 4, cy + 4, cy + 12]) {
        ctx.beginPath();
        ctx.moveTo(cx - 9, sy);
        ctx.lineTo(cx + 9, sy);
        ctx.stroke();
      }
      // Cat head & pointed ears
      ctx.fillStyle = '#d97b29';
      ctx.strokeStyle = '#2e1808';
      ctx.beginPath();
      ctx.arc(cx, 22, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + side * 3, 15);
        ctx.lineTo(cx + side * 10, 10);
        ctx.lineTo(cx + side * 9, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'wolf_grey': {
      // Bushy tail
      ctx.fillStyle = '#525863';
      ctx.strokeStyle = '#181b20';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(cx, h - 22, 7, 16, 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Lean wolf torso
      ctx.fillStyle = '#6b7280';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 6, w * 0.28, h * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Dark silver dorsal coat
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, w * 0.16, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      // Pointed head, snout & ears
      ctx.fillStyle = '#6b7280';
      ctx.beginPath();
      ctx.moveTo(cx - 11, 34);
      ctx.lineTo(cx, 10);
      ctx.lineTo(cx + 11, 34);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.arc(cx + side * 8, 32, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'bear_brown': {
      // Live grizzly bear from above
      ctx.fillStyle = '#5c3a21';
      ctx.strokeStyle = '#1f1208';
      ctx.lineWidth = 3;
      // Heavy body & broad shoulders
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12, w * 0.36, h * 0.33, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 12, w * 0.38, h * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Round ears
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#472b17';
        ctx.beginPath();
        ctx.arc(cx + side * 18, 34, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      // Bear head & tan muzzle
      ctx.fillStyle = '#694226';
      ctx.beginPath();
      ctx.ellipse(cx, 30, 19, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#a67c56';
      ctx.beginPath();
      ctx.ellipse(cx, 16, 9, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#140f0c';
      ctx.beginPath();
      ctx.arc(cx, 10, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'deer_stag': {
      // White-tipped tail
      ctx.fillStyle = '#f5f0e6';
      ctx.beginPath();
      ctx.ellipse(cx, h - 14, 5, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Reddish-fawn body
      ctx.fillStyle = '#9c6238';
      ctx.strokeStyle = '#29170b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 16, w * 0.27, h * 0.27, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Branching antlers!
      ctx.strokeStyle = '#d6c7a9';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + side * 5, 34);
        ctx.quadraticCurveTo(cx + side * 26, 26, cx + side * 22, 10);
        ctx.moveTo(cx + side * 15, 27);
        ctx.lineTo(cx + side * 12, 14);
        ctx.moveTo(cx + side * 20, 20);
        ctx.lineTo(cx + side * 30, 16);
        ctx.stroke();
        // Ears
        ctx.fillStyle = '#85502b';
        ctx.beginPath();
        ctx.ellipse(cx + side * 13, 38, 7, 3.5, side * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      // Slender head
      ctx.fillStyle = '#9c6238';
      ctx.strokeStyle = '#29170b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(cx, 32, 9, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'boar_wild': {
      // White curved tusks protruding forward!
      ctx.strokeStyle = '#f5efe1';
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + side * 8, 26);
        ctx.quadraticCurveTo(cx + side * 18, 18, cx + side * 13, 11);
        ctx.stroke();
      }
      // Stocky bristled dark body
      ctx.fillStyle = '#4a3525';
      ctx.strokeStyle = '#1a110b';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 8, w * 0.35, h * 0.33, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Conical head & snout
      ctx.beginPath();
      ctx.moveTo(cx - 16, 40);
      ctx.lineTo(cx - 7, 14);
      ctx.lineTo(cx + 7, 14);
      ctx.lineTo(cx + 16, 40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Dark dorsal bristle stripe
      ctx.strokeStyle = '#241810';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, 26);
      ctx.lineTo(cx, h - 22);
      ctx.stroke();
      break;
    }

    default: {
      // Fallback rich medallion sprite
      const r = Math.min(w, h) * 0.4;
      ctx.fillStyle = '#8b6f47';
      ctx.strokeStyle = '#291d10';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
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
