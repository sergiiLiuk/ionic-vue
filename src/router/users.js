const UserList = () => import("@/views/users/UserList");

export default [
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
];
