import React from 'react';

// --- Assets ---
import AstroLogo from '../../icons/tech/astro-logo.svg?react';
import GitIcon from '../../icons/tech/git.svg?react';
import JsIcon from '../../icons/tech/javascript.svg?react';
import ReactIcon from '../../icons/tech/react.svg?react';
import TSIcon from '../../icons/tech/typescript.svg?react';
import ViteIcon from '../../icons/tech/vite.svg?react';
import M365Icon from '../../icons/tech/m-365.svg?react';
import PowerAppsIcon from '../../icons/tech/power-apps.svg?react';
import PowerAutomateIcon from '../../icons/tech/power-automate.svg?react';
import PowerBiIcon from '../../icons/tech/power-bi.svg?react';
import PowerPlatformIcon from '../../icons/tech/power-platform.svg?react';
import SharePointIcon from '../../icons/tech/sharepoint.svg?react';
import HtmlIcon from '../../icons/tech/html.svg?react';
import CssIcon from '../../icons/tech/css.svg?react';
import PowerFxIcon from '../../icons/tech/power-fx.svg?react';
import BackendIcon from '../../icons/tech/backend.svg?react';
import WebApiIcon from '../../icons/tech/webapi.svg?react';
import CFWorkersIcon from '../../icons/tech/cfworkers.svg?react';
import D1Icon from '../../icons/tech/d1.svg?react';
import KVIcon from '../../icons/tech/kv.svg?react';

// --- Icons Map ---
export const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
	'astro': AstroLogo,
	'git': GitIcon,
	'javascript': JsIcon,
	'js': JsIcon,
	'react': ReactIcon,
	'typescript': TSIcon,
	'ts': TSIcon,
	'vite': ViteIcon,
	'm365': M365Icon,
	'm-365': M365Icon,
	'power-apps': PowerAppsIcon,
	'powerapps': PowerAppsIcon,
	'power-automate': PowerAutomateIcon,
	'powerautomate': PowerAutomateIcon,
	'power-bi': PowerBiIcon,
	'powerbi': PowerBiIcon,
	'power-platform': PowerPlatformIcon,
	'powerplatform': PowerPlatformIcon,
	'power-fx': PowerFxIcon,
	'powerfx': PowerFxIcon,
	'backend': BackendIcon,
	'webapi': WebApiIcon,
	'api': WebApiIcon,
	'cfworkers': CFWorkersIcon,
	'workers': CFWorkersIcon,
	'd1': D1Icon,
	'kv': KVIcon,
	'sharepoint': SharePointIcon,
	'sp': SharePointIcon,
	'html': HtmlIcon,
	'css': CssIcon,

	'architecture': AstroLogo, // Fallback for architecture? Or maybe generic
};

// Pre-calculate unique icons for picker
export const UNIQUE_ICONS = (() => {
	const map = new Map<React.FC<any>, string>();
	Object.entries(ICON_MAP).forEach(([key, Comp]) => {
		if (!map.has(Comp)) {
			map.set(Comp, key);
		} else {
			const existingKey = map.get(Comp)!;
			if (key.length > existingKey.length) {
				map.set(Comp, key);
			}
		}
	});
	return Array.from(map.values()).sort();
})();

export function TechIcon({ name, className }: { name: string, className?: string }) {
	if (!name) return null;
	const key = name.toLowerCase();
	const ValidIcon = ICON_MAP[key];

	// Safety check if user has tags like "architecture" but we only want to show if mapped.
	// If not mapped, return null (empty space is better than broken icon).
	if (!ValidIcon) return null;

	return <ValidIcon className={className} />;
}
