import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { ExtraContent } from "./Extracontent";

export type DesignProps = {
  design:string,
  setDesign:(value:string)=>void
}
export const SwitchDemo = (props:DesignProps) => {
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const {design, setDesign} = props
  const handleSwitchChange = () => {
    setIsSwitchChecked(!isSwitchChecked);
  };

  return (
    <div className="w-full">
      <label className="flex items-center space-x-2">
        <Switch
          checked={isSwitchChecked}
          onCheckedChange={handleSwitchChange}
        />
        <span className="text-xs font-bold text-black dark:text-white ">
          Загвар хадгалах
        </span>
      </label>

      {isSwitchChecked && <ExtraContent design={design} setDesign={setDesign}/>}
    </div>
  );
}
