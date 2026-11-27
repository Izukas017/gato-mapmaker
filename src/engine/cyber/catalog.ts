// Names of the CyberGato-only surfaces, walls, doors and paths. Every id starts with `cy_`,
// which is how the editor tells them apart from the classic Gato MapMaker content.

export type CyberId = `cy_${string}`;

export const isCyber = (id: string | null | undefined) => !!id && id.startsWith('cy_');

interface Entry {
  id: CyberId;
  name: string;
}

export const CYBER_TERRAIN: Entry[] = [
  { id: 'cy_asphalt', name: 'Asfalto' },
  { id: 'cy_asphalt_wet', name: 'Asfalto Mojado (Neón)' },
  { id: 'cy_oil_ground', name: 'Charcos de Aceite' },
  { id: 'cy_concrete', name: 'Hormigón' },
  { id: 'cy_concrete_cracked', name: 'Hormigón Agrietado' },
  { id: 'cy_sidewalk', name: 'Acera de Losas' },
  { id: 'cy_rubble_lot', name: 'Solar de Escombros' },
  { id: 'cy_scrap_ground', name: 'Suelo de Chatarra' },
  { id: 'cy_rust_dirt', name: 'Tierra Oxidada' },
  { id: 'cy_toxic_sludge', name: 'Lodo Tóxico' },
  { id: 'cy_turf', name: 'Césped Artificial' },
  { id: 'cy_wasteland', name: 'Yermo Contaminado' },
  { id: 'cy_slush', name: 'Nieve Sucia' },
  { id: 'cy_ash', name: 'Ceniza y Brasas' },
];

export const CYBER_FLOORS: Entry[] = [
  { id: 'cy_metal_grate', name: 'Rejilla Metálica' },
  { id: 'cy_diamond_plate', name: 'Chapa Lagrimada' },
  { id: 'cy_neon_tile_purple', name: 'Baldosa Neón Morado' },
  { id: 'cy_neon_tile_cyan', name: 'Baldosa Neón Cian' },
  { id: 'cy_neon_tile_pink', name: 'Baldosa Neón Rosa' },
  { id: 'cy_hex_tech', name: 'Hexágonos Tech' },
  { id: 'cy_circuit', name: 'Placa de Circuito' },
  { id: 'cy_glass_floor', name: 'Suelo de Cristal' },
  { id: 'cy_carbon', name: 'Fibra de Carbono' },
  { id: 'cy_rubber_mat', name: 'Goma Antideslizante' },
  { id: 'cy_epoxy_white', name: 'Epoxi Clínica' },
  { id: 'cy_concrete_polished', name: 'Hormigón Pulido' },
  { id: 'cy_laminate_dark', name: 'Laminado Oscuro' },
  { id: 'cy_parquet_dark', name: 'Parqué Ébano' },
  { id: 'cy_vinyl_checker', name: 'Damero Diner' },
  { id: 'cy_dance_floor', name: 'Pista de Baile' },
  { id: 'cy_raised_floor', name: 'Suelo Técnico Servidores' },
  { id: 'cy_garage_floor', name: 'Suelo de Garaje' },
  { id: 'cy_bathroom_tile', name: 'Azulejo de Baño' },
  { id: 'cy_holo_floor', name: 'Suelo Holográfico' },
  { id: 'cy_rusty_plates', name: 'Planchas Oxidadas' },
  { id: 'cy_carpet_office', name: 'Moqueta de Oficina' },
];

export const CYBER_ROOFS: Entry[] = [
  { id: 'cy_solar', name: 'Paneles Solares' },
  { id: 'cy_tar_roof', name: 'Tela Asfáltica' },
  { id: 'cy_corrugated', name: 'Chapa Ondulada' },
  { id: 'cy_green_roof', name: 'Azotea Ajardinada' },
  { id: 'cy_roof_concrete', name: 'Azotea de Hormigón' },
  { id: 'cy_glass_roof', name: 'Lucernario de Cristal' },
  { id: 'cy_rusty_sheet', name: 'Chapa Oxidada' },
  { id: 'cy_neon_trim', name: 'Pizarra con Neón' },
  { id: 'cy_gravel_roof', name: 'Azotea de Grava' },
  { id: 'cy_vent_roof', name: 'Azotea de Ventiladores' },
];

export const CYBER_WALLS: Entry[] = [
  { id: 'cy_concrete_wall', name: 'Hormigón Armado' },
  { id: 'cy_steel_panel', name: 'Panel de Acero' },
  { id: 'cy_neon_purple', name: 'Muro Neón Morado' },
  { id: 'cy_neon_cyan', name: 'Muro Neón Cian' },
  { id: 'cy_neon_pink', name: 'Muro Neón Rosa' },
  { id: 'cy_glass_curtain', name: 'Muro Cortina Cristal' },
  { id: 'cy_brick_graffiti', name: 'Ladrillo con Grafiti' },
  { id: 'cy_chainlink', name: 'Valla Metálica' },
  { id: 'cy_corrugated_wall', name: 'Chapa Ondulada' },
  { id: 'cy_hazard', name: 'Franjas de Peligro' },
  { id: 'cy_tech_panel', name: 'Panel Tecnológico' },
  { id: 'cy_rusted_sheet', name: 'Chapa Oxidada' },
  { id: 'cy_laser_fence', name: 'Barrera Láser' },
  { id: 'cy_container_wall', name: 'Contenedores' },
  { id: 'cy_jersey_barrier', name: 'Barrera New Jersey' },
  { id: 'cy_server_wall', name: 'Racks de Servidores' },
];

export const CYBER_PORTALS: { id: CyberId; label: string }[] = [
  { id: 'cy_sliding', label: 'Puerta Corredera' },
  { id: 'cy_blast', label: 'Compuerta Blindada' },
  { id: 'cy_shutter', label: 'Persiana Metálica' },
  { id: 'cy_airlock', label: 'Esclusa' },
  { id: 'cy_glass_door', label: 'Puerta de Cristal' },
  { id: 'cy_holo_door', label: 'Puerta Holográfica' },
  { id: 'cy_garage', label: 'Puerta de Garaje' },
  { id: 'cy_turnstile', label: 'Torniquetes' },
  { id: 'cy_neon_window', label: 'Ventana Neón' },
  { id: 'cy_slit_window', label: 'Aspillera Blindada' },
];

export const CYBER_PATHS: { id: CyberId; label: string }[] = [
  { id: 'cy_road', label: 'Carretera 2 Carriles' },
  { id: 'cy_avenue', label: 'Avenida 4 Carriles' },
  { id: 'cy_highway', label: 'Autopista Elevada' },
  { id: 'cy_sidewalk_path', label: 'Acera' },
  { id: 'cy_crosswalk', label: 'Paso de Cebra' },
  { id: 'cy_bike_lane', label: 'Carril Bici' },
  { id: 'cy_alley', label: 'Callejón Mojado' },
  { id: 'cy_tram', label: 'Vías de Tranvía' },
  { id: 'cy_maglev', label: 'Riel Maglev' },
  { id: 'cy_neon_strip', label: 'Tira de Neón' },
  { id: 'cy_cables', label: 'Mazo de Cables' },
  { id: 'cy_pipeline', label: 'Tubería Industrial' },
  { id: 'cy_conveyor', label: 'Cinta Transportadora' },
  { id: 'cy_toxic_canal', label: 'Canal Tóxico' },
  { id: 'cy_holo_barrier', label: 'Barrera Holográfica' },
  { id: 'cy_laser_line', label: 'Haz Láser' },
];
