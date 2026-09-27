import type { Carta, Plato, Variante } from '../types'

const seen = new Map<string, number>()

function idFrom(nombre: string) {
  const base = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const count = seen.get(base) ?? 0
  seen.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}

function plato(
  nombre: string,
  precio?: number,
  descripcion?: string,
  variantes?: Variante[],
  modelo3d?: Plato['modelo3d'],
): Plato {
  return {
    id: idFrom(nombre),
    nombre,
    precio,
    descripcion,
    variantes,
    modelo3d,
  }
}

function tamanos(
  nombre: string,
  precios: { lt15?: number; lt1?: number; personal?: number },
): Plato {
  const variantes: Variante[] = []
  if (precios.lt15 != null) variantes.push({ etiqueta: '1.5 LT', precio: precios.lt15 })
  if (precios.lt1 != null) variantes.push({ etiqueta: '1 LT', precio: precios.lt1 })
  if (precios.personal != null) variantes.push({ etiqueta: 'Personal', precio: precios.personal })
  return plato(nombre, undefined, undefined, variantes)
}

export const restaurante = {
  nombre: 'Porto',
  slogan: 'Mar & Brasas',
  actualizacion: 'Octubre 2025',
  whatsapp: '925 521 798',
  whatsappUrl: 'https://wa.me/51925521798',
  redes: '@portomarybrasa',
  instagram: 'https://www.instagram.com/portomarybrasa',
  tiktok: 'https://www.tiktok.com/@portomarybrasa',
  facebook: 'https://www.facebook.com/portomarybrasa',
}

export const cartas: Carta[] = [
  {
    id: 'marina',
    nombre: 'Carta marina',
    secciones: [
      {
        id: 'entrada',
        nombre: 'Entrada',
        platos: [
          plato('Leche de tigre', 20),
          plato('Leche de tigre porto', 25),
          plato('Conchitas', 32),
          plato('Tequeños de queso', 14.9),
          plato('Causa de porto', 22),
          plato('Causa acevichada de porto', 25),
          plato('Pulpo al olivo', 30),
          plato('Tequeños brasa', 19.9),
          plato('Tequeños de lomo', 24.9),
        ],
      },
      {
        id: 'ceviche',
        nombre: 'Ceviche',
        platos: [
          plato('Ceviche pescado', 25),
          plato('Ceviche mixto', 36, undefined, undefined, {
            glb: '/models/ceviche_mixto.glb?v=1',
            usdz: '/models/ceviche_mixto.usdz?v=1',
          }),
          plato('Ceviche porto', 40),
          plato('Ceviche a la brasa', 45),
        ],
      },
      {
        id: 'frituras',
        nombre: 'Frituras',
        platos: [
          plato('Chicharrón de pescado', 25),
          plato('Chicharrón mixto', 28),
          plato('Jalea de pescado', 28),
          plato('Jalea mixta', 30),
          plato('Cabrilla frita entera', 26),
          plato('Chicharrón de pota', 25),
        ],
      },
      {
        id: 'arroces',
        nombre: 'Arroces',
        platos: [
          plato('Arroz c/ mariscos', 25),
          plato('Arroz c/ mariscos a la chiclayana', 26),
          plato('Chaufa de mariscos', 23),
          plato('Chaufa de pescado', 24),
          plato('Chaufa de pollo', 18),
          plato('Chaufa de carne', 20),
        ],
      },
      {
        id: 'combos',
        nombre: 'Combos',
        platos: [plato('Trio marino', 30), plato('Duo marino', 25)],
      },
      {
        id: 'parrilla-marina',
        nombre: 'Platos marinos a la parrilla',
        platos: [plato('Pulpo a la parrilla', 45), plato('Salmón parrillero', 28)],
      },
      {
        id: 'sopas',
        nombre: 'Sopas',
        platos: [
          plato('Parihuela', 30),
          plato('Sudado', 30),
          plato('Chilcano power', 25),
          plato('Chilcano', 18),
          plato('Chupe', 30),
          plato('Sopa a la minuta', 18),
          plato('Sopa sustancia', 18),
          plato('Sopa criolla', 18),
          plato('Sopa choros', 18),
          plato('Dieta de pollo', 15),
        ],
      },
    ],
  },
  {
    id: 'criolla',
    nombre: 'Carta criolla',
    secciones: [
      {
        id: 'criollos',
        nombre: 'Criollos',
        platos: [
          plato('Lomo saltado', 25, undefined, undefined, {
            glb: '/models/Meshy_AI_Lomo_Saltado_redimencion.glb?v=2',
            usdz: '/models/Meshy_AI_Lomo_Saltado_redimencion.usdz?v=2',
          }),
          plato('Pollo saltado', 25),
          plato('Bisteck a lo pobre', 25),
          plato('Cabrito a la norteña', 30),
          plato('Costillar de cordero', 30),
          plato('Tacu tacu', 25, 'Bistec, pechuga, lomo o salsa de mariscos'),
          plato('Pechuga a lo pobre', 25),
        ],
      },
      {
        id: 'casa',
        nombre: 'Platos de la casa',
        platos: [
          plato('Chaufa brasa', 25),
          plato('Pechuga a la parrilla', 25, 'Salsa de champiñones'),
          plato('Doña milanesa', 28),
          plato('Brochetas de pollo', 23),
        ],
      },
      {
        id: 'pastas',
        nombre: 'Pastas',
        platos: [
          plato('Tallarín saltado c/p', 21),
          plato('Fetuchinni al pesto', 26),
          plato('Fetuchinni a la huancaína', 28),
          plato('Fetuchinni a lo alfredo', 26),
        ],
      },
    ],
  },
  {
    id: 'brasas',
    nombre: 'Carta de brasas',
    secciones: [
      {
        id: 'brasas-parrillas',
        nombre: 'Brasas y parrillas',
        platos: [
          plato(
            '1/4 de pollo + papas amarillas',
            23,
            'Cremas caseras + ensaladas (partes a elegir)',
          ),
          plato(
            '1/4 de pollo + papas amarillas',
            18,
            'Cremas caseras + ensaladas (partes según stock)',
          ),
          plato('1/2 de pollo + papas amarillas', 32, 'Cremas caseras + ensaladas'),
          plato('1 pollo + papas amarillas', 65, 'Cremas caseras + ensaladas'),
          plato(
            '1 pollo + papas amarillas + Inka Cola 1 litro',
            70,
            'Cremas caseras + ensaladas',
          ),
          plato(
            'Pollo parrillero 1/4',
            25,
            'Chorizo parrillero + 1 palo de anticucho',
          ),
          plato(
            'Salchi brasa 1/4 de pollo',
            25,
            'Hot dog Fran fruter + papas + cremas y ensalada',
          ),
          plato(
            'El mostro de porto 1/4 de pollo',
            25,
            'Chaufa + papas + crema y ensalada',
          ),
        ],
      },
      {
        id: 'piqueos',
        nombre: 'Piqueos',
        platos: [
          plato(
            'Anticucho criollo',
            22,
            '3 palitos de anticuchos + papas cocidas + choclo cocido + ají carretillero',
          ),
          plato(
            'Mollejitas parrilleras',
            18,
            'Maceradas en salsa anticuchera + papas fritas + cremas caseras y chimichurri de Porto',
          ),
        ],
      },
    ],
  },
  {
    id: 'alitas',
    nombre: 'Carta de alitas',
    cierre: 'Escoge las alitas que más te gusten. Te recomendamos todas.',
    salsas: [
      {
        id: 'bbq',
        nombre: 'BBQ',
        descripcion: 'Salsa dulce, sabor a barbacoa con nuestro toque especial.',
      },
      {
        id: 'buffalo',
        nombre: 'Buffalo',
        descripcion: 'Salsa a base de rocoto, un toque dulce que cae perfecto con tus alitas.',
      },
      {
        id: 'amazonica',
        nombre: 'Amazónica',
        descripcion: 'Salsa especial selvática, bañada con una chalaquita de ají de cocona.',
      },
      {
        id: 'anticucheras',
        nombre: 'Anticucheras',
        descripcion: 'Salsa anticuchera a nuestro estilo, acompañadas con salsa criolla.',
      },
      {
        id: 'salsa-porto',
        nombre: 'Salsa de Porto',
        descripcion: 'Salsa especial agridulce, con ingredientes seleccionados.',
      },
      {
        id: 'acevichadas',
        nombre: 'Acevichadas Porto',
        descripcion:
          'Maceradas en salsa parrillera, con su mayonesa y el toque de ají y limón.',
      },
      {
        id: 'maracuya',
        nombre: 'Sabor maracuyá',
        descripcion: 'Dulzura y acidez, con un toque refrescante y tropical de maracuyá.',
      },
      {
        id: 'mandarina',
        nombre: 'Sabor naranja mandarina',
        descripcion: 'Agridulce, con su toque de naranja y mandarina.',
      },
    ],
    secciones: [
      {
        id: 'porciones-alitas',
        nombre: 'Porciones',
        platos: [
          plato('x6 piezas', 18, '1 salsa'),
          plato('x8 piezas', 22, '1 salsa'),
          plato('x12 piezas', 35, '1 salsa'),
          plato('x18 piezas', 44, '1 salsa'),
          plato('x18 piezas', 48, '2 salsas'),
          plato('x24 piezas', 65, '3 salsas'),
          plato('x30 piezas', 75, '3 salsas'),
        ],
      },
    ],
  },
  {
    id: 'salchi',
    nombre: 'Salchipapas y hamburguesas',
    secciones: [
      {
        id: 'salchipapa',
        nombre: 'Salchipapa',
        platos: [
          plato(
            'Salchipapa brasa',
            18,
            'Papas + hot dog + trozos de pollo a la brasa (1/8) y cremas',
          ),
          plato('La achorada', 14, 'Papas + hot dog + chorizo + huevona + crema'),
          plato('A lo pobre', 15, 'Papas + hot dog + plátano frito + huevo + cremas'),
          plato(
            'La clásica',
            15,
            'Papas + hot dog + cremas. Opcional: camotes en bastones.',
          ),
        ],
      },
      {
        id: 'hamburguesas',
        nombre: 'Hamburguesas',
        platos: [
          plato('Clásicas', 15, 'Carne, cebolla caramelizada, tomate, lechuga y papa nativas'),
          plato(
            'Chesse burguer',
            15,
            'Carne, cebolla caramelizada, tomate, lechuga, queso cheddar y papas nativas',
          ),
          plato(
            'Hamburguesa a lo pobre',
            18,
            'Carne artesanal, tomate, lechuga, queso, huevo, plátano, chorizo y papas nativas',
          ),
          plato(
            'Hamburguesa royal',
            18,
            'Carne, cebolla caramelizada, chorizo, queso, lechuga, huevo y papas nativas',
          ),
          plato(
            'Hamburguesa cryspi',
            15,
            'Pechuga cryspi, tomate, lechuga y papas nativas',
          ),
        ],
      },
    ],
  },
  {
    id: 'bebidas',
    nombre: 'Bebidas',
    secciones: [
      {
        id: 'refrescantes',
        nombre: 'Refrescantes',
        platos: [
          plato('Chicha', 12),
          plato('Limonada', 12),
          plato('Maracuyá', 15),
          plato('Naranjada', 15),
          plato('Limonada pecosa', 15),
          plato('Limonada hierba luisa', 15),
          plato('Limonada hierba buena', 15),
          plato('Limonada tropical', 15, 'Fresa, mango, piña, naranja o maracuyá'),
          plato('Limonada rosa', 15),
          plato('Limonada coco', 15),
          plato('Maracumango', 20),
          plato('Maracupiña', 20),
          plato('Maracufresa', 20),
        ],
      },
      {
        id: 'infusiones',
        nombre: 'Infusiones',
        platos: [
          plato('Infusión', 3),
          plato('Café', 4),
          plato('Café con leche', 5),
        ],
      },
      {
        id: 'frozen-limonada',
        nombre: 'Limonadas tropicales frozen',
        platos: [
          plato('Limonada hierba luisa', 20),
          plato('Limonada hierba buena', 20),
          plato('Limonada tropical', 20, 'Fresa, mango, piña, naranja o maracuyá'),
          plato('Limonada rosa', 20),
          plato('Limonada coco', 18),
        ],
      },
      {
        id: 'frozen',
        nombre: 'Frozen',
        platos: [
          plato('Chicha', 18),
          plato('Maracuyá', 22),
          plato('Limonada', 18),
          plato('Fresa', 18),
        ],
      },
      {
        id: 'gaseosas',
        nombre: 'Gaseosas',
        platos: [
          tamanos('Coca Cola', { lt15: 12, lt1: 10, personal: 3.5 }),
          tamanos('Inka Cola', { lt15: 12, lt1: 10, personal: 3.5 }),
          tamanos('Agua mineral', { personal: 4 }),
        ],
      },
      {
        id: 'cervezas-personales',
        nombre: 'Cervezas personales',
        platos: [
          plato('Pilsen', 8),
          plato('Cusqueña de trigo', 9),
          plato('Cusqueña negra', 9),
          plato('Golden', 9),
          plato('Heineken', 10),
          plato('Budweiser', 10),
          plato('Stella', 10),
          plato('Corona', 10),
        ],
      },
      {
        id: 'cervezas-grandes',
        nombre: 'Cervezas grandes',
        platos: [
          plato('Pilsen', 14),
          plato('Cusqueña de trigo', 16),
          plato('Cusqueña negra', 16),
          plato('Budweiser', 15),
        ],
      },
    ],
  },
  {
    id: 'tragos',
    nombre: 'Tragos',
    secciones: [
      {
        id: 'pisco',
        nombre: 'Pisco',
        platos: [
          plato('Machu Picchu', 15),
          plato('Pisco sour', 15),
          plato('Pisco punch', 15),
          plato('Chilcano', 18),
          plato('Algarrobina', 16),
          plato('Pisco tonic', 15),
          plato('Calientitos', 15),
          plato('Shot', 15),
          plato('Pisquiriña', 15),
          plato('Maracusour', 18),
        ],
      },
      {
        id: 'ron',
        nombre: 'Ron',
        platos: [
          plato('Daikiri', 15),
          plato('Cuba libre', 15),
          plato('Piña colada', 17),
          plato('Mojito', 15),
          plato('Dark storny', 16),
          plato('Blue hawaiian', 18, undefined, undefined, {
            glb: '/models/Tropical_Blue_Hawaiia.glb?v=3',
            usdz: '/models/Tropical_blue_hawaiian.usdz?v=3',
          }),
          plato('Muau tay', 22),
          plato('Zombie', 22),
        ],
      },
      {
        id: 'vocka',
        nombre: 'Vocka',
        platos: [
          plato('Ruso negro', 15),
          plato('Ruso blanco', 15),
          plato('Sex on the beach', 20),
          plato('Cosmopolitan', 20),
          plato('Kamicaze', 15),
          plato('Mosco mule', 18),
          plato('Screwdeiver', 15),
          plato('Apple martini', 18),
          plato('Pantera rosa', 18),
          plato('Caipiroska', 15),
        ],
      },
      {
        id: 'gim',
        nombre: 'Gim',
        platos: [
          plato('Spresso martini', 18),
          plato('Whithe lady', 16),
          plato('Alexander martini', 18),
          plato('Dray martini', 16),
          plato('Toms colling', 16),
          plato('Brown gin', 16),
          plato('Gin tonic', 16),
          plato('Negroni', 30),
        ],
      },
      {
        id: 'tequila',
        nombre: 'Tequila',
        platos: [
          plato('Tequilla sunrise', 15),
          plato('Submarino', 20),
          plato('Margarita clásico', 20),
          plato('Margarita blue', 20),
          plato('Margarita corona', 25),
          plato('Esperma de pitufo', 18),
          plato('Shot', 15),
        ],
      },
      {
        id: 'wiskey',
        nombre: 'Wiskey',
        platos: [
          plato('A las rocas (Red)', 20),
          plato('A las rocas (Black)', 25),
          plato('Old fashion', 28),
          plato('Wiskey sour', 22),
          plato('Goodfather', 25),
          plato('Manhattan', 28),
          plato('Boulevardier', 30),
        ],
      },
      {
        id: 'tiki',
        nombre: 'Tragos tiki',
        platos: [
          plato('Zombie', 22),
          plato('Muy tay', 22),
          plato('Blue hawaiian', 18, undefined, undefined, {
            glb: '/models/Tropical_Blue_Hawaiia.glb?v=3',
            usdz: '/models/Tropical_blue_hawaiian.usdz?v=3',
          }),
          plato('Porto al palo', 20),
        ],
      },
      {
        id: 'cachaca',
        nombre: 'Cachaca',
        platos: [plato('Caipiriña', 16)],
      },
      {
        id: 'mezclas',
        nombre: 'Ron, vocka, tequila y más',
        platos: [
          plato('Long aisland', 20),
          plato('Blue aisland', 20),
          plato('Amor en llamas', 22),
          plato('Amaretto sour', 20),
          plato('Orgasmo', 22),
        ],
      },
    ],
  },
]
