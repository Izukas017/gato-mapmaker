# Gato MapMaker (`v0.1.1`)

Editor de mapas tácticos para juegos de rol de mesa (D&D, Pathfinder, etc.) inspirado en el flujo de trabajo de **Dungeondraft**, ejecutándose directamente en el navegador con guardado automático local e iluminación dinámica con sombras en tiempo real.

🌐 **Usar online ahora:** https://izukas017.github.io/gato-mapmaker/

---

## Capturas de pantalla

### Santuario del Patio (Templo e iluminación con sombras)
![Editor Gato MapMaker con el mapa Santuario del Patio](docs/images/sanctuary-editor.png)

### Barrio Empedrado (Distrito urbano con tejados y faroles)
![Distrito urbano Barrio Empedrado con luces cálidas](docs/images/cobblestone-quarter.png)

### Biblioteca de Objetos y Mobiliario
![Panel de biblioteca de objetos top-down](docs/images/prop-library.png)

---

## Características principales

- **Guardado automático:** al abrir la página se carga automáticamente el último mapa que estabas editando (o un lienzo en blanco si es tu primera vez).
- **10 herramientas de diseño:**
  - **Selección (`V`):** mover, rotar, escalar, duplicar (`Ctrl+D`), borrar (`Supr`) y editar propiedades.
  - **Pincel de Terreno (`T`):** 8 materiales procedimentales sin costuras (tierra, hierba, adoquín, losa, musgo, arena, barro, nieve) con radio, opacidad y suavidad ajustables.
  - **Pincel de Agua (`W`):** pintura continua con orilla y espuma automática + modo borrador.
  - **Edificios y Suelos (`B`):** modo rectángulo o polígono libre con 8 patrones de suelo (tablones, espiga, mosaico de templo, pizarra, mármol, nogal, tapiz) y muros perimetrales.
  - **Muros Libres (`L`):** trazado poligonal con 5 estilos (piedra labrada, madera, mampostería, ladrillo, muro dorado) que bloquean la luz.
  - **Puertas y Ventanas (`P`):** encaje automático sobre muros; las puertas abiertas y ventanas dejan pasar la luz.
  - **Caminos y Senderos (`H`):** curvas suavizadas (tierra, calzada, puente, alfombras, setos, acantilados).
  - **Objetos y Mobiliario (`O`):** 35 props top-down integrados, pincel de dispersión para bosques, rotación con `Shift + Rueda` e importador de imágenes propias (`.png` / `.webp` / `.svg`).
  - **Iluminación Dinámica (`I`):** motor de visibilidad 2D por raycasting con sombras proyectadas por los muros y preajustes de luz ambiental (Día, Atardecer, Penumbra, Noche, Mazmorra).
  - **Tejados (`R`):** polígonos de tejado con cumbrera y sombra.
- **Plantillas incluidas:** accede desde **Plantillas** en la barra superior a *Santuario del Patio* o *Barrio Empedrado*, o crea un mapa nuevo a medida.
- **Exportación:** descarga tu mapa en **PNG**, **WebP** (70 / 100 / 140 px por casilla), **Universal VTT (`.dd2vtt`)** con muros, puertas y luces para Foundry VTT / Roll20, o guarda el proyecto editable en `.ddraft.json`.

---

## Atajos de teclado

| Atajo | Acción |
| --- | --- |
| `V` `T` `W` `B` `L` `P` `H` `O` `I` `R` | Cambiar de herramienta |
| `Ctrl + Z` / `Ctrl + Y` | Deshacer / Rehacer |
| `Ctrl + D` | Duplicar objeto o luz seleccionada |
| `Supr` / `Retroceso` | Eliminar elemento seleccionado |
| `Shift + Rueda` | Rotar el objeto antes de colocarlo |
| `Espacio + Arrastrar` / `Clic derecho` | Desplazar la vista (pan) |
| `Rueda del ratón` | Zoom centrado en el cursor |

---

## Desarrollo local

```bash
npm install
npm run dev
```

Compilar y ejecutar tests:

```bash
npm run build
npm test
```
