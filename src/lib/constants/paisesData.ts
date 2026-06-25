// Archivo: src/lib/constants/paisesData.ts
// Repositorio local de descripciones analíticas por país extraídas del documento Word del cliente.
// Consumido dinámicamente por las páginas de detalle sin modificar la base de datos de Airtable.

/** Estructura de análisis descriptivo para cada país */
export interface PaisAnalisis {
    /** Párrafo introductorio sobre la oferta académica del país */
    introduccion: string;
    /** Párrafo de cierre con conclusión analítica */
    conclusion: string;
    /** Nota especial opcional (ej. advertencias de accesibilidad, convalidaciones) */
    notaEspecial?: string;
}

/**
 * Mapa indexado por nombre de país con los textos analíticos del documento Word del cliente.
 * Las claves DEBEN coincidir exactamente (con tildes) con el valor del campo "País" en Airtable.
 * Los textos provienen de las secciones "Conclusión Analítica" y "Nota Metodológica" del documento
 * 'Directorio_PosgradosEducación_Latam_2026.docx'.
 */
export const PAISES_ANALISIS: Record<string, PaisAnalisis> = {
    México: {
        introduccion:
            "México consolida un ecosistema de 42 posgrados en educación con un equilibrio notable entre maestrías (57%) y doctorados (43%), ofreciendo un espectro de inversión que democratiza el acceso desde programas simbólicos de $1 USD en instituciones públicas de élite (UNAM, CINVESTAV) hasta opciones privadas premium de $18,738 USD.",
        conclusion:
            "El sistema de posgrados mexicano destaca por un espectro de inversión notablemente amplio que democratiza el acceso a la educación de élite. Existen oportunidades excepcionales para estudiar en instituciones públicas de prestigio por un costo simbólico de $1 USD, mientras que la oferta privada se diversifica hasta alcanzar los $18,738 USD. Sin embargo, la gran barrera del ecosistema mexicano es su arraigada tradición investigativa: un contundente 83.3% de la oferta total exige la Tesis como requisito ineludible de grado, dejando un margen muy estrecho de programas que ofrecen rutas de titulación prácticas a través de proyectos o artículos científicos.",
    },
    Honduras: {
        introduccion:
            "Honduras presenta una oferta selecta de 7 posgrados en educación caracterizada por una concentración institucional única: el 100% de las maestrías son ofrecidas por la Universidad Pedagógica Nacional Francisco Morazán (UPNFM) con tarifa plana de $1,217 USD, mientras que los doctorados oscilan entre $2,500 y $4,377 USD.",
        conclusion:
            "El sistema de posgrados hondureño se distingue por su inusual concentración institucional y una estandarización financiera única en la región. A nivel de maestrías, el mercado opera bajo un monopolio académico con tarifa plana de $1,217 USD. Por su parte, la oferta doctoral posiciona a Honduras como uno de los destinos más accesibles de Centroamérica. En términos de eficiencia de tiempo, destaca el Doctorado en Ciencias de la Educación de la UNAH que permite alcanzar el máximo grado en tiempo récord de 24 meses. Sin embargo, la gran barrera es su inflexibilidad: un absoluto 100% de los posgrados exige la Tesis como requisito ineludible.",
    },
    "El Salvador": {
        introduccion:
            "El Salvador ofrece un mercado compacto de 7 posgrados en educación dominado por maestrías (86%) con dominio absoluto de la modalidad híbrida (83%), precios entre $3,034 y $5,320 USD, y un único doctorado presencial en la Universidad de El Salvador a $8,203 USD.",
        conclusion:
            "El sistema de posgrados salvadoreño se caracteriza por un mercado de maestrías sumamente compacto, accesible y pionero en la flexibilidad académica. Destaca el dominio absoluto de la modalidad Híbrida (83.3%); la ausencia total de programas 100% presenciales en maestría posiciona a El Salvador como un líder centroamericano en adaptabilidad. En contraste, la formación doctoral opera bajo un monopolio de la UES, con un único programa presencial de formato tradicional. La gran excepción estratégica es la Maestría en Educación Virtual de la Universidad Francisco Gavidia ($3,300 USD), única opción 100% virtual y la única que permite graduarse mediante Proyecto.",
    },
    Nicaragua: {
        introduccion:
            "Nicaragua ofrece 7 posgrados en educación con maestrías desde $890 USD (UNAN-Managua) hasta $6,000 USD (URACCAN), doctorados entre $4,150 y $6,000 USD, y una destacada diversidad de modalidades con dominio del formato híbrido (60%).",
        conclusion:
            "El mercado nicaragüense de posgrados destaca por su notable flexibilidad tanto financiera como de formatos. A nivel de maestrías, el país presenta un abanico de inversión que va desde opciones sumamente accesibles por $890 USD hasta programas especializados de $6,000 USD. En el ámbito doctoral, los precios se mantienen muy competitivos. Resalta su excelente adaptabilidad logística con fuerte dominio del formato híbrido. Sin embargo, el gran cuello de botella estructural es su inflexibilidad en las modalidades de grado: un rotundo 100% de la oferta nacional exige la Tesis obligatoria.",
    },
    "Costa Rica": {
        introduccion:
            "Costa Rica despliega 22 posgrados en educación con una democratización financiera excepcional: maestrías desde $95 USD (UCR) hasta $7,433 USD (Hispanoamericana), doctorados desde $132 USD (UCR virtual) hasta $15,941 USD, y un 26-28% de programas que permiten titulación por Proyecto o Artículo.",
        conclusion:
            "El sistema de posgrados costarricense destaca a nivel regional por una democratización financiera excepcional, marcada por brechas de inversión extremas que garantizan el acceso a todos los perfiles socioeconómicos. En el sector público, el país ofrece programas con costos casi simbólicos ($95 USD maestría, $132 USD doctorado). A diferencia de otros mercados centroamericanos rígidamente atados a la tesis tradicional, Costa Rica demuestra una apertura estratégica: un 26.7% de las maestrías permite titulación mediante Proyecto, mientras que el 28.6% de los doctorados innova permitiendo la graduación a través de Artículo científico.",
    },
    Panamá: {
        introduccion:
            "Panamá presenta 14 posgrados en educación, uno de los mercados más accesibles y homogéneos de Centroamérica: maestrías desde $1,140 USD con titulaciones exprés de 14 meses, doctorados desde $1,120 USD en la Universidad de Panamá, y un 18-33% de programas con alternativas a la tesis.",
        conclusion:
            "El ecosistema panameño de posgrados destaca por ser uno de los mercados más accesibles y financieramente homogéneos de toda la región centroamericana. A nivel de maestrías, la inversión oscila entre $1,140 USD y $3,623 USD. Esta extraordinaria competitividad se refleja aún más en el nivel doctoral, donde es posible acceder a programas presenciales de élite por $1,120 USD. El país ofrece maestrías exprés que pueden completarse en 14 meses y doctorados en formato estandarizado de 36 meses. Un 18% de las maestrías y un 33% de los doctorados permiten esquivar la Tesis obligatoria mediante Proyecto aplicado o Artículo científico.",
    },
    "República Dominicana": {
        introduccion:
            "República Dominicana ofrece 19 posgrados en educación con una amplia democratización financiera: maestrías desde $1,012 USD (UTESA) hasta $11,165 USD (UAPA), doctorados desde $2,650 USD (UFHEC) hasta $16,514 USD, con rutas exprés de 16 meses en maestrías y 28 meses en doctorados.",
        conclusion:
            "El ecosistema de posgrados dominicano se caracteriza por una amplia democratización financiera que permite la convivencia de opciones accesibles y programas premium. La inversión en maestrías oscila desde $1,012 USD hasta $11,165 USD, mientras que en doctorados va de $2,650 USD a $16,514 USD. Destaca por sus rutas de titulación exprés de 16 meses (maestrías) y 28 meses (doctorados). Paradójicamente, la innovación en modalidades de titulación se da en el nivel doctoral: un destacado 40% de los doctorados ofrece alternativas de Proyecto aplicado o Artículo científico, mientras que las maestrías operan con un 93% de exigencia de Tesis.",
    },
    Cuba: {
        introduccion:
            "Cuba presenta 10 posgrados en educación con un ecosistema 100% público, equilibrio perfecto entre maestrías (50%) y doctorados (50%), precios no publicados por subsidio estatal, y dedicación exclusivamente presencial con duraciones estandarizadas de 24 y 48 meses.",
        conclusion:
            "El sistema de posgrados cubano presenta características excepcionales frente al resto de la región. Ninguno de los programas reporta tarifas comerciales, evidenciando una oferta altamente subsidiada o gratuita. Todos los programas exigen dedicación 100% presencial con duraciones uniformes de 24 meses (maestrías) y 48 meses (doctorados). La Tesis se consolida como requisito universal en ambos niveles. El modelo cubano no contempla alternativas aplicadas como proyectos o artículos científicos, lo que asegura un estándar clásico de investigación pero elimina cualquier margen de flexibilidad para el estudiante.",
        notaEspecial:
            "Nota Metodológica — Acceso a la información de posgrados en Cuba: (1) Accesibilidad web limitada: Por protocolos de seguridad, los dominios universitarios (.cu) suelen bloquear conexiones internacionales. (2) Ausencia de precios publicados: Al ser un ecosistema 100% público y subsidiado, las plataformas no muestran tarifas ni procesos de pago comercial. (3) Admisión para extranjeros: El ingreso de estudiantes internacionales está mediado por convenios gubernamentales y becas bilaterales. Recomendación: contactar directamente a la oficina de Relaciones Internacionales de cada universidad, al Ministerio de Educación Superior (MES) o a la embajada correspondiente.",
    },
    "Puerto Rico": {
        introduccion:
            "Puerto Rico despliega 15 posgrados en educación con excelente adaptabilidad económica: maestrías desde $1,250 USD (UPR) hasta $8,500 USD, con titulación exprés de 12 meses; doctorados entre $3,580 y $5,553 USD con un extraordinario 75% que permite titulación por Proyecto.",
        conclusion:
            "El mercado puertorriqueño de posgrados se caracteriza por una excelente adaptabilidad económica y de tiempos. A nivel de maestrías, el rango va desde $1,250 USD en el sistema público hasta $8,500 USD en opciones privadas. La oferta doctoral mantiene precios notablemente competitivos y homogéneos ($3,580-$5,553 USD). Puerto Rico brilla por su apertura hacia modalidades de grado orientadas a la práctica: un 27% de las maestrías integra opciones de Proyecto o Artículo, y un extraordinario 75% de los doctorados permite graduarse mediante Proyecto, rompiendo con el cuello de botella de la Tesis obligatoria.",
    },
    Venezuela: {
        introduccion:
            "Venezuela ofrece 26 posgrados en educación, uno de los destinos más asequibles de Latinoamérica: maestrías desde $320 USD (UPEL) hasta $3,250 USD, doctorados desde $600 USD (UCV) hasta $2,955 USD, con maestrías exprés de 18 meses y doctorados acelerados de 36 meses.",
        conclusion:
            "El mercado de posgrados venezolano destaca radicalmente en la región por su extraordinaria accesibilidad económica. A nivel de maestrías, la inversión oscila entre $320 USD y $3,250 USD. Esta competitividad se replica en doctorados, donde es posible cursar un doctorado en la UCV por $600 USD. A nivel de tiempos, ofrece maestrías exprés de 18 meses y doctorados acelerados de 36 meses. Sin embargo, el gran contraste radica en la inflexibilidad de sus modalidades de titulación: un rotundo 100% de las maestrías exige Tesis obligatoria. Paradójicamente, la innovación asoma en el nivel doctoral, donde un 28.6% permite graduación mediante Artículo científico.",
    },
    Colombia: {
        introduccion:
            "Colombia despliega 45 posgrados en educación, uno de los ecosistemas más grandes y diversos de la región: maestrías desde $1,593 USD (La Salle) hasta $26,542 USD, doctorados desde $3,985 USD hasta $45,896 USD (Javeriana), con maestrías de 12 meses y un 41% de doctorados que aceptan Artículo como titulación.",
        conclusion:
            "El sistema de posgrados colombiano se caracteriza por una oferta de precios sumamente amplia y contrastante. En maestrías, el mercado presenta desde opciones accesibles de $1,593 USD hasta programas de $26,542 USD. Esta misma brecha se vive en doctorados, desde $3,985 USD hasta $45,896 USD en instituciones privadas de élite. Es altamente flexible en tiempos: maestrías exprés de 12 meses y doctorados acelerados de 36 meses. La verdadera vanguardia formativa se encuentra en el doctorado: un 41% permite a sus candidatos titularse mediante Artículo científico, priorizando la visibilidad internacional sobre la tesis clásica.",
    },
    Ecuador: {
        introduccion:
            "Ecuador presenta 23 posgrados en educación dominados por maestrías (83%) con extraordinaria agilidad académica: la mayoría en formato exprés de 12 meses, precios entre $2,320 y $5,500 USD, y doctorados entre $7,890 y $10,772 USD con duración estándar de 48 meses.",
        conclusion:
            "El mercado ecuatoriano de posgrados se distingue por una extraordinaria homogeneidad financiera y una inmejorable agilidad académica. Las maestrías operan en un rango compacto de $2,320 a $5,500 USD, mientras que los doctorados se concentran entre $7,890 y $10,772 USD. Ecuador brilla por su velocidad de titulación: la gran mayoría de sus maestrías operan bajo formatos exprés de 12 meses. En cuanto a requisitos de grado, domina la Tesis obligatoria pero con señales de apertura: un 15.8% de maestrías y un 25% de doctorados permiten titularse mediante Artículo científico.",
    },
    Perú: {
        introduccion:
            "Perú ofrece 25 posgrados en educación con una amplitud financiera notable: maestrías desde $285 USD (UNE) hasta $12,058 USD (PUCP), doctorados desde $2,047 USD hasta $10,280 USD, con maestrías exprés de 12 meses y un doctorado acelerado de 24 meses.",
        conclusion:
            "El mercado peruano de posgrados destaca por una extraordinaria amplitud financiera que democratiza el acceso a la educación superior. Las maestrías van desde $285 USD en el sector público hasta $12,058 USD en la PUCP. Los doctorados oscilan entre $2,047 USD y $10,280 USD. Perú se consolida como un destino sumamente ágil, ofreciendo maestrías exprés de 12 meses y doctorados entre 24 y 36 meses. A pesar de esta agilidad, las maestrías son absolutamente rígidas: 100% exigen Tesis obligatoria. La apertura ocurre en el nivel doctoral, donde un 22% permite graduarse mediante Artículo científico.",
    },
    Bolivia: {
        introduccion:
            "Bolivia presenta 10 posgrados en educación con excepcional accesibilidad económica: maestrías desde $607 USD (UCB) hasta $3,300 USD, doctorados desde $2,210 USD (UPEA) hasta $6,230 USD, con un caso doctoral excepcional de 18 meses que permite titulación por Proyecto.",
        conclusion:
            "El mercado boliviano de posgrados se distingue por su excepcional accesibilidad económica y homogeneidad financiera. Las maestrías operan entre $607 USD y $3,300 USD, mientras que los doctorados van de $2,210 USD a $6,230 USD. Ofrece rutas ágiles con maestrías de 18 meses y un caso doctoral excepcional de 18 meses que rompe los esquemas tradicionales. A nivel de maestría, el sistema es conservador: 100% exige Tesis. Curiosamente, la vanguardia asoma en el nivel doctoral, donde un 25% permite titularse mediante Proyecto aplicado, una rareza estratégica para líderes educativos enfocados en la práctica.",
    },
    Chile: {
        introduccion:
            "Chile despliega 29 posgrados en educación con un ecosistema consolidado y diverso: maestrías desde $1,538 USD (UDD) hasta $10,644 USD (UST), con dominio de titulación por Proyecto (50% de maestrías), y una oferta robusta de 9 doctorados.",
        conclusion:
            "El sistema de posgrados chileno se caracteriza por un ecosistema altamente consolidado donde destaca una cultura institucional orientada a la aplicación práctica. A nivel de maestrías, la inversión oscila entre $1,538 USD y $10,644 USD. Chile sobresale en la región por su apertura hacia modalidades de grado modernas: un notable 50% de las maestrías permite la titulación mediante Proyecto aplicado, rompiendo con el paradigma de la Tesis obligatoria. Esta flexibilidad convierte al país en un destino atractivo para profesionales que buscan resultados tangibles y aplicables al aula sin pasar por el filtro de la investigación teórica tradicional.",
    },
    Uruguay: {
        introduccion:
            "Uruguay presenta un ecosistema selecto de 10 posgrados en educación con previsibilidad logística absoluta: maestrías desde $1 USD (Udelar) hasta $9,600 USD (FLACSO), doctorados compactos entre $3,900 y $5,240 USD, y duraciones estandarizadas de 24 meses (maestrías) y 36 meses (doctorados) sin excepciones.",
        conclusion:
            "El mercado uruguayo de posgrados se caracteriza por una previsibilidad logística absoluta y contrastes financieros fascinantes. A nivel económico, las maestrías presentan una democratización radical: es posible acceder a formación de alto nivel por un costo simbólico de $1 USD en el sector público (Universidad de la República), mientras que la oferta privada escala hasta los $9,600 USD. El nivel doctoral mantiene un nivel de inversión sumamente compacto, fluctuando entre $3,900 USD y $5,240 USD. En cuanto a requisitos de grado, Uruguay presenta una marcada dualidad: 100% de las maestrías exigen Tesis obligatoria, mientras que un extraordinario 67% de los doctorados permite titularse mediante Artículo científico.",
    },
    Paraguay: {
        introduccion:
            "Paraguay despliega 20 posgrados en educación con costos altamente competitivos y rutas aceleradas disruptivas: maestrías desde $870 USD (INAES) con opciones exprés de 14 meses, y doctorados desde $870 USD hasta $3,628 USD con formatos intensivos de 18-24 meses, posicionándose como uno de los destinos doctorales más accesibles de Latinoamérica.",
        conclusion:
            "El mercado paraguayo de posgrados destaca de forma excepcional en la región por sus costos altamente competitivos y sus disruptivas rutas aceleradas. Las maestrías presentan un rango de inversión sumamente accesible de $870 USD a $3,210 USD. Esta misma competitividad extrema se mantiene en el nivel doctoral: es posible cursar un doctorado 100% virtual por la cifra récord de $870 USD (INAES), mientras que el tope máximo apenas alcanza los $3,628 USD. Paraguay rompe con los estándares tradicionales ofreciendo maestrías exprés de 14 meses y doctorados intensivos de 18 a 24 meses. A pesar de esta agilidad, mantiene una postura conservadora en titulación: 91% de maestrías y 100% de doctorados exigen Tesis obligatoria.",
    },
    Argentina: {
        introduccion:
            "Argentina se consolida como uno de los polos académicos más prestigiosos y accesibles de la región con 26 posgrados en educación: maestrías desde $1 USD (UNIPE) con mayoría pública por debajo de $2,000 USD, doctorados desde $931 USD (USAL) hasta $28,453 USD (San Andrés), y maestrías exprés de 15 meses (UNLP).",
        conclusion:
            "El sistema de posgrados argentino destaca a nivel continental por su profunda democratización financiera. A nivel de maestrías, el país ofrece oportunidades extraordinarias con costos casi simbólicos a partir de $1 USD, manteniendo la inmensa mayoría de su oferta pública por debajo de los $2,000 USD, hasta opciones de élite que alcanzan los $8,000 USD. Esta accesibilidad se extiende al doctorado, donde es posible cursar por $931 USD frente a alternativas premium de $28,453 USD. Ofrece maestrías exprés de 15 meses (UNLP). Sin embargo, el ecosistema argentino es uno de los más conservadores en metodologías de graduación: un contundente 100% de su oferta nacional exige la Tesis como requisito ineludible, sin rutas alternativas de proyecto o artículo.",
    },
};

/**
 * Función auxiliar para obtener los datos analíticos de un país de forma segura.
 * Normaliza la cadena de entrada (sin acentos, minúsculas) antes de buscar la coincidencia
 * en el objeto PAISES_ANALISIS, evitando errores por variaciones de texto o tildes.
 *
 * @param paisNombre - Nombre del país tal como viene de Airtable (ej. "México", "méxico", "MEXICO")
 * @returns El objeto PaisAnalisis si existe, o null si el país no está en el repositorio
 */
export function obtenerAnalisisPorPais(paisNombre: string): PaisAnalisis | null {
    if (!paisNombre) return null;

    // Normalizar la entrada: eliminar acentos, minúsculas, trim
    const normalizado = paisNombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    // Buscar la clave cuya versión normalizada coincida
    for (const [key, value] of Object.entries(PAISES_ANALISIS)) {
        const keyNormalizada = key
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        if (keyNormalizada === normalizado) {
            return value;
        }
    }

    return null;
}