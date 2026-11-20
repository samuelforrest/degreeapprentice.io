// The downloadable PDF. Loaded only when someone clicks "Download PDF", so the PDF library
// never weighs down the page. Uses the built-in Helvetica font and real text, so applicant
// tracking systems can read it. Keep the layout in step with cv-preview.tsx.
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { contactLine, lines, visibleSections, type Cv } from "@/lib/cv/types";

// Never split words with hyphens at line ends.
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { paddingVertical: 36, paddingHorizontal: 42, fontFamily: "Helvetica", fontSize: 9.5, lineHeight: 1.35, color: "#111" },
  name: { fontFamily: "Helvetica-Bold", fontSize: 20, lineHeight: 1.1 },
  headline: { fontSize: 10.5, marginTop: 3, color: "#333" },
  contact: { fontSize: 9, marginTop: 4, color: "#444" },
  section: { marginTop: 12 },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingBottom: 2,
    marginBottom: 5,
    borderBottomWidth: 0.75,
    borderBottomColor: "#999",
  },
  entry: { marginBottom: 6 },
  entryTop: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  entryTitle: { fontFamily: "Helvetica-Bold", flex: 1 },
  dates: { color: "#444" },
  organisation: { fontFamily: "Helvetica-Oblique", color: "#333" },
  bullet: { flexDirection: "row", marginTop: 1.5 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
});

function Bullets({ items }: { items: string[] }) {
  return items.map((item, i) => (
    <View key={i} style={styles.bullet} wrap={false}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{item}</Text>
    </View>
  ));
}

export function CvDocument({ cv }: { cv: Cv }) {
  return (
    <Document title={cv.name ? `${cv.name} CV` : "CV"} author={cv.name} creator="degreeapprentice.io CV builder">
      <Page size="A4" style={styles.page}>
        {cv.name.trim() && <Text style={styles.name}>{cv.name}</Text>}
        {cv.headline.trim() && <Text style={styles.headline}>{cv.headline}</Text>}
        {contactLine(cv).length > 0 && <Text style={styles.contact}>{contactLine(cv).join("  ·  ")}</Text>}

        {visibleSections(cv).map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.heading} minPresenceAhead={30}>
              {section.title}
            </Text>
            {section.kind === "text" && <Text>{section.body}</Text>}
            {section.kind === "list" && <Bullets items={lines(section.items)} />}
            {section.kind === "entries" &&
              section.entries.map((e) => (
                <View key={e.id} style={styles.entry} wrap={false}>
                  <View style={styles.entryTop}>
                    <Text style={styles.entryTitle}>{e.title}</Text>
                    {e.dates.trim() && <Text style={styles.dates}>{e.dates}</Text>}
                  </View>
                  {(e.organisation.trim() || e.location.trim()) && (
                    <Text style={styles.organisation}>{[e.organisation, e.location].filter((s) => s.trim()).join(", ")}</Text>
                  )}
                  <Bullets items={lines(e.bullets)} />
                </View>
              ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
