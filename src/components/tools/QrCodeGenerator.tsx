import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type QRCodeStyling from 'qr-code-styling';
import type { CornerDotType, CornerSquareType, DotType, GradientType } from 'qr-code-styling';
import ToolShell from '../layout/ToolShell';
import ToolPageScaffold from '../layout/ToolPageScaffold';
import ToggleGroup from '../ui/ToggleGroup';
import TrustPanel from '../content/TrustPanel';
import InlineDisclaimer from '../content/InlineDisclaimer';
import AccordionKnowledge from '../content/AccordionKnowledge';
import ScenarioStrip from '../content/ScenarioStrip';
import { usePersistentState } from '../../lib/usePersistentState';
import { TOOL_CONTENT } from '../../lib/tool-content';

type QrMode = 'url' | 'text' | 'wifi' | 'vcard';
type ErrorLevel = 'L' | 'M' | 'Q' | 'H';
type FrameStyle = 'none' | 'scan';

interface QrState {
  mode: QrMode;
  url: string;
  text: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: 'WPA' | 'WEP' | 'nopass';
  wifiHidden: boolean;
  vcardName: string;
  vcardPhone: string;
  vcardEmail: string;
  vcardOrg: string;
  foreground: string;
  foregroundEnd: string;
  eyeColor: string;
  background: string;
  transparentBackground: boolean;
  useGradient: boolean;
  gradientType: GradientType;
  margin: number;
  size: number;
  dotStyle: DotType;
  cornerSquareStyle: CornerSquareType;
  cornerDotStyle: CornerDotType;
  errorCorrectionLevel: ErrorLevel;
  logoDataUrl: string;
  logoSize: number;
  logoMargin: number;
  logoName: string;
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
}

const content = TOOL_CONTENT.qrcode;

const initialState: QrState = {
  mode: 'url',
  url: 'https://rechner.tools',
  text: 'Hallo von rechner.tools',
  wifiSsid: 'Mein WLAN',
  wifiPassword: '',
  wifiEncryption: 'WPA',
  wifiHidden: false,
  vcardName: 'Max Mustermann',
  vcardPhone: '+49 170 1234567',
  vcardEmail: 'max@example.com',
  vcardOrg: 'Muster GmbH',
  foreground: '#111827',
  foregroundEnd: '#16a34a',
  eyeColor: '#14532d',
  background: '#ffffff',
  transparentBackground: false,
  useGradient: false,
  gradientType: 'linear',
  margin: 3,
  size: 960,
  dotStyle: 'square',
  cornerSquareStyle: 'extra-rounded',
  cornerDotStyle: 'dot',
  errorCorrectionLevel: 'M',
  logoDataUrl: '',
  logoSize: 0.24,
  logoMargin: 6,
  logoName: '',
  frameStyle: 'none',
  frameText: 'SCAN ME',
  frameColor: '#168a5a',
};

const modeOptions = [
  { label: 'URL', value: 'url' },
  { label: 'Text', value: 'text' },
  { label: 'WLAN', value: 'wifi' },
  { label: 'vCard', value: 'vcard' },
];

const errorOptions = [
  { label: 'Normal', value: 'M' },
  { label: 'Robust', value: 'Q' },
  { label: 'Maximal', value: 'H' },
];

const dotOptions = [
  { label: 'Klassisch', value: 'square' },
  { label: 'Rund', value: 'rounded' },
  { label: 'Punkte', value: 'dots' },
  { label: 'Elegant', value: 'classy-rounded' },
];

const cornerOptions = [
  { label: 'Rund', value: 'extra-rounded' },
  { label: 'Quadrat', value: 'square' },
  { label: 'Punkt', value: 'dot' },
];

const gradientOptions = [
  { label: 'Linear', value: 'linear' },
  { label: 'Radial', value: 'radial' },
];

const frameOptions = [
  { label: 'Ohne', value: 'none' },
  { label: 'Scan', value: 'scan' },
];

const intentBadges = ['Logo möglich', 'Brand-Farben', 'PNG & SVG', 'Lokal im Browser'];

function escapeWifiValue(value: string) {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function buildVCard(state: QrState) {
  const name = state.vcardName.trim();
  const parts = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name || 'Kontakt'}`,
    state.vcardOrg.trim() ? `ORG:${state.vcardOrg.trim()}` : '',
    state.vcardPhone.trim() ? `TEL:${state.vcardPhone.trim()}` : '',
    state.vcardEmail.trim() ? `EMAIL:${state.vcardEmail.trim()}` : '',
    'END:VCARD',
  ];

  return parts.filter(Boolean).join('\n');
}

function buildPayload(state: QrState) {
  switch (state.mode) {
    case 'url':
      return normalizeUrl(state.url);
    case 'wifi': {
      const ssid = escapeWifiValue(state.wifiSsid.trim());
      const password = escapeWifiValue(state.wifiPassword);
      const type = state.wifiEncryption === 'nopass' ? 'nopass' : state.wifiEncryption;
      return `WIFI:T:${type};S:${ssid};P:${password};H:${state.wifiHidden ? 'true' : 'false'};;`;
    }
    case 'vcard':
      return buildVCard(state);
    case 'text':
    default:
      return state.text.trim();
  }
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="9"
        y="9"
        width="10"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs leading-4 text-ink-faint">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export default function QrCodeGenerator() {
  const [savedState, setState] = usePersistentState<QrState>('rechner-tools:qrcode:v2', initialState);
  const state = useMemo(() => ({ ...initialState, ...savedState }), [savedState]);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [qrError, setQrError] = useState('');
  const [copied, setCopied] = useState(false);

  const payload = useMemo(() => buildPayload(state), [state]);
  const payloadLength = payload.length;

  useEffect(() => {
    let cancelled = false;

    async function renderQrCode() {
      if (!payload) {
        setQrError('Gib zuerst einen Inhalt ein.');
        setIsReady(false);
        if (previewRef.current) previewRef.current.innerHTML = '';
        return;
      }

      try {
        const { default: QRCodeStyling } = await import('qr-code-styling');
        if (cancelled || !previewRef.current) return;

        const gradient = state.useGradient
          ? {
              type: state.gradientType,
              rotation: 0.78,
              colorStops: [
                { offset: 0, color: state.foreground },
                { offset: 1, color: state.foregroundEnd },
              ],
            }
          : undefined;
        const options = {
          type: 'svg' as const,
          shape: 'square' as const,
          width: state.size,
          height: state.size,
          data: payload,
          image: state.logoDataUrl || undefined,
          margin: state.margin * 8,
          qrOptions: {
            errorCorrectionLevel: state.logoDataUrl ? 'H' : state.errorCorrectionLevel,
          },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: state.logoSize,
            margin: state.logoMargin,
          },
          dotsOptions: {
            type: state.dotStyle,
            color: state.foreground,
            gradient,
          },
          cornersSquareOptions: {
            type: state.cornerSquareStyle,
            color: state.eyeColor,
          },
          cornersDotOptions: {
            type: state.cornerDotStyle,
            color: state.eyeColor,
          },
          backgroundOptions: {
            color: state.transparentBackground ? 'transparent' : state.background,
          },
        };

        if (!qrRef.current) {
          qrRef.current = new QRCodeStyling(options);
        } else {
          qrRef.current.update(options);
        }

        previewRef.current.innerHTML = '';
        qrRef.current.append(previewRef.current);

        if (!cancelled) {
          setQrError('');
          setIsReady(true);
        }
      } catch {
        if (!cancelled) {
          setQrError('Dieser Inhalt oder diese Gestaltung ist zu komplex. Kürze den Inhalt oder entferne das Logo.');
          setIsReady(false);
          if (previewRef.current) previewRef.current.innerHTML = '';
        }
      }
    }

    renderQrCode();
    return () => {
      cancelled = true;
    };
  }, [
    payload,
    state.background,
    state.cornerDotStyle,
    state.cornerSquareStyle,
    state.dotStyle,
    state.errorCorrectionLevel,
    state.eyeColor,
    state.foreground,
    state.foregroundEnd,
    state.gradientType,
    state.logoDataUrl,
    state.logoMargin,
    state.logoSize,
    state.margin,
    state.size,
    state.transparentBackground,
    state.useGradient,
  ]);

  function update<K extends keyof QrState>(key: K, value: QrState[K]) {
    setState({ ...state, [key]: value });
  }

  async function handleLogoUpload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setQrError('Bitte lade eine Bilddatei hoch.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setQrError('Das Logo darf maximal 2 MB groß sein.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setState({
        ...state,
        logoDataUrl: String(reader.result || ''),
        logoName: file.name,
        errorCorrectionLevel: 'H',
      });
    };
    reader.readAsDataURL(file);
  }

  async function download(extension: 'png' | 'svg') {
    if (!qrRef.current || !isReady) return;
    try {
      const rawData = await qrRef.current.getRawData(extension);
      if (!rawData) return;
      const blob = rawData instanceof Blob ? rawData : new Blob([rawData]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code.${extension}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setQrError('Der Download konnte nicht erstellt werden.');
    }
  }

  async function copyPayload() {
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const knowledgeItems = content.faqs.map((faq) => ({
    title: faq.question,
    body: faq.answer,
  }));

  const frameLabel = state.frameStyle === 'none' ? 'Pur' : state.frameText.trim() || 'SCAN';

  return (
    <ToolShell
      title="QR-Code-Generator"
      description="Kostenlos QR-Code erstellen: URL, Text, WLAN-Zugang oder Kontakt eingeben und als PNG oder SVG herunterladen."
      category="Tools"
    >
      <ToolPageScaffold
        heroSummary={
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated">
            <div className="border-b border-border px-5 py-4">
              <p className="text-sm leading-6 text-ink">
                Erstelle QR-Codes direkt im Browser. Deine Eingaben und Logos werden nicht an einen
                externen QR-Dienst gesendet.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {intentBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-accent/15 bg-accent/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-strong"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-3 px-5 py-4 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  Design
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-ink">
                  {dotOptions.find((option) => option.value === state.dotStyle)?.label}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  Inhalt
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-ink">
                  {payloadLength} Zeichen
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  Logo
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-accent-strong">
                  {state.logoDataUrl ? 'Aktiv' : 'Optional'}
                </p>
              </div>
            </div>
          </div>
        }
        calculator={
          <section className="rounded-2xl border border-border bg-white p-4 sm:p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-ink">QR-Code erstellen</h2>
                <p className="mt-1 text-sm leading-6 text-ink-muted">
                  Inhalt, Form, Farben, Logo und Exportgröße frei anpassen.
                </p>
              </div>
              <ToggleGroup
                options={modeOptions}
                value={state.mode}
                onChange={(value) => update('mode', value as QrMode)}
              />
            </div>

            <div className="space-y-5">
              {state.mode === 'url' && (
                <Field
                  label="Website oder Link"
                  hint="Ohne https:// ergänzt der Generator https:// automatisch."
                >
                  <input
                    type="text"
                    value={state.url}
                    onChange={(event) => update('url', event.target.value)}
                    className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    placeholder="https://example.com"
                  />
                </Field>
              )}

              {state.mode === 'text' && (
                <Field label="Text">
                  <textarea
                    value={state.text}
                    onChange={(event) => update('text', event.target.value)}
                    className="min-h-36 w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm leading-6 text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    placeholder="Text eingeben"
                  />
                </Field>
              )}

              {state.mode === 'wifi' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="WLAN-Name (SSID)">
                    <input
                      type="text"
                      value={state.wifiSsid}
                      onChange={(event) => update('wifiSsid', event.target.value)}
                      className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    />
                  </Field>
                  <Field label="Passwort">
                    <input
                      type="text"
                      value={state.wifiPassword}
                      onChange={(event) => update('wifiPassword', event.target.value)}
                      className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    />
                  </Field>
                  <Field label="Verschlüsselung">
                    <select
                      value={state.wifiEncryption}
                      onChange={(event) =>
                        update('wifiEncryption', event.target.value as QrState['wifiEncryption'])
                      }
                      className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    >
                      <option value="WPA">WPA/WPA2/WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Offen</option>
                    </select>
                  </Field>
                  <label className="flex min-h-11 items-center gap-3 self-end rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={state.wifiHidden}
                      onChange={(event) => update('wifiHidden', event.target.checked)}
                      className="h-4 w-4 accent-[var(--color-accent)]"
                    />
                    Verstecktes Netzwerk
                  </label>
                </div>
              )}

              {state.mode === 'vcard' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      type="text"
                      value={state.vcardName}
                      onChange={(event) => update('vcardName', event.target.value)}
                      className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    />
                  </Field>
                  <Field label="Organisation">
                    <input
                      type="text"
                      value={state.vcardOrg}
                      onChange={(event) => update('vcardOrg', event.target.value)}
                      className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    />
                  </Field>
                  <Field label="Telefon">
                    <input
                      type="tel"
                      value={state.vcardPhone}
                      onChange={(event) => update('vcardPhone', event.target.value)}
                      className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    />
                  </Field>
                  <Field label="E-Mail">
                    <input
                      type="email"
                      value={state.vcardEmail}
                      onChange={(event) => update('vcardEmail', event.target.value)}
                      className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                    />
                  </Field>
                </div>
              )}

              <div className="border-t border-border pt-5">
                <h3 className="font-display text-lg font-bold text-ink">Design</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Punkt-Stil">
                    <ToggleGroup
                      options={dotOptions}
                      value={state.dotStyle}
                      onChange={(value) => update('dotStyle', value as DotType)}
                    />
                  </Field>
                  <Field label="Ecken-Rahmen">
                    <ToggleGroup
                      options={cornerOptions}
                      value={state.cornerSquareStyle}
                      onChange={(value) => update('cornerSquareStyle', value as CornerSquareType)}
                    />
                  </Field>
                  <Field label="Ecken-Kern">
                    <ToggleGroup
                      options={cornerOptions}
                      value={state.cornerDotStyle}
                      onChange={(value) => update('cornerDotStyle', value as CornerDotType)}
                    />
                  </Field>
                  <Field label="Frame">
                    <ToggleGroup
                      options={frameOptions}
                      value={state.frameStyle}
                      onChange={(value) => update('frameStyle', value as FrameStyle)}
                    />
                  </Field>
                  {state.frameStyle !== 'none' && (
                    <>
                      <Field label="Frame-Text">
                        <input
                          type="text"
                          value={state.frameText}
                          onChange={(event) => update('frameText', event.target.value)}
                          className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                        />
                      </Field>
                      <Field label="Frame-Farbe">
                        <input
                          type="color"
                          value={state.frameColor}
                          onChange={(event) => update('frameColor', event.target.value)}
                          className="h-11 w-full rounded-lg border border-border bg-white p-1"
                          aria-label="Frame-Farbe"
                        />
                      </Field>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <h3 className="font-display text-lg font-bold text-ink">Farben</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Vordergrund">
                    <input
                      type="color"
                      value={state.foreground}
                      onChange={(event) => update('foreground', event.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-white p-1"
                      aria-label="Vordergrundfarbe"
                    />
                  </Field>
                  <Field label="Augenfarbe">
                    <input
                      type="color"
                      value={state.eyeColor}
                      onChange={(event) => update('eyeColor', event.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-white p-1"
                      aria-label="Augenfarbe"
                    />
                  </Field>
                  <Field label="Hintergrund">
                    <input
                      type="color"
                      value={state.background}
                      onChange={(event) => update('background', event.target.value)}
                      disabled={state.transparentBackground}
                      className="h-11 w-full rounded-lg border border-border bg-white p-1 disabled:opacity-40"
                      aria-label="Hintergrundfarbe"
                    />
                  </Field>
                  <label className="flex min-h-11 items-center gap-3 self-end rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={state.transparentBackground}
                      onChange={(event) => update('transparentBackground', event.target.checked)}
                      className="h-4 w-4 accent-[var(--color-accent)]"
                    />
                    Transparenter Hintergrund
                  </label>
                  <label className="flex min-h-11 items-center gap-3 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={state.useGradient}
                      onChange={(event) => update('useGradient', event.target.checked)}
                      className="h-4 w-4 accent-[var(--color-accent)]"
                    />
                    Gradient nutzen
                  </label>
                  {state.useGradient && (
                    <>
                      <Field label="Gradient-Farbe">
                        <input
                          type="color"
                          value={state.foregroundEnd}
                          onChange={(event) => update('foregroundEnd', event.target.value)}
                          className="h-11 w-full rounded-lg border border-border bg-white p-1"
                          aria-label="Gradient-Farbe"
                        />
                      </Field>
                      <Field label="Gradient-Typ">
                        <ToggleGroup
                          options={gradientOptions}
                          value={state.gradientType}
                          onChange={(value) => update('gradientType', value as GradientType)}
                        />
                      </Field>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <h3 className="font-display text-lg font-bold text-ink">Logo</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Logo hochladen" hint="PNG, JPG, GIF oder SVG bis 2 MB.">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleLogoUpload(event.target.files?.[0])}
                      className="block w-full text-sm text-ink-muted file:mr-3 file:min-h-10 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:text-sm file:font-medium file:text-white"
                    />
                    {state.logoName && (
                      <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-surface-elevated px-3 py-2 text-xs text-ink-muted">
                        <span className="truncate">{state.logoName}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setState({ ...state, logoDataUrl: '', logoName: '', logoSize: 0.24 })
                          }
                          className="font-medium text-accent hover:text-accent-strong"
                        >
                          Entfernen
                        </button>
                      </div>
                    )}
                  </Field>
                  <Field label="Logo-Größe" hint="Zu große Logos können Scans verschlechtern.">
                    <input
                      type="range"
                      min="0.12"
                      max="0.34"
                      step="0.01"
                      value={state.logoSize}
                      onChange={(event) => update('logoSize', Number(event.target.value))}
                      className="w-full accent-[var(--color-accent)]"
                      aria-label="Logo-Größe"
                    />
                    <p className="mt-1 font-mono text-[11px] text-ink-faint">
                      {Math.round(state.logoSize * 100)} %
                    </p>
                  </Field>
                  <Field label="Logo-Abstand">
                    <input
                      type="range"
                      min="0"
                      max="18"
                      value={state.logoMargin}
                      onChange={(event) => update('logoMargin', Number(event.target.value))}
                      className="w-full accent-[var(--color-accent)]"
                      aria-label="Logo-Abstand"
                    />
                    <p className="mt-1 font-mono text-[11px] text-ink-faint">
                      {state.logoMargin}px
                    </p>
                  </Field>
                </div>
              </div>

              <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                <Field label="Rand" hint="Mehr Rand verbessert die Scanbarkeit.">
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={state.margin}
                    onChange={(event) => update('margin', Number(event.target.value))}
                    className="w-full accent-[var(--color-accent)]"
                    aria-label="QR-Code-Rand"
                  />
                  <p className="mt-1 font-mono text-[11px] text-ink-faint">{state.margin} Module</p>
                </Field>
                <Field label="Exportgröße">
                  <select
                    value={state.size}
                    onChange={(event) => update('size', Number(event.target.value))}
                    className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
                  >
                    <option value={512}>512 px</option>
                    <option value={960}>960 px</option>
                    <option value={1600}>1600 px</option>
                    <option value={2400}>2400 px</option>
                  </select>
                </Field>
                <Field label="Fehlerkorrektur">
                  <ToggleGroup
                    options={errorOptions}
                    value={state.logoDataUrl ? 'H' : state.errorCorrectionLevel}
                    onChange={(value) => update('errorCorrectionLevel', value as ErrorLevel)}
                  />
                  {state.logoDataUrl && (
                    <p className="mt-2 text-xs leading-5 text-ink-faint">
                      Mit Logo wird automatisch maximale Fehlerkorrektur genutzt.
                    </p>
                  )}
                </Field>
              </div>
            </div>
          </section>
        }
        result={
          <section className="rounded-2xl border border-border bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Vorschau</h2>
                <p className="mt-1 text-xs leading-5 text-ink-muted">
                  Zum Testen mit der Kamera scannen.
                </p>
              </div>
              <button
                type="button"
                onClick={copyPayload}
                disabled={!payload}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:border-accent-mid hover:text-ink disabled:opacity-40"
                title="Inhalt kopieren"
                aria-label="Inhalt kopieren"
              >
                <CopyIcon />
              </button>
            </div>
            <div
              className={`mt-4 rounded-xl border border-border bg-surface-elevated p-4 ${
                state.frameStyle === 'none' ? '' : 'pb-5'
              }`}
            >
              {state.frameStyle !== 'none' && (
                <div
                  className="mb-3 rounded-lg px-3 py-2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                  style={{ backgroundColor: state.frameColor }}
                >
                  {frameLabel}
                </div>
              )}
              <div className="flex aspect-square items-center justify-center rounded-lg bg-white p-2">
                <div
                  ref={previewRef}
                  className="flex h-full w-full items-center justify-center [&_svg]:h-full [&_svg]:w-full"
                  aria-label="Generierter QR-Code"
                />
                {!isReady && (
                  <p className="px-3 text-center text-sm leading-6 text-ink-muted">{qrError}</p>
                )}
              </div>
            </div>
            {copied && <p className="mt-2 text-xs font-medium text-accent">Inhalt kopiert.</p>}
            {qrError && <p className="mt-2 text-xs font-medium text-red-600">{qrError}</p>}
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => download('png')}
                disabled={!isReady}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-mid disabled:opacity-40"
              >
                <DownloadIcon /> PNG
              </button>
              <button
                type="button"
                onClick={() => download('svg')}
                disabled={!isReady}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-accent-mid hover:text-ink disabled:opacity-40"
              >
                <DownloadIcon /> SVG
              </button>
            </div>
          </section>
        }
        sidebar={
          <InlineDisclaimer>
            Logos, runde Punkte und helle Farben sehen gut aus, brauchen aber Kontrast. Scanne den
            QR-Code vor Druck oder Veröffentlichung mit mehreren Geräten.
          </InlineDisclaimer>
        }
        analysis={<ScenarioStrip title="Typische QR-Code-Einsätze" items={content.scenarios} />}
        trust={
          <div className="space-y-5">
            <TrustPanel
              summary={content.summary}
              updatedAt={content.updatedAt}
              checkedAgainst={content.checkedAgainst}
              sources={content.sources}
            />
            <AccordionKnowledge title="Häufige Fragen" items={knowledgeItems} />
          </div>
        }
      />
    </ToolShell>
  );
}
