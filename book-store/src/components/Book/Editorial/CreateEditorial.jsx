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

const endpoint = `http://localhost:8000/api/editorial`;

const CreateEditorial = ({ isOpen, onOpenChange }) => {
  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("");
  const [error, setError] = useState("");

  const create = async (e, onClose) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(endpoint, { nombre, pais });
      onClose(); // Cierra el modal
      onOpenChange(false); // Actualiza el estado padre
    } catch (error) {
      console.error("Error al crear la editorial:", error);
      setError("Hubo un error al crear la editorial. Por favor, intenta nuevamente.");
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
      className="bg-gray-200  dark:bg-stone-900"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
                Crear Nueva Editorial
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
                    type="text" required
                  />

                </div>

                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-100">
                    País
                  </label>

                  <Input
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                    type="text"
                    required
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    color="primary"
                    className="w-full"
                  >
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

export default CreateEditorial;
