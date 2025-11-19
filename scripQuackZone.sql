create database quackzone;

use quackzone;

select * from usuario;

-- JUEGOS POPULARES
INSERT INTO juego (
	categoria, descripcion, fecha_lanzamiento, 
    imagen_url, plataforma, portada_url,
    precio, requisitos, seccion, titulo
) 
values 
('Shooter', 
'Call of Duty: Black Ops 6 es un thriller de acción y espionaje ambientado a principios de los años 90, donde una fuerza clandestina se ha infiltrado en los niveles más altos del gobierno de EE. UU., obligando a los jugadores a volverse renegados.',
'2024-10-25', 
'https://i.pinimg.com/736x/83/58/9d/83589d8de990e45c165d25d5cd676bb5.jpg',
'PS5',
'/portadas/cod6.jpeg',
383.10, 
null, 
'populares', 
'Call of Duty: Black Ops 6'
), 
('Shooter',
'Call of Duty: Modern Warfare III es la secuela directa donde el Capitán Price y la Fuerza Operativa 141 se enfrentan al criminal de guerra ultranacionalista Vladimir Makarov, que extiende su amenaza global.',
'2022-10-28',
'https://i.pinimg.com/736x/b2/48/a4/b248a47671cc9b3d3f7c1fdd23a0a8a5.jpg', 
'PS5',
'https://i0.wp.com/imgs.hipertextual.com/wp-content/uploads/2023/08/call-of-duty-modern-warfare-3-2.jpeg?fit=1920%2C1147&quality=50&strip=all&ssl=1',
170.20, 
null,
'populares', 
'Call of Duty: Modern Warfare III'
), 
('Accion',
'Days Gone es una aventura de acción y supervivencia en mundo abierto post-apocalíptico, ambientada dos años después de una pandemia que transformó a millones de personas en violentos "Fríkers". El jugador encarna a Deacon St. John, un motero vagabundo y cazarrecompensas que se aferra a la esperanza de que su esposa, a la que creía muerta, siga viva.',
'2019-04-26',
'https://preview.redd.it/days-gone-%C3%B6neri-mod-listesi-v0-vhu4salf0q6a1.png?width=549&format=png&auto=webp&s=bfcd69c4954c5fc2f05b114b456c67be927cb63a', 
'PS5',
'https://images.gog-statics.com/f9d977cb0734a95b4936c0d3a3fa8e3e0133d60cf4bb9227d4f4b9e5b0679ad0.jpg',
140.50, 
null, 
'populares',
'Days Gone'
), 
('Shooter',
'Tom Clancy''s Ghost Recon Wildlands es un shooter táctico de mundo abierto ambientado en una Bolivia ficticia, donde el poderoso y sanguinario cártel de drogas Santa Blanca ha establecido un narco-estado.',
'2017-02-02',
'https://i.pinimg.com/736x/54/39/c8/5439c8c20368017e14aabb133d9abe2d.jpg', 
'PS5',
'https://wallpapers.com/images/hd/best-ghost-recon-wildlands-background-1920-x-1080-4mqmhxzbbulxmhjd.jpg',
170.70, 
null, 
'populares',
'Tom Clancy\'s: Ghost Recon Wildlands'
);


-- JUEGOS MAS VENDIDOS
INSERT INTO juego (
	categoria, descripcion, fecha_lanzamiento, 
    imagen_url, plataforma, portada_url,
    precio, requisitos, seccion, titulo
) 
values 
('Accion', 
'El juego se ambienta durante la primera invasión mongola a Japón en 1274, donde el samurái Jin Sakai sobrevive a la masacre inicial para convertirse en la última esperanza de la isla de Tsushima. Al darse cuenta de que el honorable código samurái es inútil contra el despiadado ejército del Khan, Jin debe abandonar sus tradiciones y adoptar tácticas de sigilo y engaño.',
'2020-07-17',
'https://i.pinimg.com/736x/aa/65/be/aa65be39f98195b92ee2239b97c9866e.jpg',
'PS5',
'https://i.pinimg.com/736x/30/ac/48/30ac487bc98bb07fbb4abb4feca4a8d4.jpg', 
199.00, 
null, 
'mas-vendidos',
'Ghost of Tsushima'
),
('Accion', 
'The Last of Us Part II es un relato crudo y violento sobre las devastadoras consecuencias de la venganza, ambientado cinco años después del primer juego. Tras un evento traumático en la pacífica comunidad de Jackson, Ellie emprende una implacable y oscura búsqueda.',
'2020-06-19',
'https://i.pinimg.com/736x/2e/13/75/2e13755a6b3fec2ee9dbcc231a1cf39c.jpg',
'PS5',
'https://i.pinimg.com/736x/6d/49/67/6d4967f7c66011f46dc88cad2ef17770.jpg',
159.50,
null, 
'mas-vendidos',
'The Last Of Us: Parte II'
),
('Accion',
'God of War Ragnarök concluye la épica saga nórdica, ambientada en el temido Fimbulwinter, donde Kratos y su hijo Atreus son perseguidos por los dioses de Asgard, especialmente por Odín y Thor, a raíz de sus acciones pasadas.',
'2022-11-09',
'https://i.pinimg.com/736x/dc/ad/bf/dcadbf12865e4df00d89d2e84e3344dd.jpg',
'PS5',
'https://i.pinimg.com/736x/ce/8b/83/ce8b8349a2b94a043c2e3e2a1f2e32e4.jpg', 
199.00, 
null,
'mas-vendidos',
'God of War Ragnarok'
),
(
'Accion', 
'Ghost of Yōtei se desarrolla 300 años después de Ghost of Tsushima en la montañosa región de Ezo (actual Hokkaido) en el año 1603, y está protagonizado por Atsu, una renegada de origen ainu.',
'2025-10-02',
'https://i.pinimg.com/736x/36/58/30/365830c5ddb1898c3a24a0f549b51489.jpg', 
'PS5',
'https://i.pinimg.com/736x/30/49/ba/3049ba5b5f43324ec0ae4e8cf19f10e9.jpg',
349.00,
NULL,
'mas-vendidos',
'Ghost of Yotei'
);

-- JUEGOS MAS VENDIDOS
INSERT INTO juego (
	categoria, descripcion, fecha_lanzamiento, 
    imagen_url, plataforma, portada_url,
    precio, requisitos, seccion, titulo
) 
values
('Shooter',
'La historia arranca cuando la Task Force 141, liderada por el Capitán Price, se une a la Unidad de Fuerzas Especiales Mexicanas para rastrear al líder terrorista iraní Hassan Zyani, quien ha obtenido misiles balísticos estadounidenses robados.',
'2022-10-28',
'https://i.pinimg.com/736x/aa/11/18/aa11186dc69287ff7192992845d8585b.jpg',
'PS5',
'https://i.pinimg.com/736x/fd/80/f9/fd80f9b0bc7628319ac46c4eb0e420e4.jpg', 
165.50,
null, 
'mas-vendidos',
'Call of Duty: Modern Warfare II'
),
('Shooter',
'La historia se centra en el Capitán John Price y el Sargento Kyle Gaz Garrick de la SAS, quienes se asocian con la agente de la CIA Kate Laswell y el guerrillero de Urzikstán Alex para recuperar un cargamento de gas cloro robado por la organización terrorista Al-Qatala.',
'2019-10-25',
'https://i.pinimg.com/736x/79/1a/ca/791acac7db9356025432759c7156e949.jpg',
'PS5',
'/portadas/codMW1.jpg', 
120.00,
null, 
'mas-vendidos',
'Call of Duty: Modern Warfare'
),
('Shooter',
'En lugar de una narrativa lineal, el juego presenta una serie de "Misiones de Especialista" diseñadas para profundizar en las historias de origen de los diez personajes jugables del multijugador, como Ruin, Battery y Crash.',
'2018-10-12',
'caratulas/codBO4.jpg',
'PS5',
'/portadas/codBO4.jpg', 
150.00,
null, 
'mas-vendidos',
'Call of Duty: Black Ops 4'
),
('Shooter',
'Ambientado en el año 2035, la trama sigue a David Mason, hijo del legendario Alex Mason, mientras una nueva y devastadora crisis global resurge, forzándolo a liderar un equipo de élite para enfrentarla.',
'2025-11-14',
'https://i.pinimg.com/1200x/35/76/21/3576211e006b49e13f7e158c3f730252.jpg',
'PS5',
'https://i.pinimg.com/1200x/33/21/59/3321591d39e21d40482a7682ce2bb53d.jpg', 
330.00,
null, 
'mas-vendidos',
'Call of Duty: Black Ops 7'
);

-- JUEGOS MAS VENDIDOS
INSERT INTO juego (
	categoria, descripcion, fecha_lanzamiento, 
    imagen_url, plataforma, portada_url,
    precio, requisitos, seccion, titulo
) 
values
('Supervivencia',
'Minecraft es un videojuego de mundo abierto y creación libre donde la jugabilidad gira en torno a colocar y romper bloques en un entorno tridimensional que es, en esencia, infinito.',
'2009-05-12',
'https://i.pinimg.com/736x/5f/f0/e9/5ff0e997a4a8ba449056ed679660f4cc.jpg',
'PS5',
'/portadas/minecraft.jpg', 
80.00,
null, 
'mas-vendidos',
'Minecraft'
),
(
'Supervivencia',
'World War Z es un juego cooperativo de disparos en tercera persona basado en el apocalipsis zombi, donde los jugadores luchan contra hordas masivas de enemigos mientras atraviesan distintas ciudades del mundo.',
'2019-04-16',
'https://i.pinimg.com/1200x/ee/9d/89/ee9d89836f9d8d5379c168af43a53190.jpg',
'PS5',
'/portadas/wordwarz.jpg',
120.00,
NULL,
'mas-vendidos',
'World War Z'
),
(
'Supervivencia',
'Back 4 Blood es un juego cooperativo de disparos en primera persona desarrollado por los creadores de Left 4 Dead, donde los jugadores luchan contra hordas de infectados en un mundo postapocalíptico.',
'2021-10-12',
'https://i.pinimg.com/1200x/29/b9/bf/29b9bff7474232845f6647ee570959ae.jpg',
'PS5',
'https://i.pinimg.com/1200x/25/ba/f6/25baf65f92260e516a7af5450b554120.jpg',
130.30,
NULL,
'mas-vendidos',
'Back 4 Blood'
),
(
'Supervivencia',
'Stardew Valley es un juego de simulación de granja donde los jugadores pueden cultivar cultivos, criar animales, explorar minas, interactuar con los habitantes del pueblo y participar en festivales locales.',
'2016-02-26',
'https://i.pinimg.com/736x/3a/61/fb/3a61fb6ae03ae92dcaebd19f1f79b0bc.jpg',
'PS5',
'https://i.pinimg.com/1200x/1c/62/a6/1c62a6406fab268b346c12a8931d9e61.jpg',
45.50,
NULL,
'mas-vendidos',
'Stardew Valley'
);

-- JUEGOS MAS VENDIDOS
INSERT INTO juego (
	categoria, descripcion, fecha_lanzamiento, 
    imagen_url, plataforma, portada_url,
    precio, requisitos, seccion, titulo
) 
values
('Terror',
'Resident Evil 2 es un juego de survival horror donde los jugadores controlan a Leon S. Kennedy y Claire Redfield mientras intentan escapar de Raccoon City infestada de zombis y descubrir la conspiración de la corporación Umbrella.',
'2019-01-25',
'https://i.pinimg.com/1200x/36/5f/04/365f04db8785a443a6804a3b997885c3.jpg',
'PS5',
'https://i.pinimg.com/1200x/2e/48/f8/2e48f86bfbcd0628d5ad23e664c1367b.jpg',
120.00,
NULL,
'mas-vendidos',
'Resident Evil 2'
),
(
'Terror',
'Resident Evil 4 es un juego de survival horror y acción donde el jugador controla a Leon S. Kennedy en su misión de rescatar a la hija del presidente de Estados Unidos mientras enfrenta cultos peligrosos y enemigos infectados.',
'2023-03-24',
'https://i.pinimg.com/1200x/2d/d7/bb/2dd7bb0533e2b9c363160a38d9527039.jpg', 
'PS5',
'/portadas/residentEvil4.jpeg',
100.00,
NULL,
'mas-vendidos',
'Resident Evil 4'
),
(
'Terror',
'The Texas Chain Saw Massacre es un juego de terror y supervivencia inspirado en la famosa franquicia cinematográfica, donde los jugadores deben escapar de un asesino en serie en entornos oscuros y aterradores.',
'2023-09-15',
'https://i.pinimg.com/736x/47/7d/a0/477da0db2be0fe4c24600b94400246ba.jpg', 
'PS5',
'/portadas/masacreTexas.jpg',
99.99,
NULL,
'mas-vendidos',
'The Texas Chain Saw Massacre'
),
 (
'Terror',
'Dead by Daylight es un juego multijugador asimétrico de terror en el que un jugador toma el rol de un asesino despiadado mientras los demás intentan escapar de sus garras usando estrategia y sigilo.',
'2016-06-14',
'https://i.pinimg.com/736x/c5/c5/2f/c5c52ffe2c827c477fa143bb69cf2a05.jpg',
'PS5',
'https://i.pinimg.com/1200x/a7/78/3b/a7783bde27a4771fee383cd45d3adf3a.jpg',
60.00,
NULL,
'mas-vendidos',
'Dead by Daylight'
);

-- MAS VENDIDOS
INSERT INTO juego (
    categoria, descripcion, fecha_lanzamiento,
    imagen_url, plataforma, portada_url,
    precio, requisitos, seccion, titulo
)
VALUES (
'Mundo Abierto',
'Red Dead Redemption 2 es un juego de acción y aventura en mundo abierto ambientado en el viejo oeste estadounidense, donde los jugadores siguen la historia de Arthur Morgan y la banda Van der Linde.',
'2018-10-26',
'https://i.pinimg.com/736x/d2/a4/5c/d2a45cc2083abc8bf1c21e47e0b29c3a.jpg',
'PS5',
'https://i.pinimg.com/1200x/5f/5f/6f/5f5f6fd5a85d925049822e528f170878.jpg',
180.90,
NULL,
'mas-vendidos',
'Red Dead Redemption 2'
),
(
'Mundo Abierto',
'Grand Theft Auto V es un juego de acción y aventura en mundo abierto que sigue la vida de tres criminales mientras cometen delitos, realizan misiones y exploran la ciudad de Los Santos.',
'2013-09-17',
'https://i.pinimg.com/736x/f6/e6/35/f6e635c823a8d8e6c73b7e10767cf719.jpg',
'PS5',
'https://i.pinimg.com/1200x/08/35/85/083585979b0592236e2904b5a0e65c3e.jpg',
100.20,
NULL,
'mas-vendidos',
'Grand Theft Auto V'
),
(
'Mundo Abierto',
'The Witcher 3: Wild Hunt es un RPG de acción en un vasto mundo abierto donde los jugadores toman decisiones que afectan la historia, explorando ciudades, bosques y peligrosos territorios mientras cazan monstruos.',
'2015-05-19',
'https://i.pinimg.com/1200x/22/f3/35/22f3357b234812d792277e6925e5f62b.jpg',
'PS5',
'https://i.pinimg.com/1200x/52/37/76/523776e13892382097dd5b4c13402d0f.jpg',
120.00,
NULL,
'mas-vendidos',
'The Witcher 3: Wild Hunt'
),
(
'Mundo Abierto',
'Cyberpunk 2077 es un juego de rol y acción en mundo abierto ambientado en Night City, donde los jugadores toman decisiones que afectan la historia mientras personalizan a V, un mercenario mejorado con implantes cibernéticos.',
'2020-12-10',
'https://i.pinimg.com/1200x/b6/2e/b6/b62eb6f80aa4fc27f502f0b8c51ef8c6.jpg',
'PS5',
'https://i.pinimg.com/736x/27/37/2e/27372eb08effcfdaa6314ec0313f6593.jpg',
160.00,
NULL,
'mas-vendidos',
'Cyberpunk 2077'
);

-- MAS VENDIDOS
INSERT INTO juego (
    categoria, descripcion, fecha_lanzamiento,
    imagen_url, plataforma, portada_url,
    precio, requisitos, seccion, titulo
)
VALUES (
'Deportes',
'NBA 2K25 es la última entrega de la serie de simulación de baloncesto, ofreciendo gráficos mejorados, modos de juego actualizados y ligas profesionales para competir en línea y offline.',
'2024-09-06',
'https://i.pinimg.com/1200x/52/fa/8d/52fa8d0abe45ea147225c1635da13ed2.jpg',
'PS5',
'https://i.pinimg.com/1200x/eb/5f/82/eb5f824365eb872c823c8231655b8614.jpg',
130.20,
NULL,
'mas-vendidos',
'NBA 2K25'
),
(
'Deportes',
'FC 26 ofrece la experiencia más realista de fútbol, con equipos actualizados, modos de carrera, torneos internacionales y mejoras en la inteligencia artificial y jugabilidad.',
'2025-10-27',
'https://i.pinimg.com/1200x/32/06/dd/3206dd46cb3cb8b2b8377119d199ed08.jpg',
'PS5',
'https://i.pinimg.com/1200x/37/e4/9b/37e49bd46cebcebc0e27eaec48a1552a.jpg',
250.00,
NULL,
'mas-vendidos',
'FC 26'
),
(
'Deportes',
'UFC 5 es la última entrega de la serie de artes marciales mixtas, con combates más realistas, luchadores actualizados, nuevos movimientos y modos de torneo y carrera mejorados.',
'2025-07-10',
'https://i.pinimg.com/736x/1b/8b/c2/1b8bc2ba04fa4cd64bfb10bb0d524a94.jpg', 
'PS5',
'https://i.pinimg.com/1200x/c9/c2/eb/c9c2eb09cfe3460adc93fd4b056f283a.jpg',
200.00,
NULL,
'mas-vendidos',
'UFC 5'
),
(
'Deportes',
'F1 25 es el simulador oficial de la temporada de Fórmula 1 2025, con todos los pilotos, equipos y circuitos, además de mejoras en la física, gráficos y modos de juego tanto offline como online.',
'2025-09-01',
'https://i.pinimg.com/736x/ea/8c/c4/ea8cc4eb8f78df6557ca54cf40711877.jpg',
'PS5',
'https://i.pinimg.com/1200x/dc/57/51/dc5751586af5b375cd45b25e305c73b5.jpg',
99.99,
NULL,
'mas-vendidos',
'F1 25'
);