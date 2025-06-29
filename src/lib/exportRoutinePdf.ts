
// Funzione per caricare il logo come base64
async function getLogoBase64(): Promise<string> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#22c55e"/><text x="50" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">F</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Funzione principale di export
export async function exportRoutinePdf(routine: any, user?: any) {
  try {
    const jsPDFModule = await import("jspdf");
    await import("jspdf-autotable");

    const jsPDF = jsPDFModule.default;
    const doc = new jsPDF({ format: "a4", unit: "pt" });

    // Carica logo
    const logo = await getLogoBase64();
    doc.addImage(logo, "SVG", 40, 40, 60, 60);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(routine.name || "Routine di Allenamento", 120, 65);
    doc.setFontSize(14);
    if (user?.full_name) {
      doc.text(`Coach: ${user.full_name}`, 120, 85);
    }
    doc.text(`Tipo: ${routine.type || "Non specificato"}`, 40, 130);
    doc.text(`Volume: ${routine.volume || "Non specificato"}`, 40, 150);
    doc.text(`Data creazione: ${new Date(routine.created_at).toLocaleDateString("it-IT")}`, 40, 170);
    doc.text(`Giorni assegnati: ${routine.assigned_days?.join(", ") || "Non specificato"}`, 40, 190);

    let y = 230;

    // Esercizi
    if (routine.routine_exercises && routine.routine_exercises.length > 0) {
      const exerciseData = routine.routine_exercises.map((re: any, index: number) => {
        const exercise = re.exercise;
        const sets = re.sets || "-";
        const reps = re.reps || "-";
        const weight = re.weight ? `${re.weight} ${re.weight_unit || "kg"}` : "-";
        const rest = re.rest_time ? `${re.rest_time}s` : "-";
        const notes = re.notes || "-";

        return [
          index + 1,
          exercise?.name || "Esercizio sconosciuto",
          exercise?.muscle_group || "-",
          sets,
          reps,
          weight,
          rest,
          notes
        ];
      });

      (doc as any).autoTable({
        head: [["#", "Esercizio", "Gruppo", "Serie", "Rip", "Peso", "Pausa", "Note"]],
        body: exerciseData,
        startY: y,
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 40, right: 40 },
      });
      
      y = (doc as any).lastAutoTable.finalY + 30;
    }

    doc.save(`routine_${routine.name || "allenamento"}.pdf`);
  } catch (error) {
    console.error("Errore durante l'export PDF:", error);
    throw new Error("Impossibile generare il PDF");
  }
}
