import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import BookDefault from '../../../assets/books/book4.png';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import {
    Pagination,
    Tooltip,
    Spinner,
} from "@heroui/react";
import { EyeIcon, EditIcon, DeleteIcon } from "lucide-react";


const endpoint = `http://localhost:8000/api/libro/`;
const ejemplarEndpoint = `http://localhost:8000/api/ejemplar/`;
const fotoEndpoint = `http://localhost:8000/api/fotoejemplar/`;

const ViewLibrary = () => {

    const [isbn, setIsbn] = useState('');
    const [controltopografico, setControltopografico] = useState('');
    const [codigolibroID, setCodigoLibroID] = useState('');
    const [titulo, setTitulo] = useState('');
    const [autorID, setAutorID] = useState('');
    const [numeropaginas, setNumeropaginas] = useState('');
    const [ejemplaresdisponibles, setEjemplaresdisponibles] = useState('');
    const [resumen, setResumen] = useState('');
    const [voltomejemp, setVoltomejemp] = useState('');
    const [categoriaID, setCategoriaID] = useState('');
    const [edicion, setEdicion] = useState('');
    const [editorialID, setEditorialID] = useState('');
    const [pais, setPais] = useState('');
    const [idioma, setIdioma] = useState('');
    const [aniopublicacion, setAniopublicacion] = useState('');
    const [formadeadquisicion, setFormadeadquisicion] = useState('');
    const [procedenciaproovedor, setProcedenciaproovedor] = useState('');
    const [autores, setAutores] = useState('');
    const [categorias, setCategorias] = useState('');
    const [editoriales, setEditoriales] = useState('');
    const [ejemplares, setEjemplares] = useState([]);
    const [rutafoto, setRutafoto] = useState([]);
    const [selectedNingresoID, setSelectedNingresoID] = useState(null); // Guarda el ningresoID

    // Estados para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEjemplar, setSelectedEjemplar] = useState(null);
    const [newNingresoID, setNewNingresoID] = useState('');
    const [newEstadoLibro, setNewEstadoLibro] = useState('');
    const [newAnioIngreso, setNewAnioIngreso] = useState('');
    const [newPrecioLibro, setNewPrecioLibro] = useState('');
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure(); // Manejo correcto del modal

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 5;

    const { id } = useParams();

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                // 1. Obtener datos del libro
                const response = await axios.get(`${endpoint}${id}`);
                const bookData = response.data;

                // Setear campos del libro
                setIsbn(bookData.isbn);
                setCodigoLibroID(bookData.codigolibroID);
                setTitulo(bookData.titulo);
                setCategoriaID(bookData.categoriaID);
                setEditorialID(bookData.editorialID);
                setAniopublicacion(bookData.aniopublicacion);
                setEjemplaresdisponibles(bookData.ejemplaresdisponibles);
                setEdicion(bookData.edicion);
                setNumeropaginas(bookData.numeropaginas);
                setVoltomejemp(bookData.voltomejemp);
                setResumen(bookData.resumen);
                setControltopografico(bookData.controltopografico);
                setPais(bookData.pais);
                setIdioma(bookData.idioma);
                setFormadeadquisicion(bookData.formadeadquisicion);
                setProcedenciaproovedor(bookData.procedenciaproovedor);
                setRutafoto(bookData.rutafoto);


                // 2. Obtener autores asociados desde autorlibro
                const autorLibroRes = await axios.get(`http://localhost:8000/api/autorlibros/${bookData.id}`);
                const autoresDelLibro = autorLibroRes.data; // asegúrate de que esto sea un array de objetos con nombre

                setAutorID(autoresDelLibro.map((a) => a.nombre).join(', '));


                // 3. Obtener ejemplares relacionados
                const ejemplarResponse = await axios.get(`${ejemplarEndpoint}${bookData.codigolibroID}`);
                setEjemplares(ejemplarResponse.data);
            } catch (error) {
                console.error('Error fetching book, autores o ejemplares:', error);
            }
        };

        fetchBookData();
    }, [id]);




    // Ver fotos
    const handleViewPhotos = async (ningresoID) => {
        console.log("Valor de ningresoID ingresado:", ningresoID); // Guarda y muestra el ID en consola

        setSelectedNingresoID(ningresoID); // Guarda el ningresoID en el estado

        try {
            const response = await axios.get(`${fotoEndpoint}${ningresoID}`);
            console.log("Respuesta de la API:", response.data);

            if (response.status === 404 || !Array.isArray(response.data)) {
                setSelectedPhotos([]);
            } else {
                setSelectedPhotos(response.data);
            }

            onOpen(); // Abre el modal
        } catch (error) {
            console.error("Error al obtener las fotos:", error);
            setSelectedPhotos([]);
            onOpen(); // Abre el modal aunque haya error
        }
    };

    const paginatedItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return ejemplares.slice(start, start + rowsPerPage);
    }, [page, ejemplares]);

    const totalPages = Math.ceil(ejemplares.length / rowsPerPage);

    return (


        <div className="bg-stone-100 dark:bg-stone-900 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-[110rem] mx-auto mt-[1.5rem] overflow-y-auto max-h-[100vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

            <h3 className="text-3xl font-semibold mb-10 text-center text-gray-800 dark:text-gray-200">
                {titulo}
            </h3>

            {/* Contenedor General */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna 1: Imagen del libro */}

                <div className="bg-stone-200  dark:bg-stone-800 rounded-lg  flex justify-center items-center">
                    <img
                        src={`http://localhost:8000/storage/${rutafoto}`}
                        onError={(e) => {
                            e.currentTarget.src = BookDefault;
                        }}
                        alt="Imagen del libro"
                        className="w-full max-w-md h-auto object-contain  shadow-md"
                    />
                </div>

                {/* Columna 2: Datos del libro */}
                <div className="flex flex-col overflow-y-auto max-h-[45rem]">

                    <div className=" rounded-lg mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Columna 1 */}
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">ISBN:</span> {isbn}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">Código Libro:</span> {codigolibroID}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">Título:</span> {titulo}
                            </p>

                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">Autor(es):</span> {autorID || "No disponible"}
                            </p>

                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">Número de Páginas:</span> {numeropaginas}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">Volu. Tomo o Ejemplar:</span> {voltomejemp}
                            </p>
                        </div>

                        {/* Columna 2 */}
                        <div>

                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">Editorial:</span> {editorialID}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">País:</span> {pais}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">Idioma:</span> {idioma}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">Año de Publicación:</span> {aniopublicacion}
                            </p>

                        </div>

                        {/* Columna 2: Resumen que ocupará las 2 columnas */}
                        <div className="col-span-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold">Resumen:</span> {resumen}
                            </p>
                        </div>
                    </div>

                    {/* Tabla de ejemplares */}


                    <div className="mb-2 text-center">
                        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                            Lista de Ejemplares
                        </h2>
                    </div>

                    <div className="flex-1 dark:bg-stone-800 rounded-lg p-3 overflow-y-auto min-h-[22.5rem]">
                        <Table
                            isStriped
                            aria-label="Tabla de ejemplares con paginación"
                            bottomContent={
                                totalPages > 1 && (
                                    <div className="flex w-full justify-center">
                                        <Pagination
                                            isCompact
                                            showControls
                                            showShadow
                                            color="primary"
                                            page={page}
                                            total={totalPages}
                                            onChange={setPage}
                                        />
                                    </div>
                                )
                            }
                            emptyContent={"Ejemplares no encontrados para el libro"}
                        >
                            <TableHeader>
                                <TableColumn>N. Ingreso</TableColumn>
                                <TableColumn>Estado del Libro</TableColumn>
                                <TableColumn>Precio</TableColumn>
                                <TableColumn className="text-center">Acciones</TableColumn>
                            </TableHeader>

                            <TableBody
                                items={paginatedItems}
                                loadingState={ejemplares.length === 0 ? "loading" : "idle"}
                                loadingContent={<Spinner />}
                            >
                                {(ejemplar, index) => (
                                    <TableRow key={index} onClick={() => handleViewPhotos(ejemplar.ningresoID)} className="cursor-pointer hover:bg-blue-50">
                                        <TableCell>{ejemplar.ningresoID}</TableCell>
                                        <TableCell>{ejemplar.estadolibro}</TableCell>
                                        <TableCell>{ejemplar.precio}</TableCell>

                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-green-600 font-semibold">Libre</span>
                                                <button
                                                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Evita que se dispare handleViewPhotos
                                                        // Aquí puedes llamar a una función si se desea
                                                        console.log("Solicitar préstamo de", ejemplar.ningresoID);
                                                    }}
                                                >
                                                    Solicitar préstamo
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Modal de edición/agregar */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-96">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                                    {isEditing ? 'Editar Ejemplar' : 'Agregar Ejemplar'}
                                </h2>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Número de Ingreso
                                    </label>
                                    <input
                                        type="text"
                                        value={newNingresoID}
                                        onChange={(e) => setNewNingresoID(e.target.value)}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Estado del Libro
                                    </label>
                                    <input
                                        type="text"
                                        value={newEstadoLibro}
                                        onChange={(e) => setNewEstadoLibro(e.target.value)}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Precio
                                    </label>
                                    <input
                                        type="text"
                                        value={newPrecioLibro}
                                        onChange={(e) => {
                                            let value = e.target.value;

                                            // Eliminar "S/" si ya está presente
                                            value = value.replace(/^S\/\s?/, '');

                                            // Validar que sea un número válido con hasta 2 decimales
                                            if (/^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                                                setNewPrecioLibro(`S/ ${value}`);
                                            }
                                        }}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                                    />
                                </div>


                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Fecha de Adquisición
                                    </label>
                                    <input
                                        type="number"
                                        value={newAnioIngreso}
                                        onChange={(e) => setNewAnioIngreso(e.target.value)}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal para mostrar fotos */}

                    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
                        <ModalContent className="max-w-[80vw] max-h-[90vh]">
                            <ModalBody className="flex justify-center items-center overflow-auto p-4">
                                <Swiper
                                    modules={[Navigation]}
                                    navigation
                                    loop={selectedPhotos.length > 0} // Desactiva el loop si no hay fotos
                                    className="w-full h-full"
                                    onSlideChange={(swiper) => {
                                        setTimeout(() => {
                                            const currentIndex = swiper.realIndex;
                                            const currentPhoto = selectedPhotos[currentIndex];

                                            if (currentPhoto) {
                                                console.clear();
                                                console.log("ID de imagen actual:", currentPhoto.id);
                                                console.log("ningresoID actual:", currentPhoto.ningresoID);
                                                console.log("Valor de ningresoID ingresado:", selectedNingresoID);
                                            }
                                        }, 50);
                                    }}
                                >
                                    {selectedPhotos.length > 0 ? (
                                        selectedPhotos.map((foto, index) => (
                                            <SwiperSlide key={index} className="flex justify-center items-center">
                                                <div className="flex flex-col justify-center items-center w-full h-full">
                                                    <img
                                                        src={`http://localhost:8000/storage/${foto.rutafoto}`}
                                                        alt={`Foto ${index + 1}`}
                                                        className="max-w-full max-h-full object-contain rounded-lg"
                                                        style={{
                                                            maxWidth: '80vw',
                                                            maxHeight: '80vh',
                                                            width: 'auto',
                                                            height: 'auto',
                                                            objectFit: 'contain',
                                                            display: 'block',
                                                            margin: 'auto'
                                                        }}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))
                                    ) : (

                                        // Slide especial cuando no hay fotos
                                        (<SwiperSlide className="flex justify-center items-center">
                                            <div className="flex flex-col justify-center items-center w-full h-full">
                                                {console.clear()}
                                                {console.log("No se encontraron fotos para el ingreso ID:", selectedNingresoID)}
                                                <p className="text-lg font-semibold">No se han encontrado fotos para el ingreso ID: {selectedNingresoID}</p>
                                            </div>
                                        </SwiperSlide>)
                                    )}
                                </Swiper>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </div>
            </div>
        </div>

    );

};

export default ViewLibrary;
