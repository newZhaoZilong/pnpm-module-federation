import type { App } from 'vue';
import type { RouteRecord } from 'vue-router';


import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import routes from './index';

let app: App | null = null;
const BUILD_EVN = 'local';
const config: any = require('../../mfe.config.json');



function getPrefix(path: string) {
    const matched = path.match(/^\/(\w*)/);
    return matched && matched.length > 1 ? matched[1] : '';
}

function getRenderApp(prefix: string) {
    return config[prefix];
}

function filterRoute(children: Array<any>, fullPath: string, path: string) {
    return true;
}

function asyncLoadRemote(url: string) {
    return new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = url;
        el.type = 'text/javascript';
        el.async = true;
        document.head.appendChild(el);
        el.onload = () => resolve(null);
        el.onerror = reject;
    });
}

function loadComponent(scope:string, module:string) {
    return async () => {
      // Initializes the share scope. This fills it with known provided modules from this build and all remotes
      await __webpack_init_sharing__('default');
      debugger;
      //@ts-ignore
      const container = window[scope]; // or get the container somewhere else

      // Initialize the container, it may provide shared modules
      //@ts-ignore
      await container.init(__webpack_share_scopes__.default);
      //@ts-ignore
      const factory = await window[scope].get(module);
      const Module = factory();
      return Module;
    };
  }

async function getScopeRoutes(app: any | null) {
    if (app) {
        await asyncLoadRemote(app.url as string);
        const scopeRoutes = await loadComponent(app.scope || '', './router')();
        // return {
        //     path: '/' + app.routerPrefix,
        //     name: app.routerPrefix,
        //     //@ts-ignore
        //     component: () => import('./RouterView'),
        //     children: (scopeRoutes?.default ?? []).map((o: any) => ({
        //         ...o,
        //         name: o.name || `${app.routerPrefix}_${o.path}`
        //     }))
        // }
 
        return scopeRoutes?.default ?? [];
    }
    // return {
    //     name: '',
    //     path: '',
    //     children: [],
    //      //@ts-ignore
    //     component: () => import('./RouterView'),
    // }
    return []
}

function adaptForVue(allAppRoutes: any) {
    const router = createRouter({
        history: createWebHistory(),
        routes,
    });
    router.beforeEach(async (to) => {
        allAppRoutes = router.getRoutes();
        //@ts-ignore
        let has = allAppRoutes.some((item) => item.path === to.path);
        console.log('router.getRoutes',router.getRoutes());
        const { matched, fullPath } = to;
        console.log(to.fullPath);
        debugger;
        if(!matched.length){
            const prefix = getPrefix(to.path);
            if (prefix) {
                const isExsitRouterWithPrefix = allAppRoutes.some(({ path }: RouteRecord) => ~path.indexOf(prefix))
                if (!isExsitRouterWithPrefix) {
                    const renderApp = getRenderApp(prefix);
                    const scopeRoutes = await getScopeRoutes(renderApp);
                    const { path, children = [] } = scopeRoutes;
                    if (filterRoute(children, fullPath, path)) {
                        has = true;
                        console.log('scopeRoutes',scopeRoutes);
                        console.log('router.getRoutes',router.getRoutes());
                        scopeRoutes.forEach((o:any)=>{
                            router.addRoute({
                                ...o,
                                path:`/${renderApp.routerPrefix}/${o.path}`
                            });
                        })
                        
                      console.log('router.getRoutes',router.getRoutes());
                      return fullPath;
                    } else {
                        has = false;
                    }
                }
            }
        }


        return has ? undefined : '/404';
    })
    app?.use(router);
}

async function adaptor(context: App) {
    debugger;
    app = context;
    
    let allAppRoutes = routes;
    // await getScopeRoutes(getRenderApp('host'));
    adaptForVue(allAppRoutes);
    return app;
}

export default adaptor;