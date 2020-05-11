const UserList = () => import("@/views/users/UserList");
const UserView = () => import("@/views/users/UserView");
const UserCreate = () => import("@/views/users/UserCreate");

export default [
  {
    path: "/admin/users/create",
    name: "UserCreate",
    component: UserCreate,
    meta: {
      access: "users.create",
      breadcrumb: [
        {
          key: "frontend.menu.admin",
          fallback: "Admin",
          route: "Admin",
        },
        {
          key: "frontend.common.users",
          fallback: "Users",
          route: "Users",
        },
      ],
    },
  },
  {
    path: "/admin/users/edit/:id",
    name: "UserEdit",
    component: UserCreate,
    meta: {
      breadcrumb: [
        {
          key: "frontend.menu.admin",
          fallback: "Admin",
          route: "Admin",
        },
        {
          key: "frontend.common.users",
          fallback: "Users",
          route: "Users",
        },
      ],
    },
  },
  {
    path: "/admin/users",
    name: "Users",
    component: UserList,
    meta: {
      access: "users.view",
      userType: "admin",
      breadcrumb: [
        {
          key: "frontend.menu.admin",
          fallback: "Admin",
          route: "Admin",
        },
        {
          key: "frontend.common.users",
          fallback: "Users",
          route: "Users",
        },
      ],
    },
  },
  {
    path: "/admin/users/view/info/:id",
    name: "AdminUserViewInfo",
    component: UserView,
    meta: {
      access: "users.view",
      breadcrumb: [
        {
          key: "frontend.menu.admin",
          fallback: "Admin",
          route: "Admin",
        },
        {
          key: "frontend.common.users",
          fallback: "Users",
          route: "Users",
        },
      ],
    },
  },
  {
    path: "/admin/users/view/assets/:id",
    name: "AdminUserViewAssets",
    component: UserView,
    meta: {
      access: "users.view",
      breadcrumb: [
        {
          key: "frontend.menu.admin",
          fallback: "Admin",
          route: "Admin",
        },
        {
          key: "frontend.common.users",
          fallback: "Users",
          route: "Users",
        },
      ],
    },
  },
  {
    path: "/admin/users/view/devices/:id",
    name: "AdminUserViewDevices",
    component: UserView,
    meta: {
      access: "users.view",
      breadcrumb: [
        {
          key: "frontend.menu.admin",
          fallback: "Admin",
          route: "Admin",
        },
        {
          key: "frontend.common.users",
          fallback: "Users",
          route: "Users",
        },
      ],
    },
  },
];
