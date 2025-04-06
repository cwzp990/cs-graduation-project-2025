/* eslint-disable react-refresh/only-export-components */
import { RouteObject, createBrowserRouter } from "react-router-dom";
import { MenuItemType } from "antd/es/menu/interface";
import App from "../App";
import Login from "../views/Login";
export type AdminRouterItem = RouteObject & {
  // set antd menu props in meta
  meta?: MenuItemType;
  children?: AdminRouterItem[];
  sort?: number;
};

/**
 * auto load route from views/***\/*.router.ts
 * @returns route
 */
const loadRouteModules = async () => {
  const routeModuleFiles = import.meta.glob("../views/**/*.router.tsx", {
    eager: true,
    import: "default",
  });
  const routeModules: AdminRouterItem[] = [];

  for await (const [key, module] of Object.entries(routeModuleFiles)) {
    console.log("key = ", key, "module = ", module);

    if (module) {
      const routes = Array.isArray(module) ? module : [module];
      routeModules.push(...routes);
    }
  }

  // 按 sort 属性排序
  routeModules.sort((a, b) => {
    const sortA = a.sort || 0;
    const sortB = b.sort || 0;
    return sortA - sortB;
  });

  return routeModules;
};

export const routes: AdminRouterItem[] = [...(await loadRouteModules())];

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
