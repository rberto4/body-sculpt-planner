
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DeleteAccountButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "ELIMINA" || !user) return;

    setIsDeleting(true);
    try {
      // Delete user data from our tables first (profiles, routines, etc.)
      const { error: dataError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (dataError) throw dataError;

      // Delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) throw authError;

      toast.success('Account eliminato con successo');
      navigate('/auth');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Errore durante l\'eliminazione dell\'account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Elimina Account
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-red-500 font-outfit">
            Eliminazione Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Questa azione è irreversibile. Tutti i tuoi dati, routine e progressi verranno eliminati definitivamente.
          </p>
          
          <div>
            <Label className="text-gray-700 dark:text-gray-300">
              Scrivi "ELIMINA" per confermare:
            </Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="ELIMINA"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-300 dark:border-gray-600"
          >
            Annulla
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={confirmText !== "ELIMINA" || isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? "Eliminando..." : "Elimina Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
