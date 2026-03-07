import { Link } from 'react-router-dom';
import { Rocket, Zap, Shield, ChevronRight, Calendar, ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { useState } from 'react';

const Home = () => {
    const [menu_colazione, setMenu_Colazione] = useState(true);
    const [menu_spuntino, setMenu_Spuntino] = useState(true);
    const [menu_pranzo, setMenu_Pranzo] = useState(true);
    const [menu_cena, setMenu_Cena] = useState(true);

    return (
        <div className="min-h-screen bg-white pb-24 ">
            {/* Questo div rimarrà incollato in alto, ma rispetterà lo spazio degli altri */}
            <div className='sticky top-0 z-50 bg-white pb-4 w-full border-b border-gray-100'>
                <div className='flex items-center flex-col pt-4'>
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="User Avatar"
                        className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover shadow-sm"
                    />
                    <h1 className='text-2xl font-bold'>Ciao, Matteo Salvaggio</h1>
                    <h3 className='text-gray-500'>Giorno 0 dalla tua dieta</h3>
                </div>
            </div>


            <div className='m-10 flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Post Diario</h1>
                <Calendar size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />

            </div>

            {/*Colazione*/}
            <div className='w-full'>
                <div className=' bg-amber-500  flex items-center justify-between '>
                    <h1 className='text-2xl font-bold'>Colazione</h1>
                    {menu_colazione ? <ArrowBigUp onClick={() => setMenu_Colazione(!menu_colazione)} size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />
                        : <ArrowBigDown onClick={() => setMenu_Colazione(!menu_colazione)} size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />}


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
                <div className=' bg-amber-500  flex items-center justify-between '>
                    <h1 className='text-2xl font-bold'>Spuntino</h1>
                    {menu_spuntino ? <ArrowBigUp onClick={() => setMenu_Spuntino(!menu_spuntino)} size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />
                        : <ArrowBigDown onClick={() => setMenu_Spuntino(!menu_spuntino)} size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />}


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
                <div className='mt-5 bg-amber-500  flex items-center justify-between '>
                    <h1 className='text-2xl font-bold'>Pranzo</h1>
                    {menu_pranzo ? <ArrowBigUp onClick={() => setMenu_Pranzo(!menu_pranzo)} size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />
                        : <ArrowBigDown onClick={() => setMenu_Pranzo(!menu_pranzo)} size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />}


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
                <div className='mt-5 bg-amber-500  flex items-center justify-between '>
                    <h1 className='text-2xl font-bold'>Cena</h1>
                    {menu_cena ? <ArrowBigUp onClick={() => setMenu_Cena(!menu_cena)} size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />
                        : <ArrowBigDown onClick={() => setMenu_Cena(!menu_cena)} size={28} className="text-blue-500 group-hover:text-blue-700 transition-colors" />}


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