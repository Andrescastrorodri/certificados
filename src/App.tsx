import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck2,
  Heart,
  Loader2,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';

import { participantesAutorizados } from '@/participants';

import Certificate, { CERT_WIDTH, CERT_HEIGHT, logoOne, logoTwo, signature } from '@/template/vanc';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const loadImage = (src: string) =>
  new Promise<string>((resolve, reject) => {
    const image = new Image();

    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const canvas = document.createElement('canvas');

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      canvas.getContext('2d')!.drawImage(image, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    };

    image.onerror = reject;
    image.src = src;
  });

const waitForImages = (container: HTMLElement) => {
  const images = Array.from(container.querySelectorAll('img'));

  return Promise.all(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();

        image.onerror = () =>
          reject(new Error(`No se pudo cargar ${image.src}`));
      });
    })
  );
};


function App() {

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmedName, setConfirmedName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [scale, setScale] = useState(1);
  const [issuedAt, setIssuedAt] = useState<Date | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = normalize(query);

  const matches = useMemo(
    () =>
      normalizedQuery
        ? participantesAutorizados
            .filter((person) =>
              normalize(person).includes(normalizedQuery)
            )
            .slice(0, 8)
        : [],
    [normalizedQuery]
  );

  const computeScale = useCallback(() => {
  const viewport = viewportRef.current;
  if (!viewport) return;

  const padding = 20;

  const availableWidth = Math.max(
    1,
    viewport.clientWidth - padding
  );

  const availableHeight = Math.max(
    1,
    viewport.clientHeight - padding
  );

  const scaleByWidth =
    availableWidth / CERT_WIDTH;

  const scaleByHeight =
    availableHeight / CERT_HEIGHT;

  setScale(
    Math.min(
      1,
      scaleByWidth,
      scaleByHeight
    )
  );
}, []);

  useEffect(() => {

    if (!modalOpen) return;

    computeScale();

    window.addEventListener(
      'resize',
      computeScale
    );

    return () =>
      window.removeEventListener(
        'resize',
        computeScale
      );

  }, [modalOpen, computeScale]);

  useEffect(() => {

    if (!modalOpen) return;

    document.body.classList.add(
      'modal-open'
    );

    const handleKey = (
      event: KeyboardEvent
    ) => {

      if (event.key === 'Escape') {
        setModalOpen(false);
      }

    };

    window.addEventListener(
      'keydown',
      handleKey
    );

    return () => {

      document.body.classList.remove(
        'modal-open'
      );

      window.removeEventListener(
        'keydown',
        handleKey
      );

    };

  }, [modalOpen]);

  const chooseParticipant = (
    name: string
  ) => {

    setSelected(name);
    setConfirmedName(name);
    setQuery(name);
    setModalOpen(false);

  };

  const reset = () => {

    setQuery('');
    setSelected(null);
    setConfirmedName('');
    setIssuedAt(null);
    setModalOpen(false);

  };

  const nextFrame = () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          resolve()
        )
      )
    );

  const downloadCertificate = async () => {

    const original =
      certificateRef.current;

    if (
      !original ||
      !confirmedName.trim() ||
      downloading
    ) {
      return;
    }

    setDownloading(true);

    try {

      await document.fonts.ready;

      const [
        logo1Data,
        logo2Data,
        signatureData
      ] = await Promise.all([
        loadImage(logoOne),
        loadImage(logoTwo),
        loadImage(signature)
      ]);

      const exportNode =
        original.cloneNode(true) as HTMLElement;

      exportNode.id =
        'certificate-export';

      Object.assign(
        exportNode.style,
        {
          position: 'fixed',
          left: '-10000px',
          top: '0',

          width: `${CERT_WIDTH}px`,
          height: `${CERT_HEIGHT}px`,

          minWidth: `${CERT_WIDTH}px`,
          maxWidth: `${CERT_WIDTH}px`,

          minHeight: `${CERT_HEIGHT}px`,
          maxHeight: `${CERT_HEIGHT}px`,

          transform: 'none',
          transformOrigin: 'top left',

          margin: '0',
          padding: '0',

          overflow: 'hidden',
          boxSizing: 'border-box'
        }
      );

      exportNode.querySelector<HTMLImageElement>(
        '.logo-main'
      )!.src = logo1Data;

      exportNode.querySelector<HTMLImageElement>(
        '.logo-secondary'
      )!.src = logo2Data;

      const signatureImage = exportNode.querySelector<HTMLImageElement>('.signature-image');
      if (signatureImage) signatureImage.src = signatureData;

    // ==========================================
// CORRECCIÓN DE MÉTRICAS PARA HTML2CANVAS
// Solo afecta al PDF, NO a la vista previa.
// ==========================================

const exportName =
  exportNode.querySelector<HTMLElement>(
    '.recipient-name'
  );

const exportCourse =
  exportNode.querySelector<HTMLElement>(
    '.course-pill'
  );

const exportCourseText =
  exportNode.querySelector<HTMLElement>(
    '.course-pill span'
  );


// ----- NOMBRE DEL PARTICIPANTE -----

if (exportName) {
  exportName.style.position = 'relative';

  // html2canvas renderiza Montserrat
  // ligeramente más abajo que el navegador.
  exportName.style.top = '-3px';

  exportName.style.lineHeight = '1';
  exportName.style.paddingTop = '0';
  exportName.style.paddingBottom = '0';
}


// ----- BARRA DEL CURSO -----

if (exportCourse) {
  exportCourse.style.height = '47px';
  exportCourse.style.minHeight = '47px';

  exportCourse.style.paddingTop = '0';
  exportCourse.style.paddingBottom = '0';

  exportCourse.style.display = 'flex';
  exportCourse.style.alignItems = 'center';
  exportCourse.style.justifyContent = 'center';

  exportCourse.style.lineHeight = '1';
}


// ----- TEXTO DEL CURSO -----

if (exportCourseText) {
  exportCourseText.style.display = 'block';

  exportCourseText.style.lineHeight = '1';

  // Compensación vertical de html2canvas.
  exportCourseText.style.transform =
    'translateY(-3px)';

  exportCourseText.style.margin = '0';
  exportCourseText.style.padding = '0';
}

      document.body.appendChild(
        exportNode
      );

      try {

        await waitForImages(
          exportNode
        );

        await document.fonts.ready;
        await nextFrame();

        const canvas =
          await html2canvas(
            exportNode,
            {
              scale: 3,

              width: CERT_WIDTH,
              height: CERT_HEIGHT,

              x: 0,
              y: 0,

              scrollX: 0,
              scrollY: 0,

              windowWidth:
                CERT_WIDTH,

              windowHeight:
                CERT_HEIGHT,

              backgroundColor:
                '#ffffff',

              useCORS: true,
              allowTaint: false,
              logging: false
            }
          );

        const pdf =
          new jsPDF({
            orientation:
              'landscape',

            unit: 'px',

            format: [
              CERT_WIDTH,
              CERT_HEIGHT
            ],

            hotfixes: [
              'px_scaling'
            ]
          });

        const pdfWidth =
          pdf.internal.pageSize
            .getWidth();

        const pdfHeight =
          pdf.internal.pageSize
            .getHeight();

        pdf.addImage(
          canvas.toDataURL(
            'image/png',
            1
          ),
          'PNG',
          0,
          0,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );

        pdf.save(
          `Certificado - ${confirmedName.trim()}.pdf`
        );

      } finally {

        exportNode.remove();

      }

    } catch (error) {

      console.error(
        'Error generando PDF:',
        error
      );

    } finally {

      setDownloading(false);

    }

  };

  return (
    <div className="app-shell">

      {/* ==============================
          NAVBAR
      ============================== */}

  <header className="topbar">
  <div className="navbar-inner">

    <div className="brand">
      <div className="brand-logos">
        <img
          src={logoOne}
          alt="Comisión de Evangelismo"
          className="nav-logo nav-logo-main"
        />

        <span className="nav-logo-divider" />

        <img
          src={logoTwo}
          alt="Federación Alianza Evangélica Costarricense"
          className="nav-logo nav-logo-secondary"
        />
      </div>

      <div className="brand-copy">
        <span className="eyebrow">
          ALIANZA EVANGÉLICA DE COSTA RICA
        </span>

        <strong>
          Certificados
          <span className="brand-dot">.</span>
        </strong>
      </div>
    </div>

    <div className="navbar-actions">

      <div className="secure-label">
        <span className="secure-icon">
          <CheckCircle2 size={15} />
        </span>

        <div className="secure-copy">
          <span>Acceso verificado</span>
          <strong>Registro autorizado</strong>
        </div>
      </div>

    </div>

  </div>
</header>


      {/* ==============================
          CONTENIDO
      ============================== */}

      <main className="page-content">

        <section className="hero">

          <div className="hero-copy">

            <div className="kicker">
              <Sparkles size={15} />
              Emisión digital
            </div>

            <h1>
              Descarga tu
              <br />
              <em>certificado</em>
            </h1>

            <p>
              Ingresa tu nombre para buscar y generar tu
              certificado.
            </p>

          </div>

          <div className="hero-art">

            <div className="art-ring ring-one" />
            <div className="art-ring ring-two" />

            <FileCheck2
              size={70}
              strokeWidth={1.2}
            />

          </div>

        </section>


        {/* ==============================
            FORMULARIO
        ============================== */}

        <section className="workspace">

          <div className="panel search-panel">

            <div className="section-heading">

              <div className="step">
                01
              </div>

              <div>

                <span>
                  Encuentra tu registro
                </span>

                <h2>
                  ¿Cuál es tu nombre?
                </h2>

              </div>

            </div>

            <div className="search-wrap">

              <Search size={19} />

              <input
                value={query}
                onChange={(event) => {
                  setQuery(
                    event.target.value
                  );

                  setSelected(null);
                  setModalOpen(false);
                }}
                placeholder="Escribe tu nombre..."
                aria-label="Buscar nombre"
              />

              {query && (

                <button
                  className="clear-button"
                  onClick={reset}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={17} />
                </button>

              )}

            </div>


            {matches.length > 0 &&
              !selected && (

                <div className="suggestions">

                  {matches.map(
                    (name) => (

                      <button
                        key={name}
                        className="suggestion"
                        onClick={() =>
                          chooseParticipant(
                            name
                          )
                        }
                      >

                        <span className="avatar">
                          {name.charAt(0)}
                        </span>

                        <span>
                          {name}
                        </span>

                        <ArrowRight
                          size={16}
                        />

                      </button>

                    )
                  )}

                </div>

              )}


            {query &&
              !selected &&
              matches.length === 0 && (

                <div className="empty-result">

                  No encontramos ese nombre
                  en la lista de participantes.
                  Verifica que esté escrito
                  correctamente.

                </div>

              )}


            {selected && (

              <div className="found-card">

                <CheckCircle2
                  size={20}
                />

                <div>

                  <strong>
                    Hemos encontrado tu registro
                  </strong>

                  <span>
                    Verifica tu nombre antes de continuar.
                  </span>

                </div>

              </div>

            )}

          </div>


          {/* CONFIRMACIÓN */}

          <div
            className={`panel confirmation-panel ${
              selected
                ? 'is-active'
                : ''
            }`}
          >

            <div className="section-heading">

              <div className="step">
                02
              </div>

              <div>

                <span>
                  Confirma tus datos
                </span>

                <h2>
                  Tu nombre en el certificado
                </h2>

              </div>

            </div>

            <label htmlFor="confirmed-name">
              Nombre confirmado
            </label>

            <input
              id="confirmed-name"
              className="name-input"
              value={confirmedName}
              onChange={(event) =>
                setConfirmedName(
                  event.target.value
                )
              }
              disabled={!selected}
              placeholder="Selecciona un registro primero"
            />

            <p className="helper">
              Si encuentras un error de escritura,
              puedes corregirlo antes de generar
              tu certificado.
            </p>

            <button
              className="primary-button"
              disabled={
                !selected ||
                !confirmedName.trim()
              }
              onClick={() => {
                setIssuedAt(new Date());
                setModalOpen(true);
              }}
            >

              Generar certificado

              <ArrowRight size={18} />

            </button>

          </div>

        </section>


        {/* ==============================
            COPYRIGHT + CRÉDITO
        ============================== */}

        <footer className="border-t border-gray-100 pt-4 mt-10 flex flex-col md:flex-row items-center justify-between gap-2">

          <p className="text-gray-400 text-xs text-center md:text-left">

            © {new Date().getFullYear()} Comisión de Evangelismo de la Alianza Evangélica de Costa Rica. Todos los derechos reservados.

          </p>

          <p className="text-gray-400 text-xs flex items-center gap-1 flex-wrap justify-center">

            Sitio web elaborado con

            <Heart
              size={11}
              className="text-red-500 animate-pulse mx-0.5"
              fill="currentColor"
            />

            por

            <a
              href="https://innovacioncr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 ml-0.5 transition-colors font-semibold"
            >
              Innovación con propósito — Andrés Castro Rodríguez
            </a>

          </p>

        </footer>

      </main>


      {/* ==============================
          MODAL DEL CERTIFICADO
      ============================== */}

      {modalOpen && (

        <div
          className="modal-overlay"
          onClick={() =>
            setModalOpen(false)
          }
          role="dialog"
          aria-modal="true"
        >

          <div
            className="modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <div className="kicker">

                  <CheckCircle2
                    size={15}
                  />

                  Listo para descargar

                </div>

                <h2>
                  Tu certificado está listo
                </h2>

                <p>
                  Revisa la vista previa y elige
                  cómo quieres conservarlo.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setModalOpen(false)
                }
                aria-label="Cerrar"
              >
                <X size={22} />
              </button>

            </div>


            <div
              className="certificate-viewport"
              ref={viewportRef}
            >

              <div
  className="certificate-scale"
  style={{
    width: CERT_WIDTH,
    height: CERT_HEIGHT,
    transform: `translate(-50%, -50%) scale(${scale})`,
    transformOrigin: 'center center'
  }}
>

                <Certificate
                  name={
                    confirmedName.trim()
                  }
                  issuedAt={
                    issuedAt ?? new Date()
                  }
                  certificateRef={
                    certificateRef
                  }
                />

              </div>

            </div>


            <div className="certificate-actions">

              <button
                onClick={
                  downloadCertificate
                }
                disabled={downloading}
              >

                {downloading ? (

                  <Loader2
                    size={17}
                    className="spin"
                  />

                ) : (

                  <Download
                    size={17}
                  />

                )}

                {downloading
                  ? 'Generando PDF...'
                  : 'Descargar PDF'}

              </button>


              <button
                onClick={() =>
                  window.print()
                }
                disabled={downloading}
              >

                <Printer size={17} />

                Imprimir

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;