const Assets = () => import("@/views/overview/Assets");
const Locations = () => import("@/views/overview/Locations");
const Log = () => import("@/views/overview/Log");
const Users = () => import("@/views/overview/Users");

export default [
  {
    path: "/overview/assets",
    name: "OverviewAssets",
    component: Assets,
    meta: {
      breadcrumb: [
        {
          key: "frontend.common.overview",
          fallback: "Overview",
          route: "Overview",
        },
        {
          key: "frontend.common.assets",
          fallback: "Assets",
          route: "OverviewAssets",
        },
      ],
    },
  },
  {
    path: "/overview/locations",
    name: "OverviewLocations",
    component: Locations,
    meta: {
      breadcrumb: [
        {
          key: "frontend.common.overview",
          fallback: "Overview",
          route: "Overview",
        },
        {
          key: "frontend.common.assets",
          fallback: "Assets",
          route: "OverviewAssets",
        },
      ],
    },
  },
  {
    path: "/overview/log",
    name: "OverviewLog",
    component: Log,
    meta: {
      breadcrumb: [
        {
          key: "frontend.common.overview",
          fallback: "Overview",
          route: "Overview",
        },
        {
          key: "frontend.common.assets",
          fallback: "Assets",
          route: "OverviewAssets",
        },
      ],
    },
  },
  {
    path: "/overview/users",
    name: "OverviewUsers",
    component: Users,
    meta: {
      breadcrumb: [
        {
          key: "frontend.common.overview",
          fallback: "Overview",
          route: "Overview",
        },
        {
          key: "frontend.common.assets",
          fallback: "Assets",
          route: "OverviewAssets",
        },
      ],
    },
  },
];
