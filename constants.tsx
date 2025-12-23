
import { MedicalEquipment, UnitStatus, SanitizationStatus, EquipmentUnit } from './types';

export const CATALOG: MedicalEquipment[] = [
  // Sillas de Ruedas
  {
    id: 'wheel-01',
    name: 'Silla de Ruedas Estándar Reforzada',
    category: 'Sillas de Ruedas',
    description: 'Estructura de acero de alta resistencia, plegable y con descansapies removibles. Ideal para uso rudo.',
    dailyRate: 70,
    monthlyRate: 1100,
    images: [
      'https://images.unsplash.com/photo-1597762137002-31c35774bb36?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1598188306155-21e4004ec298?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Soporta hasta 120kg', 'Plegado compacto', 'Llantas sólidas antoponchaduras']
  },
  {
    id: 'wheel-02',
    name: 'Silla de Ruedas para Traslado (Ligera)',
    category: 'Sillas de Ruedas',
    description: 'Diseño ultraligero de aluminio para transporte fácil en vehículos. Respaldo plegable.',
    dailyRate: 90,
    monthlyRate: 1350,
    images: [
      'https://images.unsplash.com/photo-1598188306155-21e4004ec298?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Peso de solo 11kg', 'Frenos de seguridad en manubrio', 'Asiento transpirable']
  },
  {
    id: 'wheel-03',
    name: 'Silla de Ruedas Eléctrica Premium',
    category: 'Sillas de Ruedas',
    description: 'Máxima autonomía y confort con control por joystick. Motores potentes y silenciosos.',
    dailyRate: 350,
    monthlyRate: 7500,
    images: [
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1597762137002-31c35774bb36?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Autonomía de 20km', 'Joystick ajustable', 'Batería de litio']
  },

  // Camas Hospitalarias
  {
    id: 'bed-01',
    name: 'Cama Hospitalaria Manual 2 Posiciones',
    category: 'Camas Hospitalarias',
    description: 'Ajuste mecánico de respaldo y pies mediante manivelas silenciosas. Incluye barandales.',
    dailyRate: 140,
    monthlyRate: 2800,
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['2 Manivelas de acero', 'Barandales de seguridad', 'Freno en las 4 ruedas']
  },
  {
    id: 'bed-02',
    name: 'Cama Hospitalaria Eléctrica 3 Posiciones',
    category: 'Camas Hospitalarias',
    description: 'Control remoto para ajuste de altura, respaldo y rodillas. Colchón seccionado incluido.',
    dailyRate: 220,
    monthlyRate: 4800,
    images: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Motor eléctrico silencioso', 'Control ergonómico', 'Altura ajustable']
  },
  {
    id: 'bed-03',
    name: 'Cama Hospitalaria de Lujo (Full Electric)',
    category: 'Camas Hospitalarias',
    description: 'Todas las posiciones automáticas incluyendo Trendelenburg. Panel de control integrado.',
    dailyRate: 380,
    monthlyRate: 8500,
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce2?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Posición Trendelenburg', 'Respaldo con RCP manual', 'Barandales de ABS']
  },

  // Oxigeno y Respiratorio
  {
    id: 'ox-01',
    name: 'Concentrador de Oxígeno 5L',
    category: 'Oxígeno y Respiratorio',
    description: 'Suministro continuo de oxígeno grado médico. Compacto y fácil de mover por casa.',
    dailyRate: 150,
    monthlyRate: 3500,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Flujo de 0.5 a 5 LPM', 'Bajo ruido <45dB', 'Vaso humidificador incluido']
  },
  {
    id: 'ox-02',
    name: 'Concentrador de Oxígeno 10L (Alto Flujo)',
    category: 'Oxígeno y Respiratorio',
    description: 'Diseñado para pacientes con altos requerimientos respiratorios. Uso 24/7 garantizado.',
    dailyRate: 280,
    monthlyRate: 6800,
    images: [
      'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Hasta 10 Litros por minuto', 'Salida de presión dual', 'Sensor de pureza O2']
  },
  {
    id: 'ox-03',
    name: 'Tanque de Oxígeno Portátil (680L)',
    category: 'Oxígeno y Respiratorio',
    description: 'Kit completo de cilindro de aluminio con regulador y cánula para traslados médicos.',
    dailyRate: 60,
    monthlyRate: 1200,
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Cilindro ligero de aluminio', 'Regulador de 0-15 LPM', 'Mochila de transporte']
  },

  // Rehabilitación
  {
    id: 'rehab-01',
    name: 'Ejercitador de Pedal (Pedalera Digital)',
    category: 'Rehabilitación',
    description: 'Ideal para fisioterapia en casa. Ayuda a mejorar la circulación en piernas y brazos.',
    dailyRate: 40,
    monthlyRate: 650,
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Pantalla LCD (Tiempo/Calorías)', 'Resistencia ajustable', 'Base antideslizante']
  },
  {
    id: 'rehab-02',
    name: 'Equipo de Electroestimulación TENS',
    category: 'Rehabilitación',
    description: 'Alivio del dolor mediante impulsos eléctricos. 8 modos de masaje terapéutico.',
    dailyRate: 35,
    monthlyRate: 800,
    images: [
      'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Portátil y recargable', 'Intensidad regulable', 'Incluye parches adhesivos']
  },
  {
    id: 'rehab-03',
    name: 'Pelota Bobath para Rehabilitación',
    category: 'Rehabilitación',
    description: 'Pelota de ejercicio de alta densidad para equilibrio, estiramientos y fuerza muscular.',
    dailyRate: 20,
    monthlyRate: 350,
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Sistema anti-explosión', 'Textura antideslizante', 'Varios tamaños (65cm/75cm)']
  },

  // Movilidad
  {
    id: 'mov-01',
    name: 'Andadera con Ruedas y Asiento (Rollator)',
    category: 'Movilidad',
    description: 'Soporte premium para caminatas. Incluye asiento acojinado y canasta para compras.',
    dailyRate: 55,
    monthlyRate: 1100,
    images: [
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1597762137002-31c35774bb36?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Frenos de mano integrados', 'Canastilla portaobjetos', 'Respaldo acojinado']
  },
  {
    id: 'mov-02',
    name: 'Andadera Plegable de Aluminio',
    category: 'Movilidad',
    description: 'Estructura ligera y ajustable. Plegado rápido con un solo botón.',
    dailyRate: 35,
    monthlyRate: 550,
    images: [
      'https://images.unsplash.com/photo-1597762137002-31c35774bb36?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Altura ajustable', 'Tapones de goma antiderrapante', 'Aluminio anodizado']
  },
  {
    id: 'mov-03',
    name: 'Muletas Axilares de Aluminio (Par)',
    category: 'Movilidad',
    description: 'Ajuste telescópico tanto en altura total como en apoyo de manos.',
    dailyRate: 25,
    monthlyRate: 400,
    images: [
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1597762137002-31c35774bb36?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Soportes axilares suaves', 'Doble ajuste (axila y mano)', 'Talla Chica/Med/Gde']
  },

  // Accesorios
  {
    id: 'acc-01',
    name: 'Colchón de Presión Alterna (Antillagas)',
    category: 'Accesorios',
    description: 'Previene úlceras por presión. Sistema de burbujas que se inflan alternadamente.',
    dailyRate: 45,
    monthlyRate: 950,
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce2?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Bomba de aire silenciosa', 'Presión ajustable', 'Material PVC médico']
  },
  {
    id: 'acc-02',
    name: 'Mesa Puente para Cama Hospitalaria',
    category: 'Accesorios',
    description: 'Superficie deslizable sobre la cama para alimentos o lectura. Altura ajustable.',
    dailyRate: 35,
    monthlyRate: 650,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Ruedas con freno', 'Superficie de madera laminada', 'Estructura cromada']
  },
  {
    id: 'acc-03',
    name: 'Tripie para Suero de 4 Ganchos',
    category: 'Accesorios',
    description: 'Soporte metálico estable para soluciones intravenosas con base de 5 ruedas.',
    dailyRate: 20,
    monthlyRate: 450,
    images: [
      'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Base pesada antivuelco', 'Altura telescópica', 'Acero inoxidable']
  }
];

export const MOCK_UNITS: EquipmentUnit[] = [
  {
    serialNumber: 'SN-OX-2024-001',
    equipmentId: 'ox-01',
    status: UnitStatus.AVAILABLE,
    lastSanitizationDate: '2024-05-15T10:00:00Z',
    sanitizationStatus: SanitizationStatus.CERTIFIED,
    sanitizedBy: 'Ing. Javier Ruiz'
  }
];
