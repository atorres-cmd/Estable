import { useState, useEffect } from "react";
import { Bell, BellRing, CheckCircle2 } from "lucide-react";

// Tipos para las alarmas
interface Alarm {
  id: string;
  deviceId: string;
  deviceName: string;
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: Date;
  acknowledged: boolean;
}

const AlarmPanel = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: "alarm-001",
      deviceId: "ELEV-001",
      deviceName: "Elevador",
      message: "Fallo en sistema de descenso",
      severity: "critical",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
      acknowledged: false,
    },
    {
      id: "alarm-002",
      deviceId: "TRANS-002",
      deviceName: "Transelevador 2",
      message: "Sensor de posición con lecturas intermitentes",
      severity: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutos atrás
      acknowledged: false,
    },
    {
      id: "alarm-003",
      deviceId: "PUENTE-001",
      deviceName: "Puente",
      message: "Tiempo de inactividad superior a 30 minutos",
      severity: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 32), // 32 minutos atrás
      acknowledged: true,
    },
  ]);

  // Simulación de nuevas alarmas
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% de probabilidad de generar una nueva alarma
      if (Math.random() > 0.9) {
        const devices = [
          { id: "TRANS-001", name: "Transelevador 1" },
          { id: "TRANS-002", name: "Transelevador 2" },
          { id: "TRANSF-001", name: "Carro Transferidor" },
          { id: "PUENTE-001", name: "Puente" },
          { id: "ELEV-001", name: "Elevador" },
        ];
        
        const messages = [
          { text: "Velocidad fuera de rango nominal", severity: "warning" },
          { text: "Pérdida de comunicación momentánea", severity: "info" },
          { text: "Sensor de proximidad activado inesperadamente", severity: "warning" },
          { text: "Error en secuencia de operación", severity: "critical" },
          { text: "Temperatura del motor elevada", severity: "warning" },
        ];
        
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const newAlarm: Alarm = {
          id: `alarm-${Date.now()}`,
          deviceId: randomDevice.id,
          deviceName: randomDevice.name,
          message: randomMessage.text,
          severity: randomMessage.severity as "critical" | "warning" | "info",
          timestamp: new Date(),
          acknowledged: false,
        };
        
        setAlarms(prev => [newAlarm, ...prev].slice(0, 10)); // Mantener máximo 10 alarmas
      }
    }, 15000); // Cada 15 segundos
    
    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, acknowledged: true } : alarm
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "warning":
        return "text-amber-600 bg-amber-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <BellRing className="h-5 w-5 text-red-600" />;
      case "warning":
        return <Bell className="h-5 w-5 text-amber-600" />;
      case "info":
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const activeAlarms = alarms.filter(alarm => !alarm.acknowledged);

  return (
    <div className="bg-white rounded-xl shadow-operator p-4 my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">
          Alarmas Activas <span className="text-sm font-normal text-gray-500">({activeAlarms.length} sin reconocer)</span>
        </h2>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
            Críticas: {alarms.filter(a => a.severity === "critical" && !a.acknowledged).length}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
            Advertencias: {alarms.filter(a => a.severity === "warning" && !a.acknowledged).length}
          </span>
        </div>
      </div>
      
      {alarms.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay alarmas activas en este momento
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 max-h-[300px] overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {alarms.map((alarm) => (
              <li 
                key={alarm.id} 
                className={`p-4 flex items-start justify-between ${
                  alarm.acknowledged ? "bg-gray-50" : getSeverityColor(alarm.severity)
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-0.5">
                    {alarm.acknowledged ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      getSeverityIcon(alarm.severity)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alarm.deviceName} ({alarm.deviceId})
                    </p>
                    <p className="text-sm text-gray-700">{alarm.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(alarm.timestamp)}
                    </p>
                  </div>
                </div>
                {!alarm.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlarm(alarm.id)}
                    className="ml-3 flex-shrink-0 bg-white rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-3 py-1 border border-gray-300"
                  >
                    Reconocer
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlarmPanel;
