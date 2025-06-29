
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Mail, Calendar, MessageCircle, Trash2, Copy } from "lucide-react";
import { useCoachClients, useCoachInviteCodes, useCreateInviteCode, useRemoveClient } from "@/hooks/useCoachClient";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  
  const { data: clients = [], isLoading: clientsLoading, refetch: refetchClients } = useCoachClients();
  const { data: inviteCodes = [], refetch: refetchInvites } = useCoachInviteCodes();
  const createInviteMutation = useCreateInviteCode();
  const removeClientMutation = useRemoveClient();

  const handleCreateInvite = async () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci nome e email del cliente.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createInviteMutation.mutateAsync({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim()
      });
      setClientName("");
      setClientEmail("");
      setInviteDialogOpen(false);
      refetchInvites();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copiato!",
      description: "Codice copiato negli appunti.",
    });
  };

  const handleRemoveClient = async (clientId: string, clientName: string) => {
    if (window.confirm(`Sei sicuro di voler rimuovere ${clientName}?`)) {
      try {
        await removeClientMutation.mutateAsync(clientId);
        refetchClients();
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  };

  if (clientsLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Caricamento clienti...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 font-outfit">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">I miei Clienti</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Gestisci i tuoi clienti e crea codici di invito</p>
          </div>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Invita Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invita un nuovo cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Nome del cliente</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome e cognome"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email del cliente</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="email@esempio.com"
                  />
                </div>
                <Button 
                  onClick={handleCreateInvite} 
                  disabled={createInviteMutation.isPending}
                  className="w-full"
                >
                  {createInviteMutation.isPending ? "Creazione..." : "Crea codice di invito"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Clienti attivi */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Clienti Attivi ({clients.length})</h2>
            {clients.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-gray-500 text-center">Nessun cliente ancora.<br />Crea un codice di invito per iniziare!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {clients.map((client: any) => (
                  <Card key={client.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{client.client.full_name}</h3>
                            <p className="text-sm text-gray-500">
                              Cliente dal {format(new Date(client.created_at), 'dd MMMM yyyy', { locale: it })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/routines?client=${client.client.id}`)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Routine
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/chat/${client.client.id}`)}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveClient(client.client.id, client.client.full_name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Codici di invito */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Codici di Invito</h2>
            <div className="space-y-4">
              {inviteCodes.map((invite: any) => (
                <Card key={invite.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{invite.client_name}</h3>
                        <p className="text-sm text-gray-500">{invite.client_email}</p>
                      </div>
                      <Badge variant={invite.is_used ? "secondary" : "default"}>
                        {invite.is_used ? "Utilizzato" : "Attivo"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded font-mono text-lg">
                        {invite.code}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode(invite.code)}
                        disabled={invite.is_used}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copia
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {invite.is_used 
                        ? `Utilizzato il ${format(new Date(invite.created_at), 'dd/MM/yyyy')}`
                        : `Scade il ${format(new Date(invite.expires_at), 'dd/MM/yyyy')}`
                      }
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
