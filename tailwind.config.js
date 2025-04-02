import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                figtree: ["Figtree", ...defaultTheme.fontFamily.sans],
                montserrat: ["Montserrat", ...defaultTheme.fontFamily.sans],
                poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                "10px": "10px",
                "12px": "12px",
                "14px": "14px",
                "16px": "16px",
                "18px": "18px",
                "20px": "20px",
                "22px": "22px",
                "28px": "28px",
            },
            lineHeight: {
                "30px": "30px",
            },
            colors: {
                "custom-gray": "#404040",
                "main-green": "#03773d",
                "icon-gray": "#555555",
                "text-gray": "#8B8B93",
                "list-gray": "#F8F8F8",
                "custom-blue": "#177DFF",
                "custom-cblue": "#05B4D8",
                "custom-green": "#00b577",
                "custom-purple": "#716ACA",
                "white": "#ffffff",
                "custom-gray2": "#575962",
                "bronze": "#B08B3E",
                "silver": "#CCCCCC",
                "orange": "#fd976a",
                "custom-yellow": "#fdb80c",
                "light-dark": "#313442",
                "heavy-dark": "#0F0F12",
            },
        },
    },

    plugins: [forms],
};
