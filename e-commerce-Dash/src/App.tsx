import polyglotI18nProvider from "ra-i18n-polyglot";
import {
  Admin,
  CustomRoutes,
  Resource,
  localStorageStore,
  useStore,
  StoreContextProvider,
} from "react-admin";
import { Route } from "react-router";

import authProvider from "./authProvider";
import { AuthProvider } from "./context/AuthContext";
import categories from "./categories";
import subcategories from "./subcategories";
import { Dashboard } from "./dashboard";
import dataProviderFactory from "./dataProvider";
import englishMessages from "./i18n/en";
import { Layout, Login } from "./layout";
import orders from "./orders";
import products from "./products";
import users from "./users";
import { themes, ThemeName } from "./themes/themes";

const i18nProvider = polyglotI18nProvider(
  (locale) => {
    if (locale === "fr") {
      return import("./i18n/fr").then((messages) => messages.default);
    }
    if (locale === "ar") {
      return import("./i18n/ar").then((messages) => messages.default as any);
    }
    return englishMessages;
  },
  "en",
  [
    { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
    { locale: "ar", name: "العربية" },
  ],
);

const store = localStorageStore(undefined, "ECommerce");

const App = () => {
  const [themeName] = useStore<ThemeName>("themeName", "soft");
  const singleTheme = themes.find((theme) => theme.name === themeName)?.single;
  const lightTheme = themes.find((theme) => theme.name === themeName)?.light;
  const darkTheme = themes.find((theme) => theme.name === themeName)?.dark;
  return (
    <Admin
      title="Admin Dashboard"
      dataProvider={dataProviderFactory(import.meta.env.VITE_API_URL || "")}
      store={store}
      authProvider={authProvider}
      dashboard={Dashboard}
      loginPage={Login}
      layout={Layout}
      i18nProvider={i18nProvider}
      disableTelemetry
      theme={singleTheme}
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
      requireAuth
    >
      <Resource name="categories" {...categories} />
      <Resource name="subcategories" {...subcategories} />
      <Resource name="products" {...products} />
      <Resource name="orders" {...orders} />
      <Resource name="users" {...users} />
    </Admin>
  );
};

const AppWrapper = () => (
  <StoreContextProvider value={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StoreContextProvider>
);

export default AppWrapper;

