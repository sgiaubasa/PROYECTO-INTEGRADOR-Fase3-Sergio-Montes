db.institutions.insertOne({
    name: "Mi App",
    address: "Av. Siempreviva 100, San Juan, Argentina",
    phone: "+54 264 1234-5678",
    email: "info@miapp.com",
    logo: "logo.png",
    mission: {
        description: "Nuestra misión es desarrollar soluciones tecnológicas innovadoras que mejoren la vida de las personas y potencien el crecimiento de las organizaciones. Nos enfocamos en ofrecer productos y servicios digitales accesibles, seguros y de alta calidad, promoviendo la transformación digital y la eficiencia operativa en cada uno de nuestros clientes. Buscamos combinar la creatividad, la tecnología y el compromiso humano para brindar experiencias que generen valor real, impulsando un futuro más conectado, inclusivo y sostenible.",
        thumbnail: "mission.png",
    },
    vision: {
        description: "Ser una empresa referente en el ámbito tecnológico a nivel regional e internacional, reconocida por la excelencia, la innovación y el impacto positivo de nuestras soluciones. Aspiramos a liderar la transformación digital con un enfoque centrado en las personas, convirtiéndonos en un aliado estratégico de confianza para empresas, instituciones y comunidades. Nuestra visión es construir un ecosistema tecnológico sostenible donde la innovación, la ética y el desarrollo humano convivan en equilibrio, generando oportunidades para todos.",
        thumbnail: "vision.png",
    },
    values: {
        description: "En Mi App creemos que nuestros valores son la base de todo lo que hacemos. Promovemos la innovación continua, impulsando la creatividad y la búsqueda constante de nuevas soluciones tecnológicas que aporten verdadero valor a la sociedad. Nos guía un profundo compromiso con la calidad, asegurando que cada producto y servicio refleje excelencia, confiabilidad y mejora permanente. Fomentamos el trabajo en equipo y la colaboración, convencidos de que la diversidad de ideas y la unión de talentos fortalecen nuestros resultados y enriquecen nuestro entorno laboral. Actuamos siempre con ética, transparencia e integridad, construyendo relaciones basadas en la confianza y el respeto mutuo. Mantenemos una firme orientación al cliente, escuchando y comprendiendo sus necesidades para ofrecer experiencias que superen sus expectativas. Finalmente, asumimos una responsabilidad social y ambiental, contribuyendo activamente a un desarrollo sostenible y equilibrado, donde la tecnología esté al servicio del bienestar de las personas y del planeta.",
        thumbnail: "values.png",
    },
    createdAt: new Date(),
    updatedAt: new Date()
});