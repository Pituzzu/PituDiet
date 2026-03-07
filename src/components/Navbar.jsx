import { CameraIcon, Check, House, Salad, ShoppingCart, Target, User } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <div>
      {/* NAVBAR: Scrivila qui. 
          Essendo nel Layout, resterà visibile sia in Home che in Login 
      */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] p-4">
        <div className='flex justify-around'>
            <div className="flex justify-around items-center p-4 bg-white border-t border-gray-100 fixed bottom-0 w-full shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
    
    {/* HOME - Blu */}
    <Link to="/" className="flex flex-col items-center group">
        <House size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />
        <span className="text-xs font-medium text-gray-600 group-hover:text-blue-700">Home</span>
    </Link>

    {/* DIETA - Verde */}
    <Link to="/dieta" className="flex flex-col items-center group">
        <Salad size={28} className="text-emerald-500 group-hover:text-emerald-700 transition-colors" />
        <span className="text-xs font-medium text-gray-600 group-hover:text-emerald-700">Dieta</span>
    </Link>

    {/* SPESA - Giallo/Ambra */}
    <Link to="/spesa" className="flex flex-col items-center group">
        <ShoppingCart size={28} className="text-amber-500 group-hover:text-amber-700 transition-colors" />
        <span className="text-xs font-medium text-gray-600 group-hover:text-amber-700">Spesa</span>
    </Link>

    {/* TARGET - Rosso */}
    <Link to="/obiettivi" className="flex flex-col items-center group">
        <Target size={28} className="text-rose-500 group-hover:text-rose-700 transition-colors" />
        <span className="text-xs font-medium text-gray-600 group-hover:text-rose-700">Obiettivi</span>
    </Link>

    {/* FOTO - Viola */}
    <Link to="/foto" className="flex flex-col items-center group">
        <CameraIcon size={28} className="text-purple-500 group-hover:text-purple-700 transition-colors" />
        <span className="text-xs font-medium text-gray-600 group-hover:text-purple-700">Foto</span>
    </Link>

    {/* PROFILO - Grigio/Nero */}
    <Link to="/profilo" className="flex flex-col items-center group">
        <User size={28} className="text-slate-600 group-hover:text-black transition-colors" />
        <span className="text-xs font-medium text-gray-600 group-hover:text-black">Profilo</span>
    </Link>

</div>
            
            
        </div>
        
      </nav>

      {/* OUTLET: Questo è il "buco" dove React Router 
          renderizzerà le tue pagine (Home, Login, ecc.) 
      */}
      <main>
        <Outlet />
      </main>

      {/* Footer opzionale
      <footer className="p-4 border-t text-center">
        © 2026 - Il Mio Progetto
      </footer> */}
    </div>
  );
};

export default Navbar;