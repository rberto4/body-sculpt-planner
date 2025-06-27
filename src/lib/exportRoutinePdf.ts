// Funzione per caricare il logo come base64
async function getLogoBase64(): Promise<string> {
  const response = await fetch("/placeholder.svg");
  const svg = await response.text();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Funzione principale di export
export async function exportRoutinePdf(routine: any, user?: any) {
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ format: "a4", unit: "pt" });

  // Carica logo
  const logo = await getLogoBase64();
  doc.addImage(logo, "SVG", 40, 30, 60, 60);

  // Font principale (Outfit via Google Fonts, fallback Helvetica)
  doc.setFont("helvetica", "normal");

  // Titolo e dati utente
  doc.setFontSize(22);
  doc.text("Bodyweight - Routine di Allenamento", 120, 60);
  doc.setFontSize(12);
  if (user) {
    doc.text(`Utente: ${user.name || user.email || "-"}`, 120, 80);
  }
  doc.text(`Routine: ${routine.name || "-"}`, 40, 110);
  doc.text(`Tipo: ${routine.type || "-"}`, 40, 130);
  doc.text(`Giorni assegnati: ${(routine.assigned_days || []).join(", ")}`, 40, 150);
  doc.text(`Volume: ${routine.calculated_volume || 0}kg`, 40, 170);

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

  let y = 200;
  for (const day of days) {
    if (!exercisesByDay[day] || exercisesByDay[day].length === 0) continue;
    doc.setFontSize(16);
    doc.text(day, 40, y);
    y += 10;
    autoTable(doc, {
      startY: y + 10,
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
        font: "helvetica",
        fontSize: 10,
        cellPadding: 4,
        textColor: [30, 30, 30],
      },
      headStyles: {
        fillColor: [30, 41, 59], // bg-gray-900
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246], // bg-gray-100
      },
      margin: { left: 40, right: 40 },
    });
    y = doc.lastAutoTable.finalY + 30;
  }

  doc.save(`routine_${routine.name || "allenamento"}.pdf`);
} 