import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/note',
        },
        {
            path: '/note',
            name: 'note',
            component: () => import('@/views/Note/NoteView.vue'),
            redirect: '/note/select',
            children: [
                {
                    path: 'select',
                    name: 'select',
                    component: () =>
                        import('@/views/Note/NoteProjectSelect.vue'),
                },
                {
                    path: 'detail/:id?',
                    name: 'detail',
                    component: () =>
                        import('@/views/Note/NoteProjectDetail.vue'),
                },
                {
                    path: 'edit',
                    name: 'edit',
                    component: () => import('@/views/Note/NoteProjectEdit.vue'),
                },
            ],
        },
        // {
        //   path: '/about',
        //   name: 'about',
        //   // route level code-splitting
        //   // this generates a separate chunk (About.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import('../views/AboutView.vue'),
        // },
    ],
});

export default router;
