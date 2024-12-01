import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        fallbackLng: "en",
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
                        cotizacion: "Quote"
                    },
                    idioma: "Language",
                    selected_date: "Selected Date",
                    selected_month: "Selected Month",
                    loading: "Loading data...",
                    no_data: "No data to display.",
                    error: "Error loading data.",
                    navbar: {
                        title: "TORONTO STOCK EXCHANGE - TSX VENTURE EXCHANGE"
                    },
                    body_indices: { 
                        title: "Stock Index Quotes" 
                    }, 
                    body_empresas: { 
                        title: "TSX Listed Companies" 
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
                        cotizacion: "Cotización"
                    },
                    idioma: "Idioma",
                    selected_date: "Fecha Seleccionada",
                    selected_month: "Mes Seleccionado",
                    loading: "Cargando datos...",
                    no_data: "No hay datos para mostrar.",
                    error: "Error al cargar los datos.",
                    navbar: {
                        title: "BOLSA DE VALORES DE TORONTO - INTERCAMBIO DE EMPRESAS"
                    },
                    body_indices: { 
                        title: "Cotizaciones de los Índices Bursátiles" 
                    }, 
                    body_empresas: { 
                        title: "TSX - Empresas Cotizando" 
                    }
                },
            },
        },
    });

export default i18next;
