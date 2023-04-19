# Xamlinx Front

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Frontend Setup

1. Set environments in `src/environments/environment.prod.ts`
```bash
apiUrl: '<YOUR_API_URL>/api',
stripeKey: '<STRIPE_PUBLIC_KEY>'
```
2. Run following command to build frontend
```bash
npx -p @angular/cli ng build --prod
```
3. Set root directory on cpanel to `<FRONT_ROOT_DIRECTORY>/dist/front`.
4. Copy htaccess to `dist/front`
```bash
cp htaccess dist/front/.htaccess
```