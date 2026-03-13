import { Link ,useNavigate} from 'react-router-dom';
import { Rocket, Zap, Shield, ChevronRight, Calendar, ArrowBigDown, ArrowBigUp, ArrowBigUpIcon, ArrowUpSquareIcon, ArrowDownSquareIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; 
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Home = () => {
    const [menu_colazione, setMenu_Colazione] = useState(true);
    const [menu_spuntino, setMenu_Spuntino] = useState(true);
    const [menu_pranzo, setMenu_Pranzo] = useState(true);
    const [menu_cena, setMenu_Cena] = useState(true);

    const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Ascoltiamo se l'utente è loggato
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 2. Prendiamo il documento dell'utente usando il suo UID
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("Nessun dato trovato per questo utente!");
          }
        } catch (error) {
          console.error("Errore nel recupero dati:", error);
        }
      } else {
        // Se non è loggato, potresti reindirizzarlo al login
        console.log("Utente non loggato");
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-10 text-center">Caricamento profilo...</div>;

    return (
        <div className="min-h-screen bg-white pb-24 ">
            {/* Questo div rimarrà incollato in alto, ma rispetterà lo spazio degli altri */}
            <div className='sticky top-0 z-50 bg-white pb-4 w-full border-b border-gray-100'>
                <div className='flex items-center flex-col pt-4'>
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="User Avatar"
                        className="w-16 h-16 rounded-full "
                    />
                    <h1 className='text-2xl font-bold'>Ciao, {userData?.nome || "Utente"}! 👋</h1>
                    <h3 className='text-gray-500'>Giorno 0 dalla tua dieta</h3>
                </div>
            </div>


            {/* <div className='m-10 flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Post Diario</h1>
                <Calendar size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />

            </div> */}

            {/*Colazione*/}
            <div className='w-full'>
                <div className='  flex items-center justify-between '>
                    <h1 className='text-2xl font-bold text-[#fe9a00]'>Colazione</h1>
                    {menu_colazione ? <ArrowUpSquareIcon onClick={() => setMenu_Colazione(!menu_colazione)} size={28} className="text-[#fe9a00] group-hover:text-blue-700 transition-colors" />
                        : <ArrowDownSquareIcon onClick={() => setMenu_Colazione(!menu_colazione)} size={28} className="text-[#fe9a00] group-hover:text-blue-700 transition-colors" />}


                </div>
                {menu_colazione ?
                    <div className='m-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-md mx-auto'>
                        {/* HEADER: Foto profilo e Nome */}
                        <div className='flex items-center gap-3 p-4'>
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-bold text-gray-800'>Matteo Salvaggio <span className='text-xs text-gray-500 font-medium'>Oggi • 13:25</span></h1>

                            </div>
                        </div>

                        {/* BODY: Immagine del pasto (w-full per riempire tutto) */}
                        <div className='w-full aspect-video overflow-hidden bg-gray-100'>
                            <img
                                src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZptANQ0ahgySlUJWR9Nsv_41ctRhND6B3Ft7UNWyf7QFQw59HjAEsSx7_NkyD"
                                alt="Pranzo"
                                className='w-full h-full object-cover'
                            />
                        </div>

                        {/* FOOTER: Dettagli opzionali */}
                        <div className='p-4'>
                            <p className='text-sm text-gray-600'>
                                Pranzo bilanciato: pollo, verdure e avocado. 🥗
                            </p>
                        </div>
                    </div>
                    : null}
            </div>

            {/*Spuntino*/}
            <div className='mt-5 w-full'>
                <div className='  flex items-center justify-between '>
                    <h1 className='text-2xl font-bold text-[#fe9a00]'>Spuntino</h1>
                    {menu_spuntino ? <ArrowUpSquareIcon onClick={() => setMenu_Spuntino(!menu_spuntino)} size={28} className="text-[#fe9a00] group-hover:text-blue-700 transition-colors" />
                        : <ArrowDownSquareIcon onClick={() => setMenu_Spuntino(!menu_spuntino)} size={28} className="text-[#fe9a00] group-hover:text-blue-700 transition-colors" />}


                </div>
                {menu_spuntino ?
                    <div className='m-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-md mx-auto'>
                        {/* HEADER: Foto profilo e Nome */}
                        <div className='flex items-center gap-3 p-4'>
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-bold text-gray-800'>Matteo Salvaggio <span className='text-xs text-gray-500 font-medium'>Oggi • 13:25</span></h1>

                            </div>
                        </div>

                        {/* BODY: Immagine del pasto (w-full per riempire tutto) */}
                        <div className='w-full aspect-video overflow-hidden bg-gray-100'>
                            <img
                                src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZptANQ0ahgySlUJWR9Nsv_41ctRhND6B3Ft7UNWyf7QFQw59HjAEsSx7_NkyD"
                                alt="Pranzo"
                                className='w-full h-full object-cover'
                            />
                        </div>

                        {/* FOOTER: Dettagli opzionali */}
                        <div className='p-4'>
                            <p className='text-sm text-gray-600'>
                                Pranzo bilanciato: pollo, verdure e avocado. 🥗
                            </p>
                        </div>
                    </div>
                    : null}
            </div>


            {/*Pranzo*/}
            <div className='w-full'>
                <div className='mt-5  flex items-center justify-between '>
                    <h1 className='text-2xl font-bold text-[#fe9a00]'>Pranzo</h1>
                    {menu_pranzo ? <ArrowUpSquareIcon onClick={() => setMenu_Pranzo(!menu_pranzo)} size={28} className="text-[#fe9a00] group-hover:text-blue-700 transition-colors" />
                        : <ArrowDownSquareIcon onClick={() => setMenu_Pranzo(!menu_pranzo)} size={28} className="text-[#fe9a00] group-hover:text-blue-700 transition-colors" />}


                </div>
                {menu_pranzo ?
                    <div className='m-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-md mx-auto'>
                        {/* HEADER: Foto profilo e Nome */}
                        <div className='flex items-center gap-3 p-4'>
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-bold text-gray-800'>Matteo Salvaggio <span className='text-xs text-gray-500 font-medium'>Oggi • 13:25</span></h1>

                            </div>
                        </div>

                        {/* BODY: Immagine del pasto (w-full per riempire tutto) */}
                        <div className='w-full aspect-video overflow-hidden bg-gray-100'>
                            <img
                                src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZptANQ0ahgySlUJWR9Nsv_41ctRhND6B3Ft7UNWyf7QFQw59HjAEsSx7_NkyD"
                                alt="Pranzo"
                                className='w-full h-full object-cover'
                            />
                        </div>

                        {/* FOOTER: Dettagli opzionali */}
                        <div className='p-4'>
                            <p className='text-sm text-gray-600'>
                                Pranzo bilanciato: pollo, verdure e avocado. 🥗
                            </p>
                        </div>
                    </div>
                    : null}
            </div>

            {/*Cena*/}

            <div className='w-full'>
                <div className='mt-5  flex items-center justify-between '>
                    <h1 className='text-2xl font-bold text-[#fe9a00]'>Cena</h1>
                    {menu_cena ? <ArrowUpSquareIcon onClick={() => setMenu_Cena(!menu_cena)} size={28} className="text-[#fe9a00] group-hover:text-blue-700 transition-colors" />
                        : <ArrowDownSquareIcon onClick={() => setMenu_Cena(!menu_cena)} size={28} className="text-[#fe9a00] group-hover:text-blue-700 transition-colors" />}


                </div>
                {menu_cena ?
                    <div className='m-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-md mx-auto'>
                        {/* HEADER: Foto profilo e Nome */}
                        <div className='flex items-center gap-3 p-4'>
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-bold text-gray-800'>Matteo Salvaggio <span className='text-xs text-gray-500 font-medium'>Oggi • 13:25</span></h1>

                            </div>
                        </div>

                        {/* BODY: Immagine del pasto (w-full per riempire tutto) */}
                        <div className='w-full aspect-video overflow-hidden bg-gray-100'>
                            <img
                                src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZptANQ0ahgySlUJWR9Nsv_41ctRhND6B3Ft7UNWyf7QFQw59HjAEsSx7_NkyD"
                                alt="Pranzo"
                                className='w-full h-full object-cover'
                            />
                        </div>

                        {/* FOOTER: Dettagli opzionali */}
                        <div className='p-4'>
                            <p className='text-sm text-gray-600'>
                                Pranzo bilanciato: pollo, verdure e avocado. 🥗
                            </p>
                        </div>
                    </div>
                    : null}
            </div>

        </div>
    );
};



export default Home;