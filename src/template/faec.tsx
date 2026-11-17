import type { RefObject } from 'react';

export const CERT_WIDTH = 1122;
export const CERT_HEIGHT = 794;

export const logoOne = '/images/logo1.png';
export const logoTwo = '/images/logo2.png';
export const signature = '/images/firma.png';

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

export default function Certificate({
  name,
  issuedAt,
  certificateRef
}: {
  name: string;
  issuedAt: Date;
  certificateRef?: RefObject<HTMLDivElement>;
}) {
  return (
    <div
      className="certificate"
      id="certificate"
      ref={certificateRef}
    >
      <div className="inner-border" />

      <div
  className="certificate-issued"
  style={{
    position: 'absolute',

    // Posición en el borde inferior izquierdo
    left: '32px',
    bottom: '38px',

    // Texto vertical leyendo desde abajo hacia arriba
    transform: 'rotate(-90deg)',
    transformOrigin: 'left bottom',

    zIndex: 25,

    // Texto blanco limpio
    color: '#ffffff',

    fontFamily: 'Montserrat, Arial, sans-serif',
    fontSize: '8.2px',
    lineHeight: 1,
    fontWeight: 600,
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
    opacity: 1
  }}
>
  Emitido el {formatIssuedAt(issuedAt)}
</div>

      <div className="dots-soft left" />
      <div className="dots-soft right" />

      <div className="dots left" />
      <div className="dots right" />

      <div className="line-art left">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <span key={item} />
        ))}
      </div>

      <div className="line-art right">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <span key={item} />
        ))}
      </div>

      <div className="bottom-design">
        <svg
          viewBox="0 0 1400 990"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 590 C 105 720, 250 825, 420 900 C 530 949, 625 976, 700 985 C 775 976, 870 949, 980 900 C 1150 825, 1295 720, 1400 590 L 1400 990 L 0 990 Z"
            fill="#002552"
          />

          <path
            d="M 0 410 C 60 600, 190 765, 370 870 C 490 940, 600 975, 700 986 C 800 975, 910 940, 1030 870 C 1210 765, 1340 600, 1400 410 L 1400 590 C 1295 720, 1150 825, 980 900 C 870 949, 775 976, 700 985 C 625 976, 530 949, 420 900 C 250 825, 105 720, 0 590 Z"
            fill="#0874C9"
          />

          <path
            d="M 0 270 C 30 465, 115 650, 275 795 C 405 912, 555 968, 700 982 C 845 968, 995 912, 1125 795 C 1285 650, 1370 465, 1400 270 L 1400 355 C 1350 535, 1240 690, 1075 820 C 950 918, 810 968, 700 979 C 590 968, 450 918, 325 820 C 160 690, 50 535, 0 355 Z"
            fill="#5DAA28"
          />
        </svg>
      </div>

      <main className="content">

        <div className="logos">
          <img
            className="logo-main"
            src={logoOne}
            alt="Logo Comisión de Evangelismo"
          />

          <div className="logo-divider" />

          <img
            className="logo-secondary"
            src={logoTwo}
            alt="Logo Federación Alianza Evangélica Costarricense"
          />
        </div>

        <h1 className="title">
          CERTIFICADO
        </h1>

        <div className="subtitle-row">
          <span className="subtitle">
            DE CUMPLIMIENTO
          </span>
        </div>

        <div className="intro">
          La Comisión de Evangelismo de la Alianza Evangélica de Costa Rica
          <br />
          otorga el presente certificado a:
        </div>

        <div className="name-container">
          <div className="recipient-name">
            {name}
          </div>
        </div>

        <div className="completed">
          por haber completado satisfactoriamente el curso:
        </div>

        <div className="course-pill">
          <span>“Herramientas para compartir la Fe”</span>
        </div>

        <div className="course-category">
          Capacitación sobre Evangelismo
        </div>

        <div className="description">
          En fe y compromiso con la Gran Comisión, equipado y dispuesto
          <br />
          para compartir el mensaje de salvación con amor y verdad.
        </div>

        <div className="signature-area">

          <div className="signature-image-container">
            <img
              className="signature-image"
              src={signature}
              alt="Firma Juan de Dios Calderón"
            />
          </div>

          <div className="signature-divider" />

          <div className="signature-info">
            <strong>
              Juan de Dios Calderón
            </strong>

            <span className="position">
              Presidente
            </span>

            <br />

            Comisión de Evangelismo
            <br />
            de la FAEC
          </div>

        </div>

      </main>
    </div>
  );
}

