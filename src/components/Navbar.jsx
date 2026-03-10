import { CameraIcon, House, Salad, ShoppingCart, Target, User } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); // Questo ci dice dove ci troviamo (es. "/dieta")

  // Funzione helper per capire se il link è attivo
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR FISSA IN BASSO */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] p-2 pb-6 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          
          {/* HOME */}
          <NavItem 
            to="/" 
            active={isActive("/")} 
            Icon={House} 
            label="Home" 
            color="text-blue-500" 
          />

          {/* DIETA */}
          <NavItem 
            to="/dieta" 
            active={isActive("/dieta")} 
            Icon={Salad} 
            label="Dieta" 
            color="text-emerald-500" 
          />

          {/* SPESA */}
          <NavItem 
            to="/spesa" 
            active={isActive("/spesa")} 
            Icon={ShoppingCart} 
            label="Spesa" 
            color="text-amber-500" 
          />

          {/* TARGET */}
          <NavItem 
            to="/obiettivi" 
            active={isActive("/obiettivi")} 
            Icon={Target} 
            label="Target" 
            color="text-rose-500" 
          />

          {/* FOTO */}
          <NavItem 
            to="/foto" 
            active={isActive("/foto")} 
            Icon={CameraIcon} 
            label="Foto" 
            color="text-purple-500" 
          />

          {/* PROFILO */}
          <NavItem 
            to="/profilo" 
            active={isActive("/profilo")} 
            Icon={User} 
            label="Profilo" 
            color="text-slate-600" 
          />

        </div>
      </nav>

      {/* CONTENUTO DELLE PAGINE */}
      <main className="pb-24"> {/* Il padding-bottom serve per non coprire il contenuto con la navbar */}
        <Outlet />
      </main>
    </div>
  );
};

// Sotto-componente per non ripetere il codice
const NavItem = ({ to, active, Icon, label, color }) => (
  <Link to={to} className="flex flex-col items-center gap-1 transition-all duration-300 relative group">
    <div className={`p-1 rounded-xl transition-all ${active ? `bg-gray-100 scale-110` : 'group-hover:bg-gray-50'}`}>
      <Icon 
        size={active ? 28 : 24} 
        className={`${active ? color : 'text-gray-400'} transition-colors duration-300`} 
      />
    </div>
    <span className={`text-[10px] font-bold tracking-tight transition-colors ${active ? 'text-black' : 'text-gray-400'}`}>
      {label}
    </span>
    {active && (
      <div className={`absolute -top-1 w-1 h-1 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`} />
    )}
  </Link>
);

export default Navbar;