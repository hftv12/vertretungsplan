export default function Header(props: {
	homepage: string,
	logo?: ImageMetadata | string,
	width: string,
	height: string,
	pixel: boolean,
	text: string,
	children?: any,
	version: string
}) {
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
			<div class="header-right">
				<span class="header-version code">
					{props.version}
				</span>
			</div>
		</header>
	);
}