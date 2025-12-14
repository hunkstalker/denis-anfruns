export const languages = {
	es: 'Español',
	ca: 'Català',
	en: 'English',
}

export type Lang = keyof typeof languages

export const defaultLang = 'es'

export const ui = {
	es: {
		// NAVEGACIÓN
		'site.title': 'Denis Anfruns',
		'nav.home': 'INICIO',
		'nav.blog': 'BLOG',
		'nav.projects': 'PROYECTOS',
		'nav.about': 'SOBRE MÍ',
		'nav.videogames': 'VIDEOJUEGOS',
		'nav.devblog': 'dev blog',
		'nav.search': 'Buscar...',
		'nav.search.in': 'en',
		'nav.search.typeToSearch': 'Escribe para buscar en',
		'nav.search.filter.projects': 'Proyectos',
		'nav.noResults': 'No se han encontrado resultados',
		'nav.menu': 'Menú',
		'nav.search.label': 'Buscar',

		// BÚSQUEDA Y CUERPO
		'search.all': 'Todo',
		'search.project': 'PRO',
		'search.til': 'TIL',
		'search.devblog': 'DEV',
		'header.role': 'Desarrollador Full Stack',
		'header.years': 'años',
		'header.experience': 'de experiencia',
		'header.valueProp': 'Desarrollo de soluciones mantenibles y escalables',
		'footer.astro': 'Web impulsada por ',
		'footer.github': 'Código Fuente en GitHub',
		'footer.privacy': 'Política de Privacidad',

		// BLOG
		'blog.title': 'Bitácora Digital',
		'blog.description':
			'Un espacio donde documento mi aprendizaje. Desde artículos profundos hasta pequeños fragmentos de código (TILs).',
		'blog.series': 'DevLogs',
		'blog.recent': 'Más Recientes',
		'blog.devLogDescription': 'Artículos sobre el desarrollo de mis proyectos.',
		'blog.withoutArticles': 'No hay DevLogs todavía.',
		'blog.readArticle': 'Leer DevLog',
		'blog.viewAll': 'Ver todo',
		'blog.readNote': 'Leer nota',
		'blog.til': 'Notas TIL',
		'blog.withoutTILs': 'No hay notas TIL todavía.',
		'blog.tilDescription': 'Fragmentos de conocimiento.',
		'blog.backToBlog': 'Volver al Blog',
		'blog.backToTop': 'Volver arriba',
		'blog.nextPost': 'Siguiente',
		'blog.previousPost': 'Anterior',
		'blog.updated': 'Actualizado',
		'blog.tableOfContents': 'En esta página',
		'toc.title': 'Tabla de contenidos',
		'series.github.title': 'Código fuente',
		'series.github.description': 'Explora, aprende y contribuye.',
		'series.github.button': 'Ver en GitHub',

		// MISC
		'theme.toggle': 'Alternar tema',
		'theme.dark': 'Oscuro',
		'theme.light': 'Claro',
		'code.copy': 'Copiar código',
		'code.copied': '¡Copiado!',
		'language.changeTo': 'Cambiar idioma a',
		'home.latest.posts': 'Últimas publicaciones',
		'home.view.all': 'Ver todo',

		// SOBRE MÍ
		'about.title': 'Sobre mí',
		'about.intro.title': 'Hola, soy Denis Anfruns Millán',
		'about.intro.text': `Soy un desarrollador Full Stack al que le apasiona el rendimiento del software y 
      las buenas prácticas, **pero mi perfil ante todo es pragmático**. Entiendo el desarrollo como una solución a los problemas que surgen, 
      soluciones que deben ser adaptables a los rápidos cambios. Me muevo entre la **estabilidad e innovación** con React + Astro y 
      la eficacia de Power Platform (Power Apps - Power Automate - Power BI) y SharePoint, la suite Microsoft 365 presente en la mayoría de empresas.`,

		'about.intro.deal':
			'**Soluciones de alto rendimiento** client-side, sitios dinámicos de **gran experiencia para el usuario** o soportes con Web API Nativas que garantizan una **base sólida**.',
		'about.garden.title': 'El Jardín Digital',
		'about.garden.text':
			'Este lugar es un **"Jardín Digital"**. Aquí no solo publicaré proyectos terminados, sino que documento mis desarrollos o experimentos así como pequeñas notas que me sirvan día a día (TILs). Me encanta enseñar y compartir así que espero que este repositorio nos sea de ayuda a ambos. Creo firmemente en el **Código Libre** ❤️',
		'about.personal.title': 'Más allá del código',
		'about.personal.text': `Cuando no estoy programando, te costará encontrarme 🤣 
      disfruto desconectando con una buena serie, película o perdiéndome en algún videojuego. 
      **Soy fan de Star Trek, Stargate** y nunca me canso de los **videojuegos retro**, me llenan de nostalgia. 
      <br><br>
      Como detalle, **estudié Diseño Industrial** y tengo buena mano para el dibujo; no me considero un gran creativo, 
      pero paso tiempo ojeando obras de artistas independientes. Aprecio mucho el arte y el diseño, por lo que le 
      doy gran importancia a la **comunicación visual** y a **lo que transmite**.
      <br><br>
      Por último espero que disfrutes y aprendas del contenido de mi sitio y te hago saber que tienes algunos easter eggs repartidos, así que diviértete encontrándolos.`,
	},
	ca: {
		// NAVEGACIÓ
		'site.title': 'Denis Anfruns',
		'nav.home': 'INICI',
		'nav.blog': 'BLOG',
		'nav.projects': 'PROJECTES',
		'nav.about': 'SOBRE MI',
		'nav.videogames': 'videojocs',
		'nav.devblog': 'dev blog',
		'nav.search': 'Cercar...',
		'nav.search.in': 'a',
		'nav.search.typeToSearch': 'Escriu per cercar a',
		'nav.search.filter.projects': 'Projectes',
		'nav.noResults': "No s'han trobat resultats",
		'nav.menu': 'Menú',
		'nav.search.label': 'Cercar',

		// BÚSQUEDA
		'search.all': 'Tots',
		'search.project': 'PROJECTES',
		'search.til': 'TIL',
		'search.devblog': 'DEV',
		'header.role': 'Desenvolupador Full Stack',
		'header.years': 'anys',
		'header.experience': "d'experiència",
		'header.valueProp': 'Desenvolupament de solucions mantenibles i escalables',
		'footer.astro': 'Web impulsada per ',
		'footer.github': 'Codi Font en GitHub',
		'footer.privacy': 'Política de Privacitat',

		// BLOG
		'blog.title': 'Bitàcora Digital',
		'blog.description':
			'Un espai on documentar el meu aprenentatge. Des de articles profunds fins petits fragments de codi (TILs).',
		'blog.series': 'DevLogs',
		'blog.recent': 'Més Recents',
		'blog.devLogDescription': 'Articles sobre el desenvolupament dels meus projectes.',
		'blog.withoutArticles': 'Encara no hi ha DevLogs.',
		'blog.readArticle': 'Llegir DevLog',
		'blog.viewAll': 'Veure tot',
		'blog.readNote': 'Llegir nota',
		'blog.til': 'Notes TIL',
		'blog.withoutTILs': 'Encara no hi ha notes TIL.',
		'blog.tilDescription': 'Fragments de coneixement.',
		'blog.backToBlog': 'Tornar al Blog',
		'blog.backToTop': 'Tornar adalt',
		'blog.nextPost': 'Següent',
		'blog.previousPost': 'Anterior',
		'blog.updated': 'Actualitzat',
		'blog.tableOfContents': 'En aquesta pàgina',
		'toc.title': 'Taula de continguts',
		'series.github.title': 'Codi font',
		'series.github.description': 'Explora, aprèn i contribueix.',
		'series.github.button': 'Veure a GitHub',

		// MISC
		'theme.toggle': 'Alternar tema',
		'theme.dark': 'Fosc',
		'theme.light': 'Clar',
		'code.copy': 'Copiar codi',
		'code.copied': 'Copiat!',
		'language.changeTo': 'Canviar idioma a',
		'home.latest.posts': 'Últimes publicacions',
		'home.view.all': 'Veure tot',

		// SOBRE MI
		'about.title': 'Sobre mi',
		'about.intro.title': 'Hola, sóc el Denis Anfruns Millán',
		'about.intro.text':
			"Sóc un desenvolupador Full Stack al qual li apassiona el rendiment del software i les bones pràctiques, **però el meu perfil abans de tot és pragmàtic**. Entenc el desenvolupament com una solució als problemes que sorgeixen, solucions que han de ser adaptables als ràpids canvis. Em moc entre l'**estabilitat i innovació** amb React + Astro i l'eficàcia de Power Platform (Power Apps - Power Automate - Power BI) i SharePoint, la suite Microsoft 365 present a la majoria d'empreses.",
		'about.intro.deal':
			"**Solucions d'alt rendiment** client-side, llocs dinàmics de **gran experiència per a l'usuari** o suports amb Web API Natives que garanteixen una **base sòlida**.",
		'about.garden.title': 'El Jardí Digital',
		'about.garden.text':
			'Aquest lloc és un **"Jardí Digital"**. Aquí no només publicaré projectes acabats, sinó que documento els meus desenvolupaments o experiments així com petites notes que em serveixen dia a dia (TILs). M\'encanta ensenyar i compartir, així que espero que aquest repositori ens sigui d\'ajuda a tots dos. Crec fermament en el **Codi Lliure** ❤️',
		'about.personal.title': 'Més enllà del codi',
		'about.personal.text': `Quan no estic programant, et costarà trobar-me 🤣 
      gaudeixo desconnectant amb una bona sèrie, pel·lícula o perdent-me en algun videojoc. 
      **Soc fan de Star Trek, Stargate** i mai em canso dels **videojocs retro**, m'omplen de nostàlgia. 
      <br><br>
      Com a detall, **vaig estudiar Disseny Industrial** i tinc bona mà per al dibuix; no em considero un gran creatiu, 
      però passo temps mirant obres d'artistes independents. Aprecio molt l'art i el disseny, per la qual cosa li 
      dono gran importància a la **comunicació visual** i al **que transmet**.
      <br><br>
      Per últim espero que gaudeixis i aprenguis del contingut del meu lloc i et faig saber que tens alguns easter eggs repartits, així que diverteix-te trobant-los.`,
	},
	en: {
		// NAVEGACIÓ
		'site.title': 'Denis Anfruns',
		'nav.home': 'HOME',
		'nav.blog': 'BLOG',
		'nav.projects': 'PROJECTS',
		'nav.about': 'ABOUT',
		'nav.videogames': 'VIDEO GAMES',
		'nav.devblog': 'DEV LOG',
		'nav.search': 'Search...',
		'nav.search.in': 'in',
		'nav.search.typeToSearch': 'Type to search in',
		'nav.search.filter.projects': 'Projects',
		'nav.noResults': 'No results found',
		'nav.menu': 'Menu',
		'nav.search.label': 'Search',

		// SEARCH & BODY
		'search.all': 'All',
		'search.project': 'PRO',
		'search.til': 'TIL',
		'search.devblog': 'DEV',
		'header.role': 'Full Stack Developer',
		'header.years': 'years',
		'header.experience': 'of experience',
		'header.valueProp': 'Developing maintainable and scalable solutions',
		'footer.astro': 'Powered by ',
		'footer.github': 'Source Code on GitHub',
		'footer.privacy': 'Privacy Policy',

		// BLOG
		'blog.title': 'Digital Log',
		'blog.description':
			'A space where I document my learning. From deep articles to small code snippets (TILs).',
		'blog.series': 'DevLogs',
		'blog.recent': 'Most Recent',
		'blog.devLogDescription': 'Articles about the development of my projects.',
		'blog.withoutArticles': 'No DevLogs yet.',
		'blog.readArticle': 'Read DevLog',
		'blog.viewAll': 'View all',
		'blog.readNote': 'Read note',
		'blog.til': 'TIL Notes',
		'blog.withoutTILs': 'No TIL notes yet.',
		'blog.tilDescription': 'Snippets of knowledge.',
		'blog.backToBlog': 'Back to Blog',
		'blog.backToTop': 'Back to Top',
		'blog.nextPost': 'Next',
		'blog.previousPost': 'Previous',
		'blog.updated': 'Updated',
		'blog.tableOfContents': 'On this page',
		'toc.title': 'Table of Contents',
		'series.github.title': 'Source code',
		'series.github.description': 'Explore, learn and contribute.',
		'series.github.button': 'View on GitHub',

		// MISC
		'theme.toggle': 'Toggle theme',
		'theme.dark': 'Dark',
		'theme.light': 'Light',
		'code.copy': 'Copy code',
		'code.copied': 'Copied!',
		'language.changeTo': 'Change language to',

		'home.welcome': 'Welcome to my Portfolio',
		'home.description':
			'I am a Full Stack developer passionate about technology and continuous learning.',
		'home.latest.posts': 'Latest Posts',
		'home.view.all': 'View all posts',
		// ABOUT ME
		'about.title': 'About Me',
		'about.intro.title': "Hi, I'm Denis Anfruns Millán",
		'about.intro.text':
			'I am a Full Stack developer passionate about software performance and best practices, **but my profile is above all pragmatic**. I understand development as a solution to problems that arise, solutions that must be adaptable to rapid changes. I move between **stability and innovation** with React + Astro and the effectiveness of Power Platform (Power Apps - Power Automate - Power BI) and SharePoint, the Microsoft 365 suite present in most companies.',
		'about.intro.deal':
			'**High-performance** client-side solutions, dynamic sites with **great user experience**, or supports with Native Web APIs that guarantee a **solid foundation**.',
		'about.garden.title': 'The Digital Garden',
		'about.garden.text':
			'This place is a **"Digital Garden"**. Here I will not only publish finished projects, but I verify my developments or experiments as well as small notes that serve me day to day (TILs). I love teaching and sharing so I hope this repository helps both of us. I firmly believe in **Open Source** ❤️',
		'about.personal.title': 'Beyond the Code',
		'about.personal.text': `When I'm not coding, you'll have a hard time finding me 🤣 
      I enjoy disconnecting with a good series, movie, or getting lost in a video game. 
      **I'm a fan of Star Trek, Stargate** and I never get tired of **retro video games**, they fill me with nostalgia. 
      <br><br>
      As a detail, **I studied Industrial Design** and I'm pretty good at drawing; I don't consider myself a great creative, 
      but I spend time browsing works by independent artists. I greatly appreciate art and design, which is why I place 
      great importance on **visual communication** and **what it conveys**.
      <br><br>
      Finally, I hope you enjoy and learn from my site's content and I let you know that there are some easter eggs scattered around, so have fun finding them!`,
	},
} as const
