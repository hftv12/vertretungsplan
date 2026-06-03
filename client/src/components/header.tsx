import { useState, useEffect } from "preact/hooks";

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
				setSettings(e.detail);
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
				<span class="header-version code">
					{props.version}
				</span>

				<div style={{ position: 'relative' }}>
					<button class="imgInput" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü öffnen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: 'var(--rounding-sm)', border: '1px solid var(--brighter-color)', background: 'var(--input-bg)', cursor: 'pointer', transition: 'var(--transition-fast)', color: 'var(--text-color)' }}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					</button>
					
					{menuOpen && (
						<div class="burger-menu-dropdown">
							<button onClick={() => scrollTo('vertretungsplan')} style={{ padding: '14px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid var(--brighter-color)', fontWeight: 500, color: 'var(--text-color)', fontSize: '0.95rem' }}>Vertretungsplan</button>
							
							{settings.exams !== "none" && (
								<button onClick={() => scrollTo('klausuren')} style={{ padding: '14px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid var(--brighter-color)', fontWeight: 500, color: 'var(--text-color)', fontSize: '0.95rem' }}>Klausuren</button>
							)}
							
							{settings.showCourses !== false && (
								<button onClick={() => scrollTo('course-selection')} style={{ padding: '14px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid var(--brighter-color)', fontWeight: 500, color: 'var(--text-color)', fontSize: '0.95rem' }}>Kurswahl</button>
							)}
							
							<button onClick={() => scrollTo('stundenplan')} style={{ padding: '14px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid var(--brighter-color)', fontWeight: 500, color: 'var(--text-color)', fontSize: '0.95rem' }}>Stundenplan</button>
							<button onClick={() => scrollTo('einstellungen')} style={{ padding: '14px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', borderBottom: settings.showCredits !== false ? '1px solid var(--brighter-color)' : 'none', fontWeight: 500, color: 'var(--text-color)', fontSize: '0.95rem' }}>Einstellungen</button>
							
							{settings.showCredits !== false && (
								<button onClick={() => scrollTo('informationen')} style={{ padding: '14px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 500, color: 'var(--text-color)', fontSize: '0.95rem' }}>Informationen</button>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}