// Catálogo de calculadoras del hub. Añadir una = añadir una entrada aquí + su página.
export interface Calc {
  slug: string;
  titulo: string;
  meta: string;
  cat: 'Finanzas' | 'Salud' | 'Matemáticas' | 'Tiempo';
  icon: string;
}

export const CALCULADORAS: Calc[] = [
  // Finanzas (RPM alto)
  { slug: 'calculadora-hipoteca', titulo: 'Calculadora de hipoteca', meta: 'Cuota mensual, intereses totales y tabla de amortización de tu hipoteca.', cat: 'Finanzas', icon: '🏠' },
  { slug: 'calculadora-prestamo', titulo: 'Calculadora de préstamo', meta: 'Calcula la cuota de un préstamo personal, los intereses y el total a pagar.', cat: 'Finanzas', icon: '💶' },
  { slug: 'calculadora-interes-compuesto', titulo: 'Calculadora de interés compuesto', meta: 'Descubre cuánto crecerán tus ahorros con el interés compuesto y aportaciones.', cat: 'Finanzas', icon: '📈' },
  { slug: 'calculadora-iva', titulo: 'Calculadora de IVA', meta: 'Añade o quita el IVA (21%, 10%, 4%) de cualquier importe.', cat: 'Finanzas', icon: '🧾' },
  { slug: 'calculadora-descuento', titulo: 'Calculadora de descuento', meta: 'Calcula el precio final tras un descuento y cuánto te ahorras.', cat: 'Finanzas', icon: '🏷️' },
  { slug: 'calculadora-sueldo-neto', titulo: 'Calculadora de sueldo neto', meta: 'Estima tu sueldo neto a partir del bruto: IRPF y Seguridad Social.', cat: 'Finanzas', icon: '💼' },
  // Salud
  { slug: 'calculadora-imc', titulo: 'Calculadora de IMC', meta: 'Tu Índice de Masa Corporal con tu peso y altura, y tu rango de peso.', cat: 'Salud', icon: '⚖️' },
  { slug: 'calculadora-calorias', titulo: 'Calculadora de calorías', meta: 'Calorías diarias que necesitas según tu edad, peso, altura y actividad.', cat: 'Salud', icon: '🔥' },
  { slug: 'calculadora-peso-ideal', titulo: 'Calculadora de peso ideal', meta: 'Estima tu peso ideal según tu altura y sexo con varias fórmulas.', cat: 'Salud', icon: '🎯' },
  // Matemáticas
  { slug: 'calculadora-porcentaje', titulo: 'Calculadora de porcentajes', meta: 'Porcentajes, aumentos, descuentos y regla de tres.', cat: 'Matemáticas', icon: '％' },
  { slug: 'calculadora-regla-de-tres', titulo: 'Calculadora de regla de tres', meta: 'Resuelve una regla de tres simple (directa o inversa) al instante.', cat: 'Matemáticas', icon: '➗' },
  { slug: 'calculadora-nota-media', titulo: 'Calculadora de nota media', meta: 'Calcula tu nota media, con o sin ponderación por créditos.', cat: 'Matemáticas', icon: '🎓' },
  { slug: 'calculadora-numeros-romanos', titulo: 'Conversor de números romanos', meta: 'Convierte números a romanos y romanos a números.', cat: 'Matemáticas', icon: 'Ⅹ' },
  // Tiempo
  { slug: 'calculadora-dias-entre-fechas', titulo: 'Días entre dos fechas', meta: 'Calcula cuántos días, semanas y meses hay entre dos fechas.', cat: 'Tiempo', icon: '📅' },
  { slug: 'calculadora-edad', titulo: 'Calculadora de edad', meta: 'Calcula tu edad exacta en años, meses y días a partir de tu fecha de nacimiento.', cat: 'Tiempo', icon: '🎂' },
  { slug: 'calculadora-horas', titulo: 'Calculadora de horas', meta: 'Calcula las horas y minutos entre dos horas (por ejemplo, horas trabajadas).', cat: 'Tiempo', icon: '⏱️' },
];

export const CATEGORIAS: Calc['cat'][] = ['Finanzas', 'Salud', 'Matemáticas', 'Tiempo'];
