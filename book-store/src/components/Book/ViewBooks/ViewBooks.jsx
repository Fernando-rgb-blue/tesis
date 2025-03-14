import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";



const endpoint = `http://localhost:8000/api/libro/`;
const ejemplarEndpoint = `http://localhost:8000/api/ejemplar/`;
const fotoEndpoint = `http://localhost:8000/api/fotoejemplar/`;

const ViewBook = () => {

    const [isbn, setIsbn] = useState('');
    const [controltopografico, setControltopografico] = useState('');
    const [codigolibroID, setCodigoLibroID] = useState('');
    const [titulo, setTitulo] = useState('');
    const [autorID, setAutorID] = useState('');
    const [numeropaginas, setNumeropaginas] = useState('');
    const [ejemplaresdisponibles, setEjemplaresdisponibles] = useState('');
    const [resumen, setResumen] = useState('');
    const [volumen, setVolumen] = useState('');
    const [tomo, setTomo] = useState('');
    const [categoriaID, setCategoriaID] = useState('');
    const [edicion, setEdicion] = useState('');
    const [editorialID, setEditorialID] = useState('');
    const [pais, setPais] = useState('');
    const [idioma, setIdioma] = useState('');
    const [aniopublicacion, setAniopublicacion] = useState('');
    const [formadeadquisicion, setFormadeadquisicion] = useState('');
    const [precio, setPrecio] = useState('');
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
    const [newPrecioLibro, setNewPrecioLibro] = useState('');



    const [selectedPhotos, setSelectedPhotos] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure(); // Manejo correcto del modal

    const { id } = useParams();

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await axios.get(`${endpoint}${id}`);
                const bookData = response.data;

                setIsbn(bookData.isbn);
                setCodigoLibroID(bookData.codigolibroID);
                setTitulo(bookData.titulo);
                setAutorID(bookData.autorID);
                setCategoriaID(bookData.categoriaID);
                setEditorialID(bookData.editorialID);
                setAniopublicacion(bookData.aniopublicacion);
                setEjemplaresdisponibles(bookData.ejemplaresdisponibles);
                setEdicion(bookData.edicion);
                setNumeropaginas(bookData.numeropaginas);
                setVolumen(bookData.volumen);
                setTomo(bookData.tomo);
                setResumen(bookData.resumen);
                setControltopografico(bookData.controltopografico);
                setPais(bookData.pais);
                setIdioma(bookData.idioma);
                setFormadeadquisicion(bookData.formadeadquisicion);
                setPrecio(bookData.precio);
                setProcedenciaproovedor(bookData.procedenciaproovedor);

                setAutorID(bookData.autorID);
                setCategoriaID(bookData.categoriaID);
                setEditorialID(bookData.editorialID);
                setRutafoto(bookData.rutafoto);

                // Fetch ejemplares based on codigolibroID
                const ejemplarResponse = await axios.get(`${ejemplarEndpoint}${bookData.codigolibroID}`);
                setEjemplares(ejemplarResponse.data);
            } catch (error) {
                console.error('Error fetching book or ejemplar data:', error);
            }
        };

        fetchBookData();
    }, [id]);


    // Abrir modal para editar ejemplar

    const handleEdit = (ejemplar) => {
        setIsEditing(true);
        setSelectedEjemplar(ejemplar);
        setNewNingresoID(ejemplar.ningresoID);
        setNewEstadoLibro(ejemplar.estadolibro);
        setNewPrecioLibro(ejemplar.precio);
        setIsModalOpen(true);
    };

    // Abrir modal para agregar nuevo ejemplar

    const handleAddEjemplar = () => {
        setIsEditing(false);
        setSelectedEjemplar(null);
        setNewNingresoID('');
        setNewEstadoLibro('');
        setNewPrecioLibro('');
        setIsModalOpen(true);
    };

    // Actualizar ejemplar existente

    const handleUpdateEjemplar = async () => {
        try {
            await axios.put(`${ejemplarEndpoint}${selectedEjemplar.codigolibroID}/${selectedEjemplar.ningresoID}`, {
                ningresoID: newNingresoID,
                estadolibro: newEstadoLibro,
                precio: newPrecioLibro
            });

            setEjemplares(prevEjemplares =>
                prevEjemplares.map(ej =>
                    ej.ningresoID === selectedEjemplar.ningresoID ? { ...ej, ningresoID: newNingresoID, estadolibro: newEstadoLibro, precio: newPrecioLibro } : ej
                )
            );

            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating ejemplar:', error);
        }
    };

    // Agregar nuevo ejemplar

    const handleCreateEjemplar = async () => {
        try {
            const response = await axios.post(`${ejemplarEndpoint}${codigolibroID}`, { // Usa `codigolibroID` en la URL
                ningresoID: newNingresoID,
                estadolibro: newEstadoLibro,
                precio: newPrecioLibro
            });

            setEjemplares([...ejemplares, response.data.ejemplar]); // Agrega el nuevo ejemplar a la lista
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al agregar el ejemplar:', error);
        }
    };

    const handleDeleteEjemplar = async (codigolibroID, ningresoID) => {
        try {
            await axios.delete(`${ejemplarEndpoint}${codigolibroID}/${ningresoID}`);
            setEjemplares(ejemplares.filter(e => e.ningresoID !== ningresoID)); // Filtra la lista eliminando el ejemplar
        } catch (error) {
            console.error('Error al eliminar el ejemplar:', error);
        }
    };


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


    const handleDelete = async (ruta) => {
        try {
            const foto = selectedPhotos.find(f => f.rutafoto === ruta);
            if (!foto) return alert("No se encontró la foto");

            console.log("ID extraído:", foto.id);

            const response = await fetch(`http://localhost:8000/api/fotoejemplar/${foto.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert("Foto eliminada correctamente");
                setSelectedPhotos(prev => prev.filter(f => f.rutafoto !== ruta));
            } else {
                alert("Error al eliminar la foto");
            }
        } catch (error) {
            console.error("Error eliminando la foto:", error);
            alert("Error en la eliminación");
        }
    };


    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Si hay fotos, usa el ningresoID de la primera foto. Si no, usa selectedNingresoID.
        const ningresoID = selectedPhotos.length > 0 ? selectedPhotos[0].ningresoID : selectedNingresoID;

        if (!ningresoID) {
            alert("No se encontró un ingresoID válido.");
            return;
        }

        console.log("Subiendo foto con ningresoID:", ningresoID);

        const formData = new FormData();
        formData.append("rutafoto", file);
        formData.append("ningresoID", ningresoID);

        try {
            const response = await fetch("http://localhost:8000/api/fotoejemplar", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Foto subida correctamente");
                // Recargar las fotos después de subir
                handleViewPhotos(ningresoID);
            } else {
                alert("Error al subir la foto");
            }
        } catch (error) {
            console.error("Error subiendo la foto:", error);
            alert("Error en la subida");
        }
    };



    const handleUploadButtonClick = () => {
        document.querySelector('input[type="file"]').click();
    };


    return (
        <div className="h-[calc(100vh-88px)] flex items-center justify-center bg-gray-200 dark:bg-black">
            <div className="w-11/12 lg:w-3/4 xl:w-2/3 text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-md shadow-md overflow-auto">

                <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
                    {titulo}
                </h3>

                {/* Contenedor General */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Columna 1: Imagen del libro */}

                    <div className="flex justify-center items-center">
                        <img
                            src={`http://localhost:8000/storage/${rutafoto}`}
                            alt="Imagen del libro"
                            className="w-full max-w-md h-auto object-contain rounded-lg shadow-md"
                        />
                    </div>


                    {/* Columna 2: Datos del libro */}
                    <div className="flex flex-col">

                        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                    <span className="font-bold">Autor:</span> {autorID}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Número de Páginas:</span> {numeropaginas}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Volumen:</span> {volumen}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Tomo:</span> {tomo}
                                </p>
                            </div>

                            {/* Columna 2 */}
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Categoría:</span> {categoriaID}
                                </p>
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
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Forma de Adquisición:</span> {formadeadquisicion}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-bold">Precio:</span> {precio}
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

                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-md overflow-auto">
                            <Table aria-label="Tabla de ejemplares" isStriped>
                                <TableHeader>
                                    <TableColumn>N. Ingreso</TableColumn>
                                    <TableColumn>Estado del Libro</TableColumn>
                                    <TableColumn>Precio</TableColumn>
                                    <TableColumn className="text-center">Acción</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {ejemplares.map((ejemplar, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{ejemplar.ningresoID}</TableCell>
                                            <TableCell>{ejemplar.estadolibro}</TableCell>
                                            <TableCell>{ejemplar.precio}</TableCell>
                                            <TableCell className="flex justify-center gap-2">
                                                <Button color="warning" onPress={() => handleEdit(ejemplar)}>
                                                    ✏️
                                                </Button>
                                                <Button color="danger" onPress={() => handleDeleteEjemplar(ejemplar.codigolibroID, ejemplar.ningresoID)}>
                                                    🗑️
                                                </Button>
                                                <Button color="secondary" onPress={() => handleViewPhotos(ejemplar.ningresoID)}>
                                                    📷
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Botón fuera de la tabla y centrado */}
                            <div className="flex justify-center mt-4">
                                <Button color="primary" onPress={handleAddEjemplar}>
                                    ➕ Agregar Ejemplar
                                </Button>
                            </div>
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
                                            onChange={(e) => setNewPrecioLibro(e.target.value)}
                                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            onClick={isEditing ? handleUpdateEjemplar : handleCreateEjemplar}
                                        >
                                            {isEditing ? 'Guardar' : 'Agregar'}
                                        </button>
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
                                                        <div className="flex gap-2 mt-4">
                                                            <Button
                                                                className="bg-red-500 text-white"
                                                                onClick={() => handleDelete(foto.rutafoto)}
                                                            >
                                                                Eliminar Foto
                                                            </Button>
                                                            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                                                                Agregar Imagen
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleUpload(e, selectedNingresoID)}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>
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

                                                    <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-4">
                                                        Añadir Nueva Foto
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                console.log("Archivo seleccionado:", e.target.files[0]);
                                                                console.log("Ingreso ID al subir foto:", selectedNingresoID);
                                                                handleUpload(e, selectedNingresoID);
                                                            }}
                                                            className="hidden"
                                                        />
                                                    </label>
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
        </div>
    );

};

export default ViewBook;
