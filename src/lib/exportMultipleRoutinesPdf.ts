
// Funzione per caricare il logo come base64
async function getLogoBase64(): Promise<string> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#22c55e"/><text x="50" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">F</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export async function exportMultipleRoutinesPdf(routines: any[], user?: any) {
  try {
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF({ format: "a4", unit: "pt" });

    // Header generale
    const logo = await getLogoBase64();
    doc.addImage(logo, "SVG", 40, 40, 60, 60);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Routine di Allenamento", 120, 65);
    doc.setFontSize(14);
    if (user?.full_name) {
      doc.text(`Coach: ${user.full_name}`, 120, 85);
    }
    doc.text(`Data: ${new Date().toLocaleDateString("it-IT")}`, 40, 130);
    doc.text(`Numero routine: ${routines.length}`, 40, 150);

    let yPosition = 190;

    routines.forEach((routine, routineIndex) => {
      if (routineIndex > 0) {
        doc.addPage();
        yPosition = 40;
      }

      // Titolo routine
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`${routineIndex + 1}. ${routine.name}`, 40, yPosition);
      yPosition += 30;

      // Info routine
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Tipo: ${routine.type || "Non specificato"}`, 40, yPosition);
      yPosition += 20;
      doc.text(`Volume: ${routine.volume || "Non specificato"}`, 40, yPosition);
      yPosition += 20;
      doc.text(`Giorni: ${routine.assigned_days?.join(", ") || "Non specificato"}`, 40, yPosition);
      yPosition += 30;

      // Esercizi
      if (routine.routine_exercises && routine.routine_exercises.length > 0) {
        const exerciseData = routine.routine_exercises.map((re: any, index: number) => {
          const exercise = re.exercise;
          return [
            index + 1,
            exercise?.name || "Esercizio sconosciuto",
            exercise?.muscle_group || "-",
            re.sets || "-",
            re.reps || "-",
            re.weight ? `${re.weight} ${re.weight_unit || "kg"}` : "-",
            re.rest_time ? `${re.rest_time}s` : "-"
          ];
        });

        (doc as any).autoTable({
          head: [["#", "Esercizio", "Gruppo", "Serie", "Rip", "Peso", "Pausa"]],
          body: exerciseData,
          startY: yPosition,
          styles: {
            fontSize: 9,
            cellPadding: 4,
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

        yPosition = (doc as any).lastAutoTable.finalY + 40;
      }
    });

    doc.save(`routine_multiple_${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error("Errore durante l'export PDF multiplo:", error);
    throw new Error("Impossibile generare il PDF");
  }
}
