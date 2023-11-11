import React, { useEffect, useState } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

export default function App() {
  const [language, setLanguage] = React.useState('');

  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    const languageSegment = pathSegments[0];

    let URLLanguage;
    switch (languageSegment) {
      case 'es-es':
        URLLanguage = 'Español';
        break;
      case 'ca-es':
        URLLanguage = 'Català';
        break;
      default:
        URLLanguage = 'English';
        break;
    }

    setLanguage(URLLanguage);
  }, []);


  function handleLanguageSelection(keys) {
    const key = Array.from(keys)[0];
    let newPath;
    switch (key) {
      case 'Español':
        newPath = '/es-es';
        break;
      case 'Català':
        newPath = '/ca-es';
        break;
      default:
        newPath = '/en';
        break;
    }
    window.location.assign(newPath); 
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered">
          {language}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Language dropdown button selector"
        variant="flat"
        closeOnSelect={true}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={language}
        onSelectionChange={handleLanguageSelection}
      >
        <DropdownItem key="Español">🇪🇸 &nbsp;Español</DropdownItem>
        <DropdownItem key="Català">Català</DropdownItem>
        <DropdownItem key="English">🇬🇧 &nbsp;English</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
