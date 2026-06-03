import { useState, useEffect } from "preact/hooks";
import { CalendarIcon, DocumentTextIcon, CheckBadgeIcon, ClockIcon, CogIcon, InfoIcon } from "./icons";

export default function BottomNav() {
	const [settings, setSettings] = useState<any>({
		showCourses: true,
		exams: "sorted",
		showCredits: true,
	});

	const [activeId, setActiveId] = useState<string>('vertretungsplan');

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

	const menuItems = [
		{ id: 'vertretungsplan', label: 'Vertretung', icon: CalendarIcon, show: true },
		{ id: 'klausuren', label: 'Klausuren', icon: DocumentTextIcon, show: settings.exams !== "none" },
		{ id: 'course-selection', label: 'Kurswahl', icon: CheckBadgeIcon, show: settings.showCourses !== false },
		{ id: 'stundenplan', label: 'Stundenplan', icon: ClockIcon, show: true },
		{ id: 'einstellungen', label: 'Optionen', icon: CogIcon, show: true },
		{ id: 'informationen', label: 'Info', icon: InfoIcon, show: settings.showCredits !== false },
	].filter(item => item.show);

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

	return (
		<nav class="bottom-nav">
			<div class="bottom-nav-fade"></div>
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
	);
}
