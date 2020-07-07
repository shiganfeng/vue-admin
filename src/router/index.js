import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};

const routes = [{
        path: "/",
        redirect: "login",
        hidden: true,
        meta: {
            name: "主页"
        }
    },
    {
        path: "/login",
        name: "Login",
        hidden: true,
        //要用箭头函数
        component: () =>
            import ("../views/Login/index2.0.vue"),
        meta: {
            name: "登录"
        }
    },
    {
        path: "/console",
        name: "Console",
        redirect: 'index',
        meta: {
            name: "控制台"
        },
        //要用箭头函数
        component: () =>
            import ("../views/Layout/index.vue"),
        children: [{
            path: "/index",
            name: "Index",
            //要用箭头函数
            component: () =>
                import ("../views/Console/index.vue"),
            meta: {
                name: "首页"
            }
        }]
    },
    {
        path: "/info",
        name: "Info",
        meta: {
            name: "信息管理"
        },
        //要用箭头函数
        component: () =>
            import ("../views/Layout/index.vue"),
        children: [{
                path: "/infoIndex",
                name: "InfoIndex",
                //要用箭头函数
                component: () =>
                    import ("../views/Info/index.vue"),
                meta: {
                    name: "信息列表"
                }
            },
            {
                path: "/infoCategory",
                name: "InfoCategory",
                //要用箭头函数
                component: () =>
                    import ("../views/Info/category.vue"),
                meta: {
                    name: "信息分类"
                }
            }
        ]
    },
    {
        path: "/user",
        name: "User",
        meta: {
            name: "用户管理"
        },
        //要用箭头函数
        component: () =>
            import ("../views/Layout/index.vue"),
        children: [{
            path: "/userIndex",
            name: "UserIndex",
            //要用箭头函数
            component: () =>
                import ("../views/User/index.vue"),
            meta: {
                name: "用户列表"
            }
        }]
    }
];

const router = new VueRouter({
    routes
});

export default router;