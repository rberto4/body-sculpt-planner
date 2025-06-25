
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Edit, Save, X, Mail, Calendar, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    full_name: "",
    avatar_url: "",
    bio: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setEditForm({
          username: data.username || "",
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || ""
        });
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user?.id,
          username: user?.email?.split('@')[0] || "",
          full_name: "",
          avatar_url: "",
          bio: ""
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        
        setProfile(createdProfile);
        setEditForm({
          username: createdProfile.username || "",
          full_name: createdProfile.full_name || "",
          avatar_url: createdProfile.avatar_url || "",
          bio: createdProfile.bio || ""
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Errore nel caricamento del profilo");
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username,
          full_name: editForm.full_name,
          avatar_url: editForm.avatar_url,
          bio: editForm.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setIsEditing(false);
      toast.success("Profilo aggiornato con successo!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Errore nell'aggiornamento del profilo");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (!confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.")) {
      return;
    }

    try {
      // First delete the profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      // Note: In a real app, you'd need a server-side function to delete the auth user
      // as the client SDK doesn't have permission to delete auth users
      toast.success("Account eliminato con successo");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Errore nell'eliminazione dell'account");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit flex items-center justify-center">
        <div className="text-xl text-gray-600">Caricamento profilo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 font-outfit">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Il Mio Profilo
          </h1>
          <p className="text-gray-600">Gestisci le informazioni del tuo account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 font-outfit">Informazioni Personali</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Annulla' : 'Modifica'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label className="text-gray-700">Nome utente</Label>
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Il tuo nome utente"
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-700">Nome completo</Label>
                      <Input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Il tuo nome completo"
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700">URL Avatar</Label>
                      <Input
                        value={editForm.avatar_url}
                        onChange={(e) => setEditForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                        placeholder="URL della tua immagine profilo"
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700">Bio</Label>
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Racconta qualcosa di te..."
                        className="bg-white border-gray-300 text-gray-900"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Salvando...' : 'Salva Modifiche'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500 text-sm">Nome utente</Label>
                        <p className="text-gray-900 font-medium">
                          {profile?.username || 'Non impostato'}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-gray-500 text-sm">Nome completo</Label>
                        <p className="text-gray-900 font-medium">
                          {profile?.full_name || 'Non impostato'}
                        </p>
                      </div>
                    </div>

                    {profile?.bio && (
                      <div>
                        <Label className="text-gray-500 text-sm">Bio</Label>
                        <p className="text-gray-900">{profile.bio}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 font-outfit">Informazioni Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label className="text-gray-500 text-sm">Email</Label>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label className="text-gray-500 text-sm">Membro dal</Label>
                    <p className="text-gray-900 font-medium">
                      {new Date(user.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label className="text-gray-500 text-sm">Ultimo accesso</Label>
                    <p className="text-gray-900 font-medium">
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString('it-IT')
                        : 'Mai'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Picture & Actions */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 font-outfit">Foto Profilo</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gray-900 text-white text-lg">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {profile?.full_name || profile?.username || 'Utente'}
                  </h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-white border-red-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-600 font-outfit">Zona Pericolosa</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Elimina Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-gray-200">
                    <DialogHeader>
                      <DialogTitle className="text-red-600">Elimina Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile 
                        e comporterà la perdita di tutti i tuoi dati, routine e progressi.
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          Annulla
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={handleDeleteAccount}
                        >
                          Elimina Definitivamente
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
