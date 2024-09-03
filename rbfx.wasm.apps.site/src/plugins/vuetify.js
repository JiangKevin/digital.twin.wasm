// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
// Composable
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
  theme: {
    dark: true,
    defaultTheme: "dark",
    themes: {
      dark: {
        colors: {
          background: "#00002000",
          primary: "#1867C0",
          secondary: "#5CBBF6",
          grey: "#a5a5a5",
          "pink-red": "#FF597B",
        },
        variables: {
          "border-color": "#000000",
          "border-opacity": 0.12,
          "high-emphasis-opacity": 0.87,
          "medium-emphasis-opacity": 0.6,
          "disabled-opacity": 0.38,
          "idle-opacity": 0.04,
          "hover-opacity": 0.04,
          "focus-opacity": 0.12,
          "selected-opacity": 0.08,
          "activated-opacity": 0.12,
          "pressed-opacity": 0.12,
          "dragged-opacity": 0.08,
          "theme-kbd": "#212529",
          "theme-on-kbd": "#FFFFFF",
          "theme-code": "#F5F5F5",
          "theme-on-code": "#000000",
        },
      },
    },
  },
  components,
  directives,
});
