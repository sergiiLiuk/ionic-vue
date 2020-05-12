const Assets = () => import("@/views/admin/Assets");
const Locations = () => import("@/views/admin/Locations");
const Categories = () => import("@/views/admin/Categories");
const Groups = () => import("@/views/admin/Groups");
const Reports = () => import("@/views/admin/Reports");
const Service = () => import("@/views/admin/Service");
const Warnings = () => import("@/views/admin/Warnings");
const UserList = () => import("@/views/admin/users/UserList");

export default [
  {
    path: "/admin/assets",
    name: "AdminAssets",
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
    path: "/admin/locations",
    name: "AdminLocations",
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
    path: "/admin/categories",
    name: "AdminCategories",
    component: Categories,
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
    path: "/admin/groups",
    name: "AdminGroups",
    component: Groups,
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
    path: "/admin/reports",
    name: "AdminReports",
    component: Reports,
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
    path: "/admin/service",
    name: "AdminService",
    component: Service,
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
    path: "/admin/warnings",
    name: "AdminWarnings",
    component: Warnings,
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
    path: "/admin/users",
    name: "AdminUsers",
    component: UserList,
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
