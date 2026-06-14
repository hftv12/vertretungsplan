import { useState, useEffect, useRef } from "preact/hooks";
import confetti from "canvas-confetti";

export default function Header(props: {
	homepage: string,
	logo?: any,
	width: string,
	height: string,
	pixel: boolean,
	text: string,
	children?: any,
	version: string
}) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [settings, setSettings] = useState<any>({
		showCourses: true,
		exams: "sorted",
		showCredits: true,
	});

	const [versionClicks, setVersionClicks] = useState(0);
	const clickTimeout = useRef<any>(null);

	const handleVersionClick = () => {
		setVersionClicks((prev) => prev + 1);
		if (clickTimeout.current) clearTimeout(clickTimeout.current);
		clickTimeout.current = setTimeout(() => {
			setVersionClicks(0);
		}, 1000);
	};

	useEffect(() => {
		if (versionClicks >= 5) {
			setVersionClicks(0);
			confetti({
				particleCount: 150,
				spread: 100,
				origin: { y: 0.6 }
			});
			window.dispatchEvent(new CustomEvent('easter-egg-start'));
		}
	}, [versionClicks]);

	useEffect(() => {
		const loadSettings = () => {
			const s = localStorage.getItem("DSBSettings");
			if (s) {
				try {
					setSettings(JSON.parse(s));
				} catch(e) {}
			}
		};
		
		loadSettings();
		
		const handleSettingsChange = (e: any) => {
			if (e.detail) {
				setSettings({...e.detail});
			}
		};
		window.addEventListener('dsb-settings-change', handleSettingsChange);
		return () => window.removeEventListener('dsb-settings-change', handleSettingsChange);
	}, []);

	const scrollTo = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -90; // offset for the sticky header
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({top: y, behavior: 'smooth'});
		}
		setMenuOpen(false);
	};

	const menuItems = [
		{ id: 'vertretungsplan', label: 'Vertretungsplan', show: settings.navVertretung !== false },
		{ id: 'klausuren', label: 'Klausuren', show: settings.exams !== "none" && settings.navKlausuren !== false },
		{ id: 'course-selection', label: 'Kurswahl', show: settings.showCourses !== false && settings.navKurswahl !== false },
		{ id: 'stundenplan', label: 'Stundenplan', show: settings.navStundenplan !== false },
		{ id: 'termine', label: 'Termine', show: settings.showTermine !== false && settings.navTermine !== false },
		{ id: 'hausaufgaben', label: 'Hausaufgaben', show: settings.showHomework !== false && settings.navHausaufgaben !== false },
		{ id: 'einstellungen', label: 'Einstellungen', show: settings.navEinstellungen === true },
		{ id: 'informationen', label: 'Informationen', show: settings.navInfo === true },
	].filter(item => item.show);

	return (
		<header>
			<div class="header-left">
				<div class="header-brand">
					<a href={props.homepage} class="header-title-link">
						<h1 class="header-title">{props.text}</h1>
					</a>
					{props.children}
				</div>
			</div>
			<div class="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
				<span class="header-version code" onClick={handleVersionClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
					{props.version}
				</span>

				<div class="desktop-only-menu" style={{ position: 'relative', display: settings.showBottomNav === false ? 'block' : 'none' }}>
					<button class="imgInput" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü öffnen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: 'var(--rounding-sm)', border: '1px solid var(--brighter-color)', background: 'var(--input-bg)', cursor: 'pointer', transition: 'var(--transition-fast)', color: 'var(--text-color)' }}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					</button>
					
					{menuOpen && (
						<div class="burger-menu-dropdown">
							{menuItems.map((item, idx) => (
								<button 
									key={item.id}
									class="burger-menu-item"
									onClick={() => scrollTo(item.id)}
									style={{ 
										animationDelay: `${0.05 + idx * 0.05}s`,
										borderBottom: idx < menuItems.length - 1 ? '1px solid var(--brighter-color)' : 'none'
									}}
								>
									{item.label}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}