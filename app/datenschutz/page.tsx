import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · default-credentials",
  robots: { index: false, follow: false },
};

const CONTROLLER = {
  name: "***REDACTED***",
  address: "***REDACTED***",
  email: "***REDACTED***",
};

export default function DatenschutzPage() {
  return (
    <article className="legal">
      <h1>Datenschutzerklärung</h1>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br />
        {CONTROLLER.name}<br />
        {CONTROLLER.address}<br />
        E-Mail: <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a>
      </p>

      <h2>2. Zweck und Umfang dieses Dienstes</h2>
      <p>
        Diese Website stellt einen öffentlich zugänglichen, von der Community gepflegten
        Katalog bekannter Standard-Zugangsdaten (Default Credentials) für Sicherheitsforschung,
        Penetrationstests und CTF-Wettbewerbe bereit. Es werden keine Nutzerkonten angelegt,
        keine Cookies gesetzt und keine Analyse- oder Tracking-Werkzeuge eingesetzt.
      </p>

      <h2>3. Hosting und Server-Logs</h2>
      <p>
        Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA
        gehostet. Bei jedem Aufruf einer Seite überträgt der Browser technisch zwingend
        bestimmte Daten an Vercel (insbesondere IP-Adresse, Zeitpunkt der Anfrage, abgerufene
        URL, übermittelter User-Agent, Referrer). Diese Daten werden von Vercel zur
        Auslieferung der Inhalte und zur Sicherheit des Dienstes (z. B. zur Abwehr von Angriffen)
        verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
        einer technisch sicheren und stabilen Bereitstellung der Website).
      </p>
      <p>
        Vercel ist ein in den USA ansässiger Anbieter. Eine Übermittlung in ein Drittland im
        Sinne der DSGVO findet statt; die Datenübermittlung erfolgt auf Grundlage der EU-Standard&shy;vertrags&shy;klauseln
        (Art. 46 Abs. 2 lit. c DSGVO).
        Details siehe{" "}
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">vercel.com/legal/privacy-policy</a>.
      </p>

      <h2>4. API-Aufrufe</h2>
      <p>
        Diese Website bietet eine öffentliche JSON-API unter <code>/api/*</code>. Für API-Aufrufe
        gelten dieselben technischen Verarbeitungen wie für reguläre Seitenaufrufe; eine
        Authentifizierung findet nicht statt und es werden keine personenbezogenen Daten von
        den abrufenden Systemen erhoben.
      </p>

      <h2>5. Keine Cookies, kein Tracking</h2>
      <p>
        Diese Website setzt keine Cookies. Es wird kein Analyse-, Werbe- oder Tracking-Tool
        (z. B. Google Analytics, Plausible, Matomo, Meta Pixel) eingesetzt.
      </p>

      <h2>6. Rechte der betroffenen Personen</h2>
      <p>
        Soweit personenbezogene Daten (etwa IP-Adressen in Server-Logs) verarbeitet werden,
        stehen Ihnen folgende Rechte zu: Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO),
        Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO),
        Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch (Art. 21 DSGVO). Wenden Sie sich
        zur Geltendmachung dieser Rechte an die oben unter Punkt 1 angegebene E-Mail-Adresse.
      </p>
      <p>
        Unabhängig davon haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
        beschweren (Art. 77 DSGVO).
      </p>

      <h2>7. Änderungen dieser Erklärung</h2>
      <p>
        Diese Datenschutzerklärung kann angepasst werden, wenn sich technische Gegebenheiten
        oder rechtliche Vorgaben ändern. Die jeweils aktuelle Fassung ist auf dieser Seite
        abrufbar.
      </p>

      <p className="muted" style={{ marginTop: "2rem" }}>
        <a href="/">← zurück zur Startseite</a>
      </p>
    </article>
  );
}
