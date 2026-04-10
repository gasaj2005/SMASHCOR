import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    dob: '',
    gender: 'M',
    division: '4',
    subdivision: 'Baja',
  });
  const [avatarFile, setAvatarFile] = useState(null);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const calculateAge = (dob) => {
      const diff = Date.now() - new Date(dob).getTime();
      return Math.abs(new Date(diff).getUTCFullYear() - 1970);
    };

    let avatarBase64 = null;
    if (avatarFile) {
      avatarBase64 = await fileToBase64(avatarFile);
    } else {
      const baseGen = formData.gender === 'F' ? 'female' : 'male';
      avatarBase64 = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}_${baseGen}&backgroundColor=93C572`;
    }
    
    const result = register({
      ...formData,
      age: formData.dob ? calculateAge(formData.dob) : 25,
      avatar: avatarBase64
    });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6 pb-20">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/login')} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-dark-card transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white ml-2">Crear Cuenta</h1>
      </div>

      <motion.div
        key={step}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center font-medium bg-red-500/10 p-3 rounded-lg">{error}</p>}
          
          {step === 1 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nombre Real</label>
                <input 
                  type="text" required name="name" value={formData.name} onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Usuario (Único)</label>
                <input 
                  type="text" required name="username" maxLength={15} value={formData.username} onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  placeholder="Ej. juanpe_padel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Contraseña</label>
                <input 
                  type="password" required name="password" value={formData.password} onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Fecha de Nacimiento</label>
                <input 
                  type="date" required name="dob" value={formData.dob} onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Género</label>
                <select 
                  name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-brand transition-all"
                >
                  <option value="M">Hombre</option>
                  <option value="F">Mujer</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              
              <button 
                type="button" onClick={handleNext}
                className="w-full bg-brand text-dark-bg font-bold p-4 rounded-xl mt-8 hover:bg-brand-hover transition-colors"
                disabled={!formData.name || !formData.username || !formData.dob || !formData.password}
              >
                Siguiente
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">División Inicial Estimada</label>
                <select 
                  name="division" value={formData.division} onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-brand transition-all"
                >
                  <option value="1">1ª División (Pro)</option>
                  <option value="2">2ª División (Avanzado)</option>
                  <option value="3">3ª División (Intermedio)</option>
                  <option value="4">4ª División (Iniciación)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Subdivisión</label>
                <select 
                  name="subdivision" value={formData.subdivision} onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-brand transition-all"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Foto de Perfil (Opcional)</label>
                <input 
                  type="file" accept="image/*" onChange={handleFileChange}
                  className="w-full bg-dark-card border border-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-brand transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand file:text-dark-bg file:font-semibold hover:file:bg-brand-hover"
                />
                <p className="text-xs text-slate-500 mt-2">Si no subes una, te asignaremos un avatar genial.</p>
              </div>
              
              <div className="pt-6 flex gap-4">
                <button 
                  type="button" onClick={handleBack}
                  className="w-1/3 bg-dark-card border border-dark-border text-white font-bold p-4 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Atrás
                </button>
                <button 
                  type="submit"
                  className="w-2/3 bg-brand text-dark-bg font-bold p-4 rounded-xl hover:bg-brand-hover transition-colors"
                >
                  Completar Registro
                </button>
              </div>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
}
