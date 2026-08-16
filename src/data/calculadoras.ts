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
  { slug: 'calculadora-interes-simple', titulo: 'Calculadora de interés simple', meta: 'Calcula el interés simple de un capital según el tipo y el tiempo.', cat: 'Finanzas', icon: '💵' },
  { slug: 'calculadora-finiquito', titulo: 'Calculadora de finiquito', meta: 'Estima tu finiquito: vacaciones no disfrutadas y días pendientes.', cat: 'Finanzas', icon: '📄' },
  { slug: 'calculadora-ahorro', titulo: 'Calculadora de ahorro', meta: 'Calcula cuánto ahorrar al mes para alcanzar tu meta, con intereses.', cat: 'Finanzas', icon: '🐷' },
  { slug: 'calculadora-margen-comercial', titulo: 'Calculadora de margen comercial', meta: 'Calcula el margen y el beneficio a partir del coste y el precio de venta.', cat: 'Finanzas', icon: '📊' },
  { slug: 'calculadora-rentabilidad', titulo: 'Calculadora de rentabilidad (ROI)', meta: 'Calcula la rentabilidad de una inversión en porcentaje.', cat: 'Finanzas', icon: '💹' },
  { slug: 'calculadora-propina', titulo: 'Calculadora de propina', meta: 'Calcula la propina, el total y cuánto paga cada persona.', cat: 'Finanzas', icon: '🍽️' },
  { slug: 'calculadora-presupuesto-50-30-20', titulo: 'Calculadora presupuesto 50/30/20', meta: 'Reparte tu sueldo con la regla 50/30/20: necesidades, deseos y ahorro.', cat: 'Finanzas', icon: '🧠' },
  { slug: 'calculadora-precio-metro-cuadrado', titulo: 'Calculadora de precio por m²', meta: 'Calcula el precio por metro cuadrado de una vivienda o local.', cat: 'Finanzas', icon: '🏡' },
  { slug: 'calculadora-cambio-porcentual', titulo: 'Calculadora de variación porcentual', meta: 'Calcula el porcentaje de subida o bajada entre dos valores.', cat: 'Finanzas', icon: '🔺' },
  { slug: 'calculadora-letra-dni', titulo: 'Calculadora de la letra del DNI', meta: 'Averigua la letra de tu DNI o NIE a partir del número.', cat: 'Finanzas', icon: '🪪' },
  { slug: 'calculadora-precio-hora', titulo: 'Calculadora de precio por hora', meta: 'Calcula cuánto cobrar la hora como autónomo o freelance.', cat: 'Finanzas', icon: '🕒' },
  // Salud
  { slug: 'calculadora-imc', titulo: 'Calculadora de IMC', meta: 'Tu Índice de Masa Corporal con tu peso y altura, y tu rango de peso.', cat: 'Salud', icon: '⚖️' },
  { slug: 'calculadora-calorias', titulo: 'Calculadora de calorías', meta: 'Calorías diarias que necesitas según tu edad, peso, altura y actividad.', cat: 'Salud', icon: '🔥' },
  { slug: 'calculadora-peso-ideal', titulo: 'Calculadora de peso ideal', meta: 'Estima tu peso ideal según tu altura y sexo con varias fórmulas.', cat: 'Salud', icon: '🎯' },
  { slug: 'calculadora-macros', titulo: 'Calculadora de macros', meta: 'Reparte tus calorías en proteínas, grasas e hidratos según tu objetivo.', cat: 'Salud', icon: '🍗' },
  { slug: 'calculadora-embarazo', titulo: 'Calculadora de embarazo', meta: 'Calcula las semanas de embarazo y tu fecha probable de parto.', cat: 'Salud', icon: '🤰' },
  { slug: 'calculadora-grasa-corporal', titulo: 'Calculadora de grasa corporal', meta: 'Estima tu porcentaje de grasa corporal con el método de la Marina.', cat: 'Salud', icon: '📏' },
  { slug: 'calculadora-calorias-quemadas', titulo: 'Calculadora de calorías quemadas', meta: 'Calcula las calorías que quemas según la actividad, tu peso y el tiempo.', cat: 'Salud', icon: '🏃' },
  { slug: 'calculadora-ritmo-carrera', titulo: 'Calculadora de ritmo de carrera', meta: 'Calcula tu ritmo (min/km) y tu velocidad a partir de distancia y tiempo.', cat: 'Salud', icon: '👟' },
  { slug: 'calculadora-frecuencia-cardiaca', titulo: 'Calculadora de frecuencia cardíaca', meta: 'Calcula tu frecuencia cardíaca máxima y tus zonas de entrenamiento.', cat: 'Salud', icon: '❤️' },
  { slug: 'calculadora-ovulacion', titulo: 'Calculadora de ovulación', meta: 'Calcula tus días fértiles y tu día probable de ovulación.', cat: 'Salud', icon: '🌸' },
  { slug: 'calculadora-agua-diaria', titulo: 'Calculadora de agua diaria', meta: 'Calcula cuánta agua deberías beber al día según tu peso.', cat: 'Salud', icon: '💧' },
  { slug: 'calculadora-horas-sueno', titulo: 'Calculadora de horas de sueño', meta: 'A qué hora acostarte o despertarte según los ciclos de sueño.', cat: 'Salud', icon: '😴' },
  // Matemáticas
  { slug: 'calculadora-porcentaje', titulo: 'Calculadora de porcentajes', meta: 'Porcentajes, aumentos, descuentos y regla de tres.', cat: 'Matemáticas', icon: '％' },
  { slug: 'calculadora-regla-de-tres', titulo: 'Calculadora de regla de tres', meta: 'Resuelve una regla de tres simple (directa o inversa) al instante.', cat: 'Matemáticas', icon: '➗' },
  { slug: 'calculadora-nota-media', titulo: 'Calculadora de nota media', meta: 'Calcula tu nota media, con o sin ponderación por créditos.', cat: 'Matemáticas', icon: '🎓' },
  { slug: 'calculadora-numeros-romanos', titulo: 'Conversor de números romanos', meta: 'Convierte números a romanos y romanos a números.', cat: 'Matemáticas', icon: 'Ⅹ' },
  { slug: 'calculadora-fracciones', titulo: 'Calculadora de fracciones', meta: 'Suma, resta, multiplica y divide fracciones, con el resultado simplificado.', cat: 'Matemáticas', icon: '½' },
  { slug: 'calculadora-conversor-unidades', titulo: 'Conversor de unidades', meta: 'Convierte longitud, peso y temperatura entre las unidades más comunes.', cat: 'Matemáticas', icon: '📐' },
  { slug: 'calculadora-mcm-mcd', titulo: 'Calculadora de MCM y MCD', meta: 'Calcula el mínimo común múltiplo y el máximo común divisor de dos números.', cat: 'Matemáticas', icon: '🔢' },
  { slug: 'calculadora-numeros-primos', titulo: 'Calculadora de números primos', meta: 'Comprueba si un número es primo y obtén su descomposición en factores.', cat: 'Matemáticas', icon: '#️⃣' },
  { slug: 'calculadora-ecuacion-segundo-grado', titulo: 'Ecuación de segundo grado', meta: 'Resuelve ax² + bx + c = 0 y obtén las soluciones paso a paso.', cat: 'Matemáticas', icon: '✖️' },
  { slug: 'calculadora-binario-decimal', titulo: 'Conversor binario ⇄ decimal', meta: 'Convierte números de binario a decimal y de decimal a binario.', cat: 'Matemáticas', icon: '🔟' },
  { slug: 'calculadora-area', titulo: 'Calculadora de área y perímetro', meta: 'Calcula el área y el perímetro de un cuadrado, rectángulo, círculo o triángulo.', cat: 'Matemáticas', icon: '⬜' },
  { slug: 'calculadora-potencias-raices', titulo: 'Calculadora de potencias y raíces', meta: 'Calcula potencias (aᵇ) y raíces de cualquier índice.', cat: 'Matemáticas', icon: '√' },
  { slug: 'calculadora-media-mediana-moda', titulo: 'Calculadora de media, mediana y moda', meta: 'Calcula la media, la mediana y la moda de una lista de números.', cat: 'Matemáticas', icon: 'Σ' },
  { slug: 'calculadora-numeros-aleatorios', titulo: 'Generador de números aleatorios', meta: 'Genera números aleatorios entre dos valores, con o sin repetición.', cat: 'Matemáticas', icon: '🎲' },
  { slug: 'calculadora-numero-a-letras', titulo: 'Número a letras', meta: 'Escribe cualquier número en palabras (por ejemplo, para cheques).', cat: 'Matemáticas', icon: '🔤' },
  { slug: 'calculadora-factorial', titulo: 'Calculadora de factorial', meta: 'Calcula el factorial de un número (n!) al instante.', cat: 'Matemáticas', icon: '❗' },
  { slug: 'calculadora-tabla-multiplicar', titulo: 'Tabla de multiplicar', meta: 'Genera la tabla de multiplicar de cualquier número.', cat: 'Matemáticas', icon: '✳️' },
  { slug: 'calculadora-notacion-cientifica', titulo: 'Notación científica', meta: 'Convierte números a notación científica y viceversa.', cat: 'Matemáticas', icon: '🔬' },
  { slug: 'calculadora-combinatoria', titulo: 'Combinaciones y permutaciones', meta: 'Calcula combinaciones y permutaciones (combinatoria).', cat: 'Matemáticas', icon: '🔀' },
  { slug: 'calculadora-redondeo', titulo: 'Calculadora de redondeo', meta: 'Redondea un número a los decimales que quieras.', cat: 'Matemáticas', icon: '≈' },
  // Tiempo
  { slug: 'calculadora-dias-entre-fechas', titulo: 'Días entre dos fechas', meta: 'Calcula cuántos días, semanas y meses hay entre dos fechas.', cat: 'Tiempo', icon: '📅' },
  { slug: 'calculadora-edad', titulo: 'Calculadora de edad', meta: 'Calcula tu edad exacta en años, meses y días a partir de tu fecha de nacimiento.', cat: 'Tiempo', icon: '🎂' },
  { slug: 'calculadora-horas', titulo: 'Calculadora de horas', meta: 'Calcula las horas y minutos entre dos horas (por ejemplo, horas trabajadas).', cat: 'Tiempo', icon: '⏱️' },
  { slug: 'calculadora-sumar-restar-dias', titulo: 'Sumar o restar días a una fecha', meta: 'Calcula qué fecha será dentro de X días, o la de hace X días.', cat: 'Tiempo', icon: '📆' },
  { slug: 'calculadora-cuenta-atras', titulo: 'Calculadora de cuenta atrás', meta: 'Calcula cuántos días faltan para una fecha (vacaciones, Navidad, un evento).', cat: 'Tiempo', icon: '⏳' },
  { slug: 'calculadora-dia-semana', titulo: 'Qué día de la semana fue una fecha', meta: 'Descubre en qué día de la semana cae o cayó cualquier fecha.', cat: 'Tiempo', icon: '🗓️' },
  { slug: 'calculadora-convertir-tiempo', titulo: 'Conversor de tiempo', meta: 'Convierte entre días, horas, minutos y segundos.', cat: 'Tiempo', icon: '⏲️' },
  { slug: 'calculadora-semanas-entre-fechas', titulo: 'Semanas entre dos fechas', meta: 'Calcula cuántas semanas (y meses) hay entre dos fechas.', cat: 'Tiempo', icon: '⌛' },
];

export const CATEGORIAS: Calc['cat'][] = ['Finanzas', 'Salud', 'Matemáticas', 'Tiempo'];
