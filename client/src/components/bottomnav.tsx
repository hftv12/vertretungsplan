import { useState, useEffect } from "preact/hooks";
import { CalendarIcon, DocumentTextIcon, CheckBadgeIcon, ClockIcon, PencilIcon, CogIcon, InfoIcon, EventsIcon } from "./icons";

export default function BottomNav() {
	const [isLoggedIn, setIsLoggedIn] = useState(!!(typeof window !== "undefined" ? localStorage.getItem("user") : false));
	const [settings, setSettings] = useState<any>({
		showCourses: true,
		exams: "sorted",
		showCredits: true,
	});

	const [activeId, setActiveId] = useState<string>('vertretungsplan');
	const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const handleLogin = () => setIsLoggedIn(true);
		window.addEventListener('dsb-login', handleLogin);

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
		return () => {
			window.removeEventListener('dsb-settings-change', handleSettingsChange);
			window.removeEventListener('dsb-login', handleLogin);
		};
	}, []);

	const maxItems = windowWidth < 380 ? 4 : windowWidth < 600 ? 5 : Infinity;

	const widgetOrder = settings.widgetOrder || ['klausuren', 'kurswahl', 'stundenplan', 'termine', 'hausaufgaben'];
	
	const widgetIdToNavId: Record<string, string> = {
		'klausuren': 'klausuren',
		'kurswahl': 'course-selection',
		'stundenplan': 'stundenplan',
		'termine': 'termine',
		'hausaufgaben': 'hausaufgaben'
	};

	const navOrder = [
		'vertretungsplan',
		...widgetOrder.map((w: string) => widgetIdToNavId[w]).filter(Boolean),
		'einstellungen',
		'informationen'
	];

	const allMenuItems: Record<string, any> = {
		'vertretungsplan': { id: 'vertretungsplan', label: 'Vertretung', icon: CalendarIcon, show: settings.navVertretung !== false },
		'klausuren': { id: 'klausuren', label: 'Klausuren', icon: DocumentTextIcon, show: settings.exams !== "none" && settings.navKlausuren !== false },
		'course-selection': { id: 'course-selection', label: 'Kurswahl', icon: CheckBadgeIcon, show: settings.showCourses !== false && settings.navKurswahl !== false },
		'stundenplan': { id: 'stundenplan', label: 'Stundenplan', icon: ClockIcon, show: settings.showStundenplan !== false && settings.navStundenplan !== false },
		'termine': { id: 'termine', label: 'Termine', icon: EventsIcon, show: settings.showTermine !== false && settings.navTermine !== false },
		'hausaufgaben': { id: 'hausaufgaben', label: 'Aufgaben', icon: PencilIcon, show: settings.showHomework !== false && settings.navHausaufgaben !== false },
		'einstellungen': { id: 'einstellungen', label: 'Optionen', icon: CogIcon, show: settings.navEinstellungen === true },
		'informationen': { id: 'informationen', label: 'Info', icon: InfoIcon, show: settings.navInfo === true },
	};

	const menuItems = navOrder.map(id => allMenuItems[id]).filter(item => item.show).slice(0, maxItems);

	useEffect(() => {
		const handleScroll = () => {
			let currentActive = activeId;
			let minDistance = Infinity;

			for (const item of menuItems) {
				const el = document.getElementById(item.id);
				if (el) {
					const rect = el.getBoundingClientRect();
					const distance = Math.abs(rect.top - window.innerHeight / 3);
					
					if (distance < minDistance) {
						minDistance = distance;
						currentActive = item.id;
					}
				}
			}

			if (currentActive !== activeId) {
				setActiveId(currentActive);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		// Initial check
		setTimeout(handleScroll, 100);

		return () => window.removeEventListener('scroll', handleScroll);
	}, [menuItems, activeId]);

	const scrollTo = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -90; // offset for the sticky header
			const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({top: y, behavior: 'smooth'});
		}
		setActiveId(id);
	};

	if (!isLoggedIn || settings.showBottomNav === false) return null;

	return (
		<div class="bottom-nav-container">
			<div class="bottom-nav-fade"></div>
			<nav class="bottom-nav">
				{menuItems.map((item) => {
				const IconComponent = item.icon;
				const isActive = activeId === item.id;
				return (
					<button 
						key={item.id}
						class={`bottom-nav-item ${isActive ? 'active' : ''}`}
						onClick={() => scrollTo(item.id)}
					>
						<IconComponent class="bottom-nav-icon" />
						<span class="bottom-nav-label">{item.label}</span>
					</button>
				);
			})}
			</nav>
		</div>
	);
}
