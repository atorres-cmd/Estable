import axios from 'axios';
import { MARIADB_API_URL } from './api';

// Interfaz para los datos del Carro Transferidor (CT) de MariaDB
export interface CTStatusData {
  id: number;
  timestamp: string;
  StConectado: number;
  StDefecto: number;
  St_Auto: number;
  St_Semi: number;
  St_Manual: number;
  St_Puerta: number;
  St_Datos: number;
  MatEntrada: number;
  MatSalida: number;
  PasDestino: number;
  CicloTrabajo: number;
  PasActual: number;
  St_Carro: number;
  // Añadir otros campos según sea necesario
}

// Función para obtener los datos del Carro Transferidor (CT) desde MariaDB
export const getCTStatusFromMariaDB = async (): Promise<CTStatusData> => {
  try {
    // Ruta para obtener los datos del CT
    const response = await axios.get(`${MARIADB_API_URL}/db112/read`);
    
    // Verificar si la respuesta tiene el formato esperado
    if (response.data && response.data.success && response.data.data) {
      console.log('Datos del Carro Transferidor (CT) desde MariaDB:', response.data.data);
      return response.data.data;
    } else {
      console.error('Formato de respuesta incorrecto para el CT:', response.data);
      throw new Error('Formato de respuesta incorrecto para el CT');
    }
  } catch (error) {
    console.error('Error al obtener datos del Carro Transferidor (CT) desde MariaDB:', error);
    throw error;
  }
};

// Función para obtener una descripción textual del estado del carro
export const getCarroEstadoText = (estado: number): string => {
  switch (estado) {
    case 0:
      return 'Libre';
    case 1:
      return 'Ocupado';
    case 2:
      return 'Avería';
    default:
      return 'Desconocido';
  }
};

// Función para obtener el color según el estado del carro
export const getCarroEstadoColor = (estado: number): string => {
  switch (estado) {
    case 0:
      return 'green'; // Libre
    case 1:
      return 'blue'; // Ocupado
    case 2:
      return 'red'; // Avería
    default:
      return 'gray'; // Desconocido
  }
};

// Función para sincronizar los datos del CT desde el PLC
export const syncCTFromPLC = async (): Promise<void> => {
  try {
    const response = await axios.post(`${MARIADB_API_URL}/db112/sync`);
    
    if (response.data && response.data.success) {
      console.log('Sincronización del CT exitosa:', response.data);
      return;
    } else {
      console.error('Error en la sincronización del CT:', response.data);
      throw new Error('Error en la sincronización del CT');
    }
  } catch (error) {
    console.error('Error al sincronizar datos del CT desde el PLC:', error);
    throw error;
  }
};
