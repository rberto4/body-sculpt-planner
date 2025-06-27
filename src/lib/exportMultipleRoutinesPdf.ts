// Utility per esportare più routine in un unico PDF
export async function exportMultipleRoutinesPdf(routines: any[], user?: any) {
  const { default: jsPDF } = await import("jspdf");
  // Espone jsPDF come globale per i font
  // @ts-ignore
  window.jsPDF = jsPDF;
  const autoTable = (await import("jspdf-autotable")).default;

  // Funzione per caricare il logo come base64
  async function getLogoBase64(): Promise<string> {
    const response = await fetch("/placeholder.svg");
    const svg = await response.text();
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Import dinamico dei font Outfit
  await import("@/lib/fonts/Outfit-Regular-normal.js");
  await import("@/lib/fonts/Outfit-Bold-normal.js");

  const doc: any = new jsPDF({ format: "a4", unit: "pt" });
  const logo = await getLogoBase64();

  let y = 40;
  // Header PDF: Logo testuale
  doc.setFont("Outfit-Bold");
  doc.setFontSize(28);
  doc.text("Bodyweight", 40, y + 30);
  doc.setFont("Outfit-Regular");
  doc.setFontSize(18);
  doc.text("Routine di Allenamento", 40, y + 55);
  y += 80;

  // Sezione utente
  if (user) {
    doc.setFont("Outfit-Regular");
    doc.setFontSize(13);
    doc.text(`Utente: ${user.name || user.email || "-"}`, 40, y);
    y += 20;
  }
  // Divisore
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(1);
  doc.line(40, y, 555, y);
  y += 20;

  for (let i = 0; i < routines.length; i++) {
    const routine = routines[i];
    if (i > 0) {
      doc.addPage();
      y = 40;
      doc.setFont("Outfit-Bold");
      doc.setFontSize(28);
      doc.text("Bodyweight", 40, y + 30);
      doc.setFont("Outfit-Regular");
      doc.setFontSize(18);
      doc.text("Routine di Allenamento", 40, y + 55);
      y += 80;
      if (user) {
        doc.setFont("Outfit-Regular");
        doc.setFontSize(13);
        doc.text(`Utente: ${user.name || user.email || "-"}`, 40, y);
        y += 20;
      }
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(1);
      doc.line(40, y, 555, y);
      y += 20;
    }
    // Titolo routine
    doc.setFont("Outfit-Bold");
    doc.setFontSize(16);
    doc.text(`Routine: ${routine.name || "-"}`, 40, y);
    y += 22;
    doc.setFont("Outfit-Regular");
    doc.setFontSize(12);
    doc.text(`Tipo: ${routine.type || "-"}`, 40, y);
    y += 18;
    doc.text(`Giorni assegnati: ${(routine.assigned_days || []).join(", ")}`, 40, y);
    y += 18;
    doc.text(`Volume: ${routine.calculated_volume || 0}kg`, 40, y);
    y += 25;
    // Divisore tra routine e giorni
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(40, y, 555, y);
    y += 15;

    // Raggruppa esercizi per giorno
    const days = [
      "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"
    ];
    const exercisesByDay: Record<string, any[]> = {};
    (routine.assigned_days || []).forEach((day: string) => {
      exercisesByDay[day] = (routine.routine_exercises || []).filter((ex: any) =>
        !ex.assigned_day || ex.assigned_day === day
      );
    });

    for (const day of days) {
      if (!exercisesByDay[day] || exercisesByDay[day].length === 0) continue;
      doc.setFont("Outfit-Bold");
      doc.setFontSize(14);
      doc.text(day, 40, y);
      y += 10;
      autoTable(doc, {
        startY: y,
        head: [[
          "Esercizio", "Set", "Ripetizioni/Durata", "Carico", "Note"
        ]],
        body: exercisesByDay[day].map((ex: any) => [
          ex.exercise?.name || "-",
          ex.sets || "-",
          ex.tracking_type === "sets_reps"
            ? `${ex.reps || "-"}`
            : ex.tracking_type === "duration"
              ? `${ex.duration || "-"} ${ex.duration_unit || "s"}`
              : ex.tracking_type === "distance_duration"
                ? `${ex.duration || "-"} ${ex.duration_unit || "s"}, ${ex.distance || "-"} ${ex.distance_unit || "m"}`
                : "-",
          ex.weight ? `${ex.weight}${ex.weight_unit || "kg"}` : "-",
          ex.notes || ""
        ]),
        theme: "grid",
        styles: {
          font: "Outfit-Regular",
          fontSize: 10,
          cellPadding: 4,
          textColor: [30, 30, 30],
        },
        headStyles: {
          fillColor: [30, 41, 59], // bg-gray-900
          textColor: [255, 255, 255],
          fontStyle: "bold",
          font: "Outfit-Bold",
        },
        alternateRowStyles: {
          fillColor: [243, 244, 246], // bg-gray-100
        },
        margin: { left: 40, right: 40 },
      });
      y = (doc.lastAutoTable?.finalY || y) + 30;
    }
    y += 20;
  }

  doc.save(`routines_export.pdf`);
}
