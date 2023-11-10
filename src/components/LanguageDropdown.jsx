import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

export default function App() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["language"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const containerStyle = {
    display: 'flex',
    alignItems: 'center', // Centra verticalmente
    justifyContent: 'center', // Centra horizontalmente
    height: '100vh', // Altura del viewport para que el centro sea realmente el centro de la pantalla
  };

  return (
    <Dropdown style={containerStyle}>
      <DropdownTrigger>
        <Button 
          variant="bordered"
          >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Single selection example"
        variant="bordered"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <DropdownItem key="text">Español</DropdownItem>
        <DropdownItem key="text">Català</DropdownItem>
        <DropdownItem key="text">English</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}