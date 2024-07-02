"use client";

import ReactSelect from "react-select"

interface SelectProps {
  label: string;
  value: Record<string, any>;
  options: Record<string, any>[];
  onChange: (value: Record<string, any> | null) => void;
  disabled: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  disabled,
  options,
  onChange,
  value,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="block text-sm font-medium leading-6 text-gray-600">
        {label}
      </label>
    <ReactSelect
    isDisabled={disabled}
    value={value}
    onChange={onChange}
    isMulti
    options={options}
    menuPortalTarget={document.body}
    styles={{
        menuPortal : (base) => ({
            ...base,
            zIndex : 9999
        })
    }}
    />
    </div>
  );
};

export default Select;
