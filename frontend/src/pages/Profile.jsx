import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Save, 
  Lock, 
  Globe, 
  FileText,
  Briefcase
} from 'lucide-react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Card, Button, Input, Badge } from '../components/ui';
import { updateProfile } from '../redux/slices/authSlice';
import apiClient from '../services/apiClient';
import storageClient from '../services/storageClient';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    bio: user?.user_metadata?.bio || 'Fullstack Engineer passionate about AI and Recruitment technology.',
    location: 'San Francisco, CA',
    website: 'https://portfolio.com',
    github: 'alexjohnson',
    linkedin: 'alexjohnson-dev',
    avatar_url: user?.user_metadata?.avatar_url || ''
  });

  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  
  const [uploading, setUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [resumeUrl, setResumeUrl] = useState(user?.user_metadata?.resume_url || '');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user: profileData } = await apiClient.get('/auth/me');
        if (profileData) {
          // If public.users has data, we merge it with metadata
          setFormData(prev => ({
            ...prev,
            full_name: profileData.full_name || prev.full_name
          }));
        }
      } catch (error) {
        console.error('Failed to fetch dynamic profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    const { success, url, error } = await storageClient.uploadFile('resumes', filePath, file);
    
    if (success) {
      setResumeUrl(url);
      setFormData({...formData, resume_url: url});
      alert('Resume uploaded successfully! Please click Save Changes to confirm.');
    } else {
      alert(`Resume upload failed: ${error}`);
    }
    setResumeUploading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    const { success, url, error } = await storageClient.uploadFile('avatars', filePath, file);
    
    if (success) {
      setAvatarUrl(url);
      setFormData({...formData, avatar_url: url});
      
      // Optionally update Auth immediately with Supabase
      // await supabase.auth.updateUser({ data: { avatar_url: url } });
    } else {
      alert(`Upload failed: ${error}`);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    try {
      // Call backend to update
      const response = await apiClient.post('/auth/me', formData);
      dispatch(updateProfile(formData));
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="relative h-48 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -bottom-12 left-12 p-1 bg-zinc-950 rounded-3xl">
           <div 
             className="w-32 h-32 rounded-[22px] bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center relative group cursor-pointer overflow-hidden"
             onClick={() => fileInputRef.current?.click()}
           >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-zinc-700" />
              )}
              <div className="absolute inset-0 bg-black/40 rounded-[18px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 {uploading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
           </div>
        </div>
      </div>

      <div className="pt-12 pl-12 flex justify-between items-start">
         <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-white">{formData.full_name || 'Set your name'}</h1>
            <p className="text-zinc-500 font-medium">{user?.email}</p>
         </div>
         <div className="flex gap-3">
            <Badge variant="violet">{user?.role || 'Candidate'}</Badge>
            <Badge variant="zinc">Member since 2026</Badge>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: General Info */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="space-y-6">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-500" /> General Information
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Full Name" 
                    value={formData.full_name} 
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                  <Input label="Email Address" value={user?.email} disabled />
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Bio</label>
                    <textarea 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all h-32"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
               </div>
               <div className="pt-4 border-t border-zinc-900 flex justify-end">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
               </div>
            </Card>

            <Card className="space-y-6">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" /> Security Settings
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-900">
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-zinc-500">Add an extra layer of security to your account.</p>
                     </div>
                     <Button variant="secondary" size="sm">Enable</Button>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-900">
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Change Password</p>
                        <p className="text-xs text-zinc-500">Last changed 3 months ago.</p>
                     </div>
                     <Button variant="secondary" size="sm">Update</Button>
                  </div>
               </div>
            </Card>
         </div>

         {/* Right: Resume & Links */}
         <div className="space-y-6">
            <Card className="space-y-6">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-500" /> Resume & CV
               </h3>
               <div 
                 className="p-8 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center text-center space-y-4 group hover:border-violet-500/50 transition-colors cursor-pointer"
                 onClick={() => resumeInputRef.current?.click()}
               >
                  <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:text-violet-500 transition-colors">
                     {resumeUploading ? <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-white">
                        {resumeUploading ? 'Uploading...' : resumeUrl ? 'Resume Uploaded' : 'Upload new resume'}
                     </p>
                     <p className="text-xs text-zinc-500">PDF, DOCX up to 10MB</p>
                  </div>
                  <input type="file" ref={resumeInputRef} onChange={handleResumeUpload} className="hidden" accept=".pdf,.doc,.docx" />
               </div>
               {resumeUrl && (
                  <Button variant="secondary" className="w-full" onClick={() => window.open(resumeUrl, '_blank')}>
                    View Uploaded CV
                  </Button>
               )}
            </Card>

            <Card className="space-y-6">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-violet-500" /> Professional Links
               </h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-900 focus-within:border-violet-500 transition-colors">
                     <GitHubIcon className="w-4 h-4 text-zinc-500" />
                     <span className="text-sm text-zinc-500">github.com/</span>
                     <input 
                       className="bg-transparent border-none outline-none text-sm text-zinc-300 w-full"
                       value={formData.github}
                       onChange={(e) => setFormData({...formData, github: e.target.value})}
                     />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-900 focus-within:border-violet-500 transition-colors">
                     <LinkedInIcon className="w-4 h-4 text-zinc-500" />
                     <span className="text-sm text-zinc-500">linkedin.com/in/</span>
                     <input 
                       className="bg-transparent border-none outline-none text-sm text-zinc-300 w-full"
                       value={formData.linkedin}
                       onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                     />
                  </div>
               </div>
               <Button onClick={handleSave} variant="secondary" className="w-full">Save Links</Button>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default Profile;
