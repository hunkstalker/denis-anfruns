import React, { useEffect, useState } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

export default function App() {
  const [language, setLanguage] = React.useState('');

  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    const languageSegment = pathSegments[0];

    let URLLanguage;
    switch(languageSegment === '' ? 'en' : languageSegment) {
      case 'es-es':
        URLLanguage = 'Español';
        break;
      case 'ca-es':
        URLLanguage = 'Català';
        break;
      default:
        URLLanguage = 'English';
    }

    setLanguage(URLLanguage);
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered">
          {language}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Multiple selection example"
        variant="flat"
        closeOnSelect={true}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={language}
        onSelectionChange={setLanguage}
      >
        <DropdownItem key="Español">🇪🇸 &nbsp;Español</DropdownItem>
        <DropdownItem key="Català">Català</DropdownItem>
        <DropdownItem key="English">🇬🇧 &nbsp;English</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
