import type { ReactNode, RefObject } from 'react';

/* =====================================================================
   Certificado VANC — archivo único (componente + estilos + datos por defecto)
   Formato: 1536 x 1024 px (proporción 3:2)
   ===================================================================== */

export const CERT_WIDTH = 1536;
export const CERT_HEIGHT = 1024;

export const logoOne = '/images/IMG_2559.PNG';
export const logoTwo = logoOne;

export type Signer = { name: string; role: string };

export type CertificateProps = {
  /** {NOMBRE_DEL_PARTICIPANTE} */
  name: string;
  /** Se muestra como marca vertical: "Emitido el 17 de noviembre de 2026, 4:49 p. m." */
  issuedAt: Date;
  certificateRef?: RefObject<HTMLDivElement>;

  /** {LOGO}: uno o varios logos (con separador dorado entre ellos) */
  logos?: { src: string; alt: string }[];
  /** {TEXTO_DEL_CERTIFICADO} */
  text?: ReactNode;
  /** {TEXTO_BIBLICO} */
  verse?: ReactNode;
  /** {REFERENCIA_BIBLICA} */
  verseReference?: string;
  /** {FIRMA_N_NOMBRE} y {FIRMA_N_CARGO} */
  signers?: Signer[];
};

const DEFAULT_LOGOS = [{ src: logoOne, alt: 'Logo VANC' }];

const DEFAULT_TEXT = (
  <>
    Por completar satisfactoriamente la <strong>Capacitación de Evangelismo VANC</strong>,
    <br />
    reafirmando su compromiso con la Gran Comisión y con compartir
    <br />
    el mensaje de esperanza y salvación en Jesucristo.
  </>
);

const DEFAULT_VERSE = (
  <>
    “Pero tú sé sobrio en todo, soporta las aflicciones,
    <br />
    haz obra de evangelista, cumple tu ministerio”.
  </>
);

const DEFAULT_SIGNERS: Signer[] = [
  { name: 'Ana Lía Ávila', role: 'Pastora Eje' },
  { name: 'Angie Rodríguez', role: 'Líder de Ministerio' },
  { name: 'Pablo Sánchez', role: 'Capacitador' },
  { name: 'Mario López', role: 'Capacitador' }
];

/* ---------------------------------------------------------------------
   Utilidades
   --------------------------------------------------------------------- */

// Ej: "17 de noviembre de 2026, 4:49 p. m."
function formatIssuedAt(date: Date): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

// Reduce el tamaño del nombre cuando es muy largo para que nunca se desborde
function nameFontSize(name: string): number {
  const length = name.trim().length;
  if (length > 36) return 34;
  if (length > 30) return 38;
  if (length > 24) return 44;
  return 50;
}

/* ---------------------------------------------------------------------
   Esquina decorativa (azul marino + cintas doradas)
   --------------------------------------------------------------------- */

function Corner({ className, id }: { className: string; id: string }) {
  return (
    <svg
      className={`vc-corner ${className}`}
      viewBox="0 0 640 420"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d27a" />
          <stop offset="45%" stopColor="#d9a21f" />
          <stop offset="100%" stopColor="#f0c552" />
        </linearGradient>
        <linearGradient id={`${id}-navy`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#04183a" />
          <stop offset="100%" stopColor="#0b3a78" />
        </linearGradient>
      </defs>

      {/* Fondo azul marino */}
      <path
        d="M0 0 L640 0 C 450 22 200 110 95 280 C 55 345 22 385 0 410 Z"
        fill={`url(#${id}-navy)`}
      />

      {/* Banda azul intermedia (más clara) */}
      <path
        d="M0 160 C 70 90 190 50 330 22 C 220 75 110 150 40 290 C 25 320 10 345 0 360 Z"
        fill="#12468c"
        opacity="0.55"
      />

      {/* Cinta dorada principal */}
      <path
        d="M640 0 C 430 30 180 120 66 300 C 38 345 16 385 0 420 L0 372 C 18 340 40 305 70 268 C 190 120 420 36 590 0 Z"
        fill={`url(#${id}-gold)`}
      />

      {/* Hilo dorado fino */}
      <path
        d="M545 0 C 360 32 150 125 40 285 C 20 315 8 335 0 350"
        fill="none"
        stroke="#f3d27a"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------
   Estilos (incluidos en el mismo archivo)
   --------------------------------------------------------------------- */

const CSS = `
.vc-certificate {
  --navy: #0b2a5b;
  --navy-dark: #04183a;
  --gold: #d9a21f;
  --gold-light: #f3d27a;

  position: relative;
  width: ${CERT_WIDTH}px;
  height: ${CERT_HEIGHT}px;
  overflow: hidden;
  background: #ffffff;
  color: var(--navy);
  font-family: 'Merriweather', 'Crimson Pro', Georgia, 'Times New Roman', serif;
  box-sizing: border-box;
}
.vc-certificate *, .vc-certificate *::before, .vc-certificate *::after {
  box-sizing: border-box;
}

/* Marco dorado con esquinas redondeadas */
.vc-frame {
  position: absolute;
  inset: 14px;
  border: 2px solid var(--gold);
  border-radius: 30px;
  z-index: 6;
  pointer-events: none;
}

/* Contenedor que recorta las esquinas decorativas dentro del marco */
.vc-clip {
  position: absolute;
  inset: 14px;
  border-radius: 30px;
  overflow: hidden;
  z-index: 1;
}
.vc-corner {
  position: absolute;
  width: 640px;
  height: 420px;
}
.vc-corner.top-left { top: -14px; left: -14px; }
.vc-corner.bottom-right {
  bottom: -14px;
  right: -14px;
  transform: rotate(180deg);
}

/* Contenido */
.vc-content {
  position: absolute;
  inset: 0;
  z-index: 5;
  text-align: center;
}

.vc-logos {
  position: absolute;
  top: 8px;
  left: 0;
  right: 0;
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vc-logos img {
  height: 225px;
  width: auto;
  max-width: 780px;
  object-fit: contain;
}


.vc-intro {
  position: absolute;
  top: 280px;
  left: 0;
  right: 0;
  font-size: 40px;
  line-height: 54px;
}

.vc-name {
  position: absolute;
  top: 380px;
  left: 120px;
  right: 120px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  line-height: 1.1;
  text-transform: uppercase;
  white-space: nowrap;
  padding-bottom: 6px;
}

/* Línea del nombre: curva azul + extremos dorados */
.vc-name-line {
  position: absolute;
  top: 463px;
  left: 0;
  right: 0;
  height: 16px;
}
.vc-name-line .navy {
  position: absolute;
  left: 172px;
  right: 182px;
  top: 6px;
  height: 5px;
  background: var(--navy-dark);
  border-radius: 100% 100% 0 0 / 100% 100% 0 0;
}
.vc-name-line .gold {
  position: absolute;
  top: 8px;
  height: 4px;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
}
.vc-name-line .gold.left  { left: 56px;  width: 120px; }
.vc-name-line .gold.right { right: 56px; width: 120px; }

.vc-text {
  position: absolute;
  top: 510px;
  left: 30px;
  right: 30px;
  margin: 0;
  font-size: 29px;
  line-height: 1.5;
}
.vc-text strong { font-weight: 700; }

.vc-verse {
  position: absolute;
  top: 675px;
  left: 0;
  right: 0;
  margin: 0;
  font-size: 25px;
  font-style: italic;
  line-height: 1.5;
}
.vc-verse-ref {
  position: absolute;
  top: 760px;
  left: 0;
  right: 0;
  margin: 0;
  font-size: 23px;
  font-weight: 700;
}

/* Firmas */
.vc-signers {
  position: absolute;
  top: 775px;
  left: 100px;
  right: 100px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 100px;
}
.vc-signer-group { min-width: 0; }
.vc-signer-signatures {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  height: 82px;
  align-items: end;
}
.vc-signer-signatures img {
  display: block;
  width: 100%;
  height: 82px;
  object-fit: contain;
  object-position: center bottom;
}
.vc-signer-group .signer-line {
  width: 100%;
  height: 3px;
  background: var(--navy-dark);
  margin-bottom: 14px;
}
.vc-signer-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.vc-signer {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.vc-signer strong {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
}
.vc-signer em {
  font-size: 17px;
  font-style: italic;
  line-height: 1.3;
}

/* Marca de emisión: pequeña, vertical, en el borde izquierdo inferior */
.vc-issued {
  position: absolute;
  left: 52px;
  bottom: 46px;
  transform: rotate(-90deg);
  transform-origin: left bottom;
  z-index: 7;
  color: var(--navy);
  opacity: 0.8;
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;
}
`;

/* ---------------------------------------------------------------------
   Componente
   --------------------------------------------------------------------- */

export default function Certificate({
  name,
  issuedAt,
  certificateRef,
  logos = DEFAULT_LOGOS,
  text = DEFAULT_TEXT,
  verse = DEFAULT_VERSE,
  verseReference = '2 Timoteo 4:5',
  signers = DEFAULT_SIGNERS
}: CertificateProps) {
  return (
    <div className="vc-certificate" id="certificate" ref={certificateRef}>
      <style>{CSS}</style>

      {/* Esquinas decorativas (recortadas dentro del marco) */}
      <div className="vc-clip">
        <Corner className="top-left" id="vc-tl" />
        <Corner className="bottom-right" id="vc-br" />
      </div>

      {/* Marco dorado */}
      <div className="vc-frame" />

      {/* Marca de emisión (fecha y hora) */}
      <div className="vc-issued">Emitido el {formatIssuedAt(issuedAt)}</div>

      <main className="vc-content">
        {/* {LOGO} */}
        <div className="vc-logos">
          {logos.slice(0, 1).map((logo) => (
            <img key={logo.src} src={logo.src} alt={logo.alt} />
          ))}
        </div>

        <div className="vc-intro">Se otorga el presente certificado a:</div>

        {/* {NOMBRE_DEL_PARTICIPANTE} */}
        <div className="vc-name" style={{ fontSize: nameFontSize(name) }}>
          {name}
        </div>
        <div className="vc-name-line">
          <span className="gold left" />
          <span className="navy" />
          <span className="gold right" />
        </div>

        {/* {TEXTO_DEL_CERTIFICADO} */}
        <p className="vc-text">{text}</p>

        {/* {TEXTO_BIBLICO} y {REFERENCIA_BIBLICA} */}
        <p className="vc-verse">{verse}</p>
        <p className="vc-verse-ref">{verseReference}</p>

        {/* {FIRMA_N_NOMBRE} / {FIRMA_N_CARGO} */}
        <div className="vc-signers">
          {[0, 1].map((group) => (
            <div className="vc-signer-group" key={group}>
              <div className="vc-signer-signatures">
                {signers.slice(group * 2, group * 2 + 2).map((signer) => {
                  const signaturePaths: Record<string, string> = {
                    'Ana Lía Ávila': '/images/Analia%20A.png',
                    'Angie Rodríguez': '/images/angie%20rodriguez.png',
                    'Pablo Sánchez': '/images/Pablo%20Zanches.png',
                    'Mario López': '/images/Mario%20Lo%CC%81pez.png'
                  };
                  return <img key={signer.name} src={signaturePaths[signer.name]} alt={`Firma de ${signer.name}`} />;
                })}
              </div>
              <div className="signer-line" />
              <div className="vc-signer-pair">
                {signers.slice(group * 2, group * 2 + 2).map((signer) => (
                  <div className="vc-signer" key={signer.name} style={signer.name === 'Mario López' ? { color: '#ffffff', WebkitTextStroke: '1px #111111', paintOrder: 'stroke fill' } : undefined}>
                    <strong>{signer.name}</strong>
                    <em>{signer.role}</em>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}