import type { Metadata } from "next";
import { siteOwner, ownerAddress } from "@/lib/legal-owner";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · default-credentials",
  robots: { index: false, follow: false },
};

const CONTROLLER = {
  name: siteOwner.name,
  address: ownerAddress(),
  email: siteOwner.email,
};

export default function DatenschutzPage() {
  return (
    <article className="legal">
      <header className="legal-header">
        <h1>Datenschutzerklärung</h1>
        <p className="muted">
          Stand: Mai 2026 &nbsp;·&nbsp; DSGVO-konform &nbsp;·&nbsp; Art. 13 / 14
        </p>
      </header>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) für diese Website ist:
      </p>
      <p>
        {CONTROLLER.name}<br />
        {CONTROLLER.address}<br />
        E-Mail: <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a>
      </p>

      <h2>2. Überblick der Verarbeitungen</h2>
      <p>
        Diese Website ist ein öffentliches Nachschlagewerk für Standard-Zugangsdaten von
        Netzwerkgeräten und Software-Produkten. Sie richtet sich an Sicherheitsforscher,
        Penetrationstester und CTF-Teilnehmer.
      </p>
      <p>
        Es werden keine personenbezogenen Daten aktiv erhoben. Es werden lediglich anonymisierte
        Nutzungsstatistiken über Vercel Analytics erfasst (siehe Abschnitt 4).
      </p>

      <h2>3. Hosting bei Vercel</h2>
      <p>
        Diese Website wird über die Infrastruktur von Vercel Inc. bereitgestellt.
      </p>
      <p>
        Vercel Inc.<br />
        340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">
          Datenschutzerklärung Vercel →
        </a>
      </p>
      <p>
        Beim Aufruf der Website werden durch Vercel technisch notwendige Daten in
        Server-Logfiles erfasst:
      </p>
      <ul>
        <li>IP-Adresse (anonymisiert/gekürzt)</li>
        <li>Datum und Uhrzeit des Abrufs</li>
        <li>Aufgerufene URL</li>
        <li>Browser, Betriebssystem, HTTP-Statuscode</li>
      </ul>
      <p>
        Diese Daten werden ausschließlich zur Gewährleistung des sicheren und stabilen Betriebs
        verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
      </p>
      <p>
        Vercel Inc. hat seinen Sitz in den USA. Die Datenübertragung erfolgt auf Basis der
        EU-Standard&shy;vertrags&shy;klauseln gemäß Art. 46 Abs. 2 lit. c DSGVO.
      </p>

      <h2>
        4. Vercel Analytics{" "}
        <span className="badge badge-on">Aktiv</span>
      </h2>
      <p>
        Wir nutzen Vercel Analytics zur Auswertung anonymer Nutzungsstatistiken. Vercel Analytics
        ist datenschutzfreundlich konzipiert:
      </p>
      <ul>
        <li>Es werden keine Cookies gesetzt</li>
        <li>IP-Adressen werden nicht gespeichert</li>
        <li>Kein Tracking über Websites hinweg</li>
        <li>Alle Metriken sind aggregiert und nicht auf einzelne Personen zurückführbar</li>
      </ul>
      <p>
        Erfasste Metriken umfassen u. a. Seitenaufrufe, Verweisquellen sowie Gerät und ungefähres
        Land (auf Basis anonymisierter Daten).
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verbesserung
        des Angebots). Da keine personenbezogenen Daten verarbeitet werden, ist eine Einwilligung
        nach derzeitiger Rechtslage nicht erforderlich.
      </p>
      <p>
        Weitere Informationen:{" "}
        <a
          href="https://vercel.com/docs/analytics/privacy-policy"
          target="_blank"
          rel="noreferrer"
        >
          Vercel Analytics Datenschutz →
        </a>
      </p>

      <h2>
        5. Blog{" "}
        <span className="badge badge-planned">Geplant</span>
      </h2>
      <p>
        Diese Website wird zukünftig um einen Blog erweitert, in dem Inhalte zu IT-Sicherheit,
        Penetrationstests und CTF-Challenges veröffentlicht werden.
      </p>
      <p>
        Die Datenverarbeitung im Rahmen des Blogs beschränkt sich auf anonyme Seitenaufruf-Statistiken
        gemäß Abschnitt 4. Eine Kommentarfunktion oder Nutzerregistrierung ist derzeit nicht
        geplant.
      </p>
      <p>
        Sollten zukünftig interaktive Funktionen (z. B. Kommentare, Kontaktformulare oder
        Newsletter) hinzugefügt werden, wird diese Datenschutzerklärung entsprechend
        aktualisiert und eine separate Einwilligung eingeholt, sofern erforderlich.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Diese Website verwendet keine Cookies zu Tracking- oder Werbezwecken. Es werden
        ausschließlich technisch notwendige Funktionen der Vercel-Infrastruktur genutzt.
      </p>

      <h2>7. Deine Rechte</h2>
      <p>Nach der DSGVO stehen dir folgende Rechte zu:</p>
      <ul>
        <li>Auskunftsrecht (Art. 15 DSGVO)</li>
        <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
        <li>Recht auf Löschung (Art. 17 DSGVO)</li>
        <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
      </ul>
      <p>
        Da keine personenbezogenen Daten aktiv erhoben werden, können diese Rechte im Regelfall
        mangels vorhandener Daten nicht angewendet werden. Du kannst uns dennoch jederzeit unter
        der oben genannten E-Mail-Adresse kontaktieren.
      </p>
      <p>
        Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
        In Deutschland ist dies der Bundesbeauftragte für den Datenschutz und die
        Informationsfreiheit (BfDI) oder die zuständige Landesbehörde.
      </p>

      <h2>8. Externe Links</h2>
      <p>
        Diese Website kann Links zu externen Websites Dritter enthalten, auf deren Inhalte wir
        keinen Einfluss haben. Für Inhalte und Datenschutz verlinkter Seiten ist stets der
        jeweilige Anbieter verantwortlich.
      </p>

      <h2>9. Aktualität &amp; Änderungen</h2>
      <p>
        Diese Datenschutzerklärung hat den Stand Mai 2026. Durch die Weiterentwicklung des
        Angebots (z. B. Blog, Newsletter) kann eine Anpassung notwendig werden. Die jeweils
        aktuelle Version ist stets auf dieser Seite abrufbar.
      </p>

      <p className="muted" style={{ marginTop: "2rem" }}>
        <a href="/">← zurück zur Startseite</a>
      </p>
    </article>
  );
}
