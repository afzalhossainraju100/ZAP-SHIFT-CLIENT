# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


1. react install
   depedences install (react router, tailwind css, google font, react icon)
   set dependencies
2. Covarage|
   install: React Leaflet
   Link:https://react-leaflet.js.org/?utm_source=chatgpt.com
   video: M-11[60(8,9)]
3. Authentication page
   use react hook form for better registration and better login
   npm install react-hook-form
4. go to react router for all info
   https://github.com/remix-run/react-router
   go to example/auth/src/app.txs

5. use ImgBB for Image upload 
   npm install axios
   from imgBB: https://api.imgbb.com/1/upload?expiration=600&key=YOUR_CLIENT_API_KEY
   from firebase: https://firebase.google.com/docs/auth/web/manage-users

complete user flow:
User clicks "Be A Rider" (from BannerButton or Navbar)
    ↓
handleRiderClick() checks user state
    ↓
├─ YES (logged in) → navigate("/rider") directly
└─ NO (not logged in) → navigate("/signin", state: { from: { pathname: "/rider" } })
                           ↓
                      SignIn page loads
                           ↓
                      User logs in
                           ↓
                      SignIn reads location.state?.from?.pathname
                           ↓
                      navigate("/rider") automatically
                           ↓
                      PrivateRoute allows access ✅

 6. npm install sweetalert2 install for review

 7 https://tanstack.com/query/latest/docs/framework/react/installation
 for data fetch and state management