import React, { useState } from "react";
import axios from "axios";
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";

const endpoint = `http://localhost:8000/api/autor`;

const CreateAutor = ({ isOpen, onOpenChange, closeModal }) => {
  const [nombre, setNombre] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [error, setError] = useState("");

  const create = async (e, onClose) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(endpoint, { nombre, nacionalidad });
      onClose();           // Cierra el modal visualmente
      onOpenChange(false); // Informa al padre que el modal fue cerrado
      closeModal();        // Ejecuta lógica adicional desde el padre (como recargar datos)
    } catch (error) {
      console.error("Error al crear el autor:", error);
      setError("Hubo un error al crear el autor. Por favor, intenta nuevamente.");
    }
  };

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
          exit: { y: -20, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
        },
      }}
      className="bg-gray-200 dark:bg-stone-900"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Crear Nuevo Autor
              </h3>
            </ModalHeader>

            <ModalBody>
              {error && <p className="text-red-500 mb-4">{error}</p>}

              <form
                onSubmit={(e) => create(e, onClose)}
                className="grid grid-cols-1 gap-6"
              >
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
                    Nombre
                  </label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
                    Nacionalidad
                  </label>
                  <Input
                    value={nacionalidad}
                    onChange={(e) => setNacionalidad(e.target.value)}
                    type="text"
                    required
                  />
                </div>

                <div>
                  <Button type="submit" color="primary" className="w-full">
                    Crear
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateAutor;
