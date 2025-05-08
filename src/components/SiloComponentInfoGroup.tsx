
import { FC } from "react";
import { TLV1StatusData, TLV2StatusData } from "../services/api";

type ComponentStatus = "active" | "inactive" | "error" | "moving";

interface SiloComponent {
  id: string;
  name: string;
  type: "transelevador" | "transferidor" | "puente" | "elevador";
  status: ComponentStatus;
  position: {
    x: number;
    y: number;
    z?: number;
    pasillo?: number;
  };
}

interface SiloComponentInfoGroupProps {
  components: SiloComponent[];
  getStatusColor: (status: ComponentStatus) => string;
  tlv1Data?: TLV1StatusData | null;
  tlv2Data?: TLV2StatusData | null;
}

const SiloComponentInfoGroup: FC<SiloComponentInfoGroupProps> = ({
  components,
  getStatusColor,
  tlv1Data,
  tlv2Data,
}) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {components.map((component) => (
        <div
          key={`info-${component.id}`}
          className="bg-slate-50 p-3 rounded-md border border-operator-border flex flex-col"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{component.name}</h3>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(component.status)}`}></div>
          </div>
          <div className="text-sm mt-2">
            <p>
              Estado:{" "}
              {component.status.charAt(0).toUpperCase() +
                component.status.slice(1)}
            </p>
            {component.type === "transelevador" ? (
              <div className="mt-3">
                <span className="font-semibold text-gray-700">
                  Coordinadas:
                </span>
                <div className="flex gap-2 mt-1 w-full justify-between">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-operator-blue">
                      Pasillo
                    </span>
                    <span className="text-base font-bold text-gray-700">
                      {component.position.y}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-operator-blue">
                      X
                    </span>
                    <span className="text-base font-bold text-gray-700">
                      {component.position.x}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-operator-blue">
                      Y
                    </span>
                    <span className="text-base font-bold text-gray-700">
                      {/* Para los transelevadores, usamos los datos de MariaDB si están disponibles */}
                      {component.id === "trans1" && tlv1Data 
                        ? tlv1Data.y_actual 
                        : component.id === "trans2" && tlv2Data 
                          ? tlv2Data.y_actual 
                          : component.position.y}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-operator-blue">
                      Z
                    </span>
                    <span className="text-base font-bold text-gray-700">
                      {/* Para los transelevadores, usamos los datos de MariaDB si están disponibles */}
                      {component.id === "trans1" && tlv1Data 
                        ? tlv1Data.z_actual 
                        : component.id === "trans2" && tlv2Data 
                          ? tlv2Data.z_actual 
                          : component.position.z}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {component.type === "transferidor" && (
                  <p>
                    Posición: Pasillo {component.position.x}
                  </p>
                )}
                {component.type === "puente" && (
                  <p>
                    Posición: Pasillo {component.position.y}
                  </p>
                )}
                {component.type === "elevador" && (
                  <p>
                    Posición: X{component.position.x}, Y{component.position.y}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SiloComponentInfoGroup;
