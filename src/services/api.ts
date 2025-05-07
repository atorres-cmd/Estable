// API Service para consumir datos del backend
import axios from 'axios';

// Obtener el hostname actual (dominio o IP)
const currentHost = window.location.hostname;

// Determinar las URLs base según el hostname
let apiBaseUrl, mariadbApiBaseUrl;

if (currentHost === 'localhost' || currentHost.match(/^192\.168\.131\.\d+$/)) {
  // Si estamos accediendo desde localhost o una IP en el rango 192.168.131.xxx
  apiBaseUrl = `http://${currentHost}:3000/api`;
  mariadbApiBaseUrl = `http://${currentHost}:3003/api/mariadb`;
} else {
  // Fallback a las URLs originales
  apiBaseUrl = 'http://localhost:3000/api';
  mariadbApiBaseUrl = 'http://localhost:3003/api/mariadb';
}

// URL base de la API del backend
const API_URL = apiBaseUrl;

// URL base de la API de MariaDB
const MARIADB_API_URL = mariadbApiBaseUrl;

console.log('API URLs configuradas:', { API_URL, MARIADB_API_URL });

// Interfaz para los datos del Transelevador
export interface TranselevadorData {
  id: string;
  name: string;
  status: string;
  position_x: number;
  position_y: number;
  position_z: number;
  last_activity: string;
  cycles_today: number;
  efficiency: number;
}

// Interfaz para las alarmas
export interface Alarma {
  id: string;
  titulo: string;
  descripcion: string;
  timestamp: string;
  tipo: 'error' | 'warning' | 'info' | 'success';
}

// Interfaz para los datos de TLV1_Status de MariaDB
export interface TLV1StatusData {
  id: number;
  modo: number;
  ocupacion: number;
  averia: number;
  matricula: number;
  pasillo_actual: number;
  x_actual: number;
  y_actual: number;
  z_actual: number;
  timestamp: string;
  estadoFinOrden: number;
  resultadoFinOrden: number;
}

// Interfaz para los datos de TLV2_Status de MariaDB (misma estructura que TLV1)
export interface TLV2StatusData extends TLV1StatusData {}

// Interfaz para los datos de PT_Status de MariaDB
export interface PTStatusData {
  id: number;
  ocupacion: number;
  estado: number;
  situacion: number;
  posicion: number;
  timestamp: string;
}

// Servicio para obtener datos del Transelevador 1
export const getTranselevadorData = async (id: string): Promise<TranselevadorData> => {
  try {
    const response = await axios.get(`${API_URL}/transelevadores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del transelevador:', error);
    
    // Datos de ejemplo en caso de error (para desarrollo)
    return {
      id: 'TRANS-001',
      name: 'Transelevador T1',
      status: 'active',
      position_x: 7,
      position_y: 5,
      position_z: 1,
      last_activity: new Date().toISOString(),
      cycles_today: 127,
      efficiency: 98.5
    };
  }
};

// Servicio para obtener alarmas del Transelevador 1
export const getTranselevadorAlarmas = async (id: string): Promise<Alarma[]> => {
  try {
    const response = await axios.get(`${API_URL}/transelevadores/${id}/alarmas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener alarmas del transelevador:', error);
    
    // Datos de ejemplo en caso de error (para desarrollo)
    return [
      {
        id: 'alm-001',
        titulo: 'Error de posicionamiento',
        descripcion: 'El transelevador T1 ha reportado un error en el posicionamiento vertical.',
        timestamp: new Date().toISOString(),
        tipo: 'error'
      },
      {
        id: 'alm-002',
        titulo: 'Mantenimiento preventivo',
        descripcion: 'Se requiere mantenimiento preventivo del sistema hidráulico.',
        timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 minutos antes
        tipo: 'warning'
      },
      {
        id: 'alm-003',
        titulo: 'Ciclo completado',
        descripcion: 'El transelevador T1 ha completado el ciclo de almacenamiento #4532.',
        timestamp: new Date(Date.now() - 2400000).toISOString(), // 40 minutos antes
        tipo: 'success'
      }
    ];
  }
};

// Servicio para obtener datos del TLV1 desde MariaDB
export const getTLV1StatusFromMariaDB = async (): Promise<TLV1StatusData> => {
  try {
    const response = await axios.get(`${MARIADB_API_URL}/tlv1`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de TLV1 desde MariaDB:', error);
    
    // Datos de ejemplo en caso de error (para desarrollo)
    return {
      id: 1,
      modo: 1,
      ocupacion: 0,
      averia: 0,
      matricula: 1001,
      pasillo_actual: 1,
      x_actual: 10,
      y_actual: 5,
      z_actual: 3,
      timestamp: new Date().toISOString(),
      estadoFinOrden: 0,
      resultadoFinOrden: 0
    };
  }
};

// Servicio para obtener el historial de estados del TLV1 desde MariaDB
export const getTLV1HistoryFromMariaDB = async (limit: number = 10): Promise<TLV1StatusData[]> => {
  try {
    const response = await axios.get(`${MARIADB_API_URL}/tlv1/historial?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de TLV1 desde MariaDB:', error);
    
    // Datos de ejemplo en caso de error (para desarrollo)
    return [
      {
        id: 1,
        modo: 1,
        ocupacion: 0,
        averia: 0,
        matricula: 1001,
        pasillo_actual: 1,
        x_actual: 10,
        y_actual: 5,
        z_actual: 3,
        timestamp: new Date().toISOString(),
        estadoFinOrden: 0,
        resultadoFinOrden: 0
      }
    ];
  }
};

// Servicio para obtener datos del TLV2 desde MariaDB
export const getTLV2StatusFromMariaDB = async (): Promise<TLV2StatusData> => {
  try {
    const response = await axios.get(`${MARIADB_API_URL}/tlv2`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de TLV2 desde MariaDB:', error);
    
    // Datos de ejemplo en caso de error (para desarrollo)
    return {
      id: 1,
      modo: 1,
      ocupacion: 0,
      averia: 0,
      matricula: 2001,
      pasillo_actual: 4,
      x_actual: 30,
      y_actual: 8,
      z_actual: 2,
      timestamp: new Date().toISOString(),
      estadoFinOrden: 0,
      resultadoFinOrden: 0
    };
  }
};

// Servicio para obtener el historial de estados del TLV2 desde MariaDB
export const getTLV2HistoryFromMariaDB = async (limit: number = 10): Promise<TLV2StatusData[]> => {
  try {
    const response = await axios.get(`${MARIADB_API_URL}/tlv2/historial?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de TLV2 desde MariaDB:', error);
    
    // Datos de ejemplo en caso de error (para desarrollo)
    return [
      {
        id: 1,
        modo: 1,
        ocupacion: 0,
        averia: 0,
        matricula: 2001,
        pasillo_actual: 4,
        x_actual: 30,
        y_actual: 8,
        z_actual: 2,
        timestamp: new Date().toISOString(),
        estadoFinOrden: 0,
        resultadoFinOrden: 0
      }
    ];
  }
};

// Servicio para obtener datos del Puente Transferidor (PT) desde MariaDB
export const getPTStatusFromMariaDB = async (): Promise<PTStatusData> => {
  try {
    // Intentar primero con la API de MariaDB específica
    try {
      const response = await axios.get(`${MARIADB_API_URL}/puente`);
      console.log('Datos del PT obtenidos desde MariaDB API:', response.data);
      return response.data;
    } catch (mariadbError) {
      console.warn('Error al obtener datos del PT desde MariaDB API, intentando con API principal:', mariadbError);
      // Si falla, intentar con la API principal
      const response = await axios.get(`${API_URL}/pt`);
      console.log('Datos del PT obtenidos desde API principal:', response.data);
      return response.data.data || response.data; // La API puede devolver { success: true, data: {...} } o directamente los datos
    }
  } catch (error) {
    console.error('Error al obtener datos del Puente Transferidor:', error);
    
    // Datos de ejemplo en caso de error (para desarrollo)
    return {
      id: 1,
      ocupacion: 0,
      estado: 0,
      situacion: 0,
      posicion: 8, // Actualizado a posición 8 según la base de datos
      timestamp: new Date().toISOString()
    };
  }
};

// Servicio para obtener el historial de estados del Puente Transferidor (PT) desde MariaDB
export const getPTHistoryFromMariaDB = async (limit: number = 10): Promise<PTStatusData[]> => {
  try {
    // Intentar primero con la API de MariaDB específica
    try {
      const response = await axios.get(`${MARIADB_API_URL}/puente/historial?limit=${limit}`);
      console.log('Historial del PT obtenido desde MariaDB API:', response.data);
      return response.data;
    } catch (mariadbError) {
      console.warn('Error al obtener historial del PT desde MariaDB API, intentando alternativas:', mariadbError);
      
      // Intentar con la API principal
      try {
        const response = await axios.get(`${API_URL}/pt/historial?limit=${limit}`);
        console.log('Historial del PT obtenido desde API principal:', response.data);
        return response.data.data || response.data;
      } catch (apiError) {
        // Si también falla, intentar obtener datos históricos de la tabla PT_Status
        console.warn('Error al obtener historial del PT desde API principal, generando datos de ejemplo:', apiError);
        
        // Obtener el estado actual y generar historial ficticio basado en él
        const currentStatus = await getPTStatusFromMariaDB();
        const mockHistory = [];
        
        for (let i = 0; i < limit; i++) {
          mockHistory.push({
            ...currentStatus,
            id: i + 1,
            timestamp: new Date(Date.now() - i * 60000).toISOString() // Cada entrada es 1 minuto más antigua
          });
        }
        
        return mockHistory;
      }
    }
  } catch (error) {
    console.error('Error al obtener historial del Puente Transferidor:', error);
    
    // Datos de ejemplo en caso de error (para desarrollo)
    return [
      {
        id: 1,
        ocupacion: 0,
        estado: 0,
        situacion: 0,
        posicion: 5,
        timestamp: new Date().toISOString()
      }
    ];
  }
};

// Servicio para sincronizar manualmente los datos del Puente Transferidor (PT) desde el PLC
export const syncPTFromPLC = async (): Promise<PTStatusData> => {
  try {
    // Intentar primero con la API de MariaDB específica
    try {
      const response = await axios.post(`${MARIADB_API_URL}/puente/sync`);
      console.log('Sincronización del PT desde MariaDB API:', response.data);
      return response.data;
    } catch (mariadbError) {
      console.warn('Error al sincronizar PT desde MariaDB API, intentando con API principal:', mariadbError);
      
      // Si falla, intentar con la API principal
      const response = await axios.post(`${API_URL}/pt/sync`);
      console.log('Sincronización del PT desde API principal:', response.data);
      return response.data.data || response.data; // La API puede devolver { success: true, data: {...} } o directamente los datos
    }
  } catch (error) {
    console.error('Error al sincronizar datos del Puente Transferidor desde el PLC:', error);
    throw error;
  }
};
