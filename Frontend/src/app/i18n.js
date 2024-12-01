import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    title: "Business Quotes",
                    buttons: {
                        save: "Save",
                        cancel: "Cancel",
                        login: "Login",
                        previous_day: "Previous Day",
                        next_day: "Next Day",
                        previous_month: "Previous Month",
                        next_month: "Next Month",
                        daily_chart: "Daily Chart",
                        monthly_chart: "Monthly Chart",
                        annual_chart: "Annual Chart",
                        hora: "Hour",
                        fecha: "Date",
                        cotizacion: "Quote",
                    },
                    Participación_de_Empresas: "Business Participation",
                    idioma: "Language",
                    selected_date: "Selected Date",
                    selected_month: "Selected Month",
                    loading: "Loading data...",
                    no_data: "No data to display.",
                    error: "Error loading data.",
                    navbar: {
                        title: "TORONTO STOCK EXCHANGE - TSX VENTURE EXCHANGE",
                    },
                    footer: {
                        languages: "Supported Languages",
                        countries:
                            "Exchanges from: Canada, USA, Turkey, Argentina, Brazil, Japan, China, England, Netherlands, France, Germany, Australia, Italy, Norway, Russia",
                    },
                    body_indices: {
                        title: "Stock Index Quotes",
                    },
                    body_empresas: {
                        title: "TSX Listed Companies",
                    },
                    grafico: {
                        tooltip: {
                            codigo: "Code",
                            valor: "Value",
                        },
                        tabla: {
                            empresa: "Company",
                            codigo: "Code",
                            valor_inicial: "Initial Value",
                            porcentaje: "Percentage (%)",
                            participacion: "Market Part."
                        },
                        
                    },
                },
            },
            es: {
                translation: {
                    title: "Cotizaciones de Empresas",
                    buttons: {
                        save: "Guardar",
                        cancel: "Cancelar",
                        login: "Iniciar sesión",
                        previous_day: "Día Anterior",
                        next_day: "Día Siguiente",
                        previous_month: "Mes Anterior",
                        next_month: "Mes Siguiente",
                        daily_chart: "Gráfico Diario",
                        monthly_chart: "Gráfico Mensual",
                        annual_chart: "Gráfico Anual",
                        hora: "Hora",
                        fecha: "Fecha",
                        cotizacion: "Cotización",
                    },
                    Participación_de_Empresas: "Participación de Empresas",
                    idioma: "Idioma",
                    selected_date: "Fecha Seleccionada",
                    selected_month: "Mes Seleccionado",
                    loading: "Cargando datos...",
                    no_data: "No hay datos para mostrar.",
                    error: "Error al cargar los datos.",
                    navbar: {
                        title: "BOLSA DE VALORES DE TORONTO - INTERCAMBIO DE EMPRESAS",
                    },
                    footer: {
                        languages: "Idiomas soportados",
                        countries:
                            "Intercambios desde: Canadá, EE.UU., Turquía, Argentina, Brasil, Japón, China, Inglaterra, Países Bajos, Francia, Alemania, Australia, Italia, Noruega, Rusia",
                    },
                    body_indices: {
                        title: "Cotizaciones de los Índices Bursátiles",
                    },
                    body_empresas: {
                        title: "TSX - Empresas Cotizando",
                    },
                    grafico: {
                        tooltip: {
                            codigo: "Código",
                            valor: "Valor",
                        },
                        tabla: {
                            empresa: "Empresa",
                            codigo: "Código",
                            valor_inicial: "Valor Inicial",
                            porcentaje: "Porcentaje (%)",
                            participacion: "Part. del Mercado"
                        },
                        
                    },
                },
            },
        },
    });

export default i18next;
