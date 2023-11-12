import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import FlagES from './FlagES.jsx';
import FlagCA from './FlagCA.jsx';
import FlagUK from './FlagUK.jsx';

export default function LanguageDropdown() {
	const [language, setLanguage] = useState('')
	const [Flag, setFlag] = useState(null);

	useEffect(() => {
		const path = window.location.pathname
		const pathSegments = path.split('/').filter(Boolean)
		const languageSegment = pathSegments[0]

		let URLLanguage
		switch (languageSegment) {
			case 'es-es':
				setFlag(<FlagES />);
				URLLanguage = 'Español';
				break
			case 'ca-es':
				setFlag(<FlagCA />);
				URLLanguage = 'Català';
				break
			default:
				setFlag(<FlagUK />);
				URLLanguage = 'English';
				break
		}

		setLanguage(URLLanguage)
	}, [])

	function handleLanguageSelection(keys) {
		const key = Array.from(keys)[0]
		let newPath
		switch (key) {
			case 'Español':
				newPath = '/es-es'
				break
			case 'Català':
				newPath = '/ca-es'
				break
			default:
				newPath = '/en'
				break
		}
		window.location.assign(newPath)
	}

	return (
		<Dropdown
			classNames={{
				content: "bg-default-100",
			}}>
			<DropdownTrigger>
				<Button variant='bordered'>{Flag} {language}</Button> 
			</DropdownTrigger>
			<DropdownMenu
			  itemClasses={{
          base: [
            "white",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-300",
            "dark:data-[hover=true]:bg-default-300",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
				aria-label='Language dropdown button selector'
				variant='flat'
				closeOnSelect={true}
				disallowEmptySelection
				selectionMode='single'
				selectedKeys={language}
				onSelectionChange={handleLanguageSelection}>
				<DropdownItem key='Español'>
					<FlagES /> &nbsp;Español
				</DropdownItem>
				<DropdownItem key='Català'>
					<FlagCA />	&nbsp;Català
				</DropdownItem>
				<DropdownItem key='English'>
					<FlagUK /> &nbsp;English
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}
