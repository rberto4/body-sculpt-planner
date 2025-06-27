import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoutines } from '../hooks/useSupabaseQuery';
import RoutineCard from '../components/routines/RoutineCard';
import RoutineExerciseList from '../components/routines/RoutineExerciseList';
import RoutineForm from '../components/routines/RoutineForm';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';
import { ArrowLeft, Pencil, Trash, Play } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Badge } from '../components/ui/badge';

export default function RoutineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: routines = [], refetch } = useRoutines();
  const routine = routines.find((r: any) => r.id === id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [tab, setTab] = useState('details');

  if (!routine) {
    return <div className="p-8 text-center text-gray-500">Routine non trovata</div>;
  }

  const handleSave = (data: any) => {
    setEditing(false);
    setDialogOpen(false);
    refetch();
  };
  const handleDelete = () => {
    setDeleteDialog(false);
    navigate('/routines');
    refetch();
  };

  // Calcolo volume dettagliato
  const getRoutineVolume = (routine: any) => {
    let totalKg = 0;
    let totalSets = 0;
    let totalDuration = 0;
    let totalDistance = 0;
    if (!routine.routine_exercises) return { totalKg, totalSets, totalDuration, totalDistance };
    for (const ex of routine.routine_exercises) {
      if (ex.tracking_type === "sets_reps") {
        totalSets += Number(ex.sets) || 0;
        totalKg += (Number(ex.sets) || 0) * (Number(ex.reps) || 0) * (Number(ex.weight) || 0);
      } else if (ex.tracking_type === "duration") {
        totalDuration += (Number(ex.sets) || 1) * (Number(ex.duration) || 0);
        totalSets += Number(ex.sets) || 1;
      } else if (ex.tracking_type === "distance_duration") {
        totalDuration += (Number(ex.sets) || 1) * (Number(ex.duration) || 0);
        totalDistance += (Number(ex.sets) || 1) * (Number(ex.distance) || 0);
        totalSets += Number(ex.sets) || 1;
      }
    }
    return { totalKg, totalSets, totalDuration, totalDistance };
  };
  const volume = getRoutineVolume(routine);

  if (editing) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto">
          <RoutineForm
            mode="edit"
            routine={routine}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/routines')} className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold flex-1 truncate">{routine.name}</h1>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" title="Inizia" onClick={() => {/* implementa start */}}><Play className="w-5 h-5" /></Button>
            <Button size="icon" variant="ghost" title="Modifica" onClick={() => setEditing(true)}><Pencil className="w-5 h-5" /></Button>
            <Button size="icon" variant="ghost" title="Elimina" onClick={() => setDeleteDialog(true)}><Trash className="w-5 h-5 text-red-500" /></Button>
          </div>
        </div>
        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Dettagli</TabsTrigger>
            <TabsTrigger value="exercises">Esercizi</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Dettagli routine */}
              <Card>
                <CardHeader>
                  <CardTitle>Dettagli routine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><span className="font-semibold">Tipo:</span> {routine.type}</div>
                </CardContent>
              </Card>
              {/* Card Giorni assegnati */}
              <Card>
                <CardHeader>
                  <CardTitle>Giorni assegnati</CardTitle>
                </CardHeader>
                <CardContent>
                  {routine.assigned_days && routine.assigned_days.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {routine.assigned_days.map((day: string) => (
                        <Badge key={day} variant="secondary">{day}</Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">Nessun giorno assegnato</div>
                  )}
                </CardContent>
              </Card>
              {/* Card Volume */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Volume totale</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-6">
                  <div><span className="font-semibold">Kg totali:</span> {volume.totalKg}</div>
                  <div><span className="font-semibold">Distanza totale:</span> {volume.totalDistance} m</div>
                  <div><span className="font-semibold">Tempo totale:</span> {volume.totalDuration} s</div>
                  <div><span className="font-semibold">Set totali:</span> {volume.totalSets}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="exercises">
            <Card>
              <CardHeader>
                <CardTitle>Esercizi</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Serie</TableHead>
                      <TableHead>Ripetizioni</TableHead>
                      <TableHead>Carico</TableHead>
                      <TableHead>Udm</TableHead>
                      <TableHead>Durata</TableHead>
                      <TableHead>Distanza</TableHead>
                      <TableHead>RPE</TableHead>
                      <TableHead>MAV</TableHead>
                      <TableHead>Warmup</TableHead>
                      <TableHead>Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routine.routine_exercises && routine.routine_exercises.length > 0 ? (
                      routine.routine_exercises.map((ex: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{ex.exercise?.name}</TableCell>
                          <TableCell>{ex.tracking_type}</TableCell>
                          <TableCell>{ex.sets}</TableCell>
                          <TableCell>{ex.reps ?? '-'}</TableCell>
                          <TableCell>{ex.weight ?? '-'}</TableCell>
                          <TableCell>{ex.weight_unit ?? '-'}</TableCell>
                          <TableCell>{ex.duration ?? '-'}</TableCell>
                          <TableCell>{ex.distance ?? '-'}</TableCell>
                          <TableCell>{ex.rpe ?? '-'}</TableCell>
                          <TableCell>{ex.mav ? <Badge variant="secondary">MAV</Badge> : '-'}</TableCell>
                          <TableCell>{ex.warmup ? <Badge variant="secondary">Warmup</Badge> : '-'}</TableCell>
                          <TableCell>{ex.notes ?? '-'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center text-gray-400">Nessun esercizio nella routine</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Dialog delete */}
        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Elimina routine</DialogTitle>
            </DialogHeader>
            <div className="py-4">Sei sicuro di voler eliminare la routine <b>{routine.name}</b>? Questa azione non è reversibile.</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialog(false)}>Annulla</Button>
              <Button variant="destructive" onClick={handleDelete}>Elimina</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
