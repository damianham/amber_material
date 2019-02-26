# amber_material
Amber web framework modular application recipe for a React SPA with Material UI.

The amber backend serves both html and json.  Also includes a JWT authorisation
pipe in src/pipes.  Create a new amber app with this recipe using SQLite3 database
 and scaffold out some components with these commands;

```
amber new mynewapp -r damianham/amber_material
cd mynewapp
amber g auth User
amber g scaffold Category title:string user:reference
amber g scaffold Product title:string description:text category:reference user:reference
amber g scaffold Comment body:text product:reference user:reference
```

The React SPA is only displayed when the user is logged in, otherwise the views are
rendered by the Amber template rendering engine.  This recipe has a feature to support streaming data changes via websockets.  Changes to database models on the backend are instantly reflected in the SPA for all connected clients. You can make the SPA active for all users by changing the index method in
```
src/controllers/home_controller.cr
```
Thus; for a guest the home page is rendered from src/views/home/index.slang (or .ecr if you elect to use ECR template engine).
For an authenticated user the home screen is part of the SPA and is contained in the Home component at;
```
src/views/home/js/home.js
```
The Home component is the component that renders for the '/' route.
The SPA Includes a sidebar component and a main display component. The layout for the SPA is defined in
```
src/assets/javascripts/app.js
```
The scaffold generator will generate code modules for components in
```
src/modules/<component_name>
```
Component artifacts are generated for both the SPA frontend and the Amber backend template engine.
The generated component module contains (almost) everything related to the module, Controller, Model, Views, custom stylesheet and SPA javascript modules.

For example, for an application that uses the slang template engine, given the command;
```
amber g scaffold Product title:string description:text category:reference user:reference
```
This will generate the following artifacts
```
src/modules/product/
  edit.slang
  _form.slang
  index.slang  
  new.slang
  product_controller.cr          
  product.cr  
  show.slang
  style.scss

spec/modules/product/
  product_controller_spec.cr
  product_spec.cr
  spec_helper.cr

src/modules/product/js
    product_edit.js  
    product_form.js
    product_index.js
    product.js
    product_new.js        
    product_view.js

src/modules/product/__tests__
    product_edit.test.js  
    product_form.test.js
    product_index.test.js
    product.test.js
    product_new.test.js        
    product_view.test.js

src/modules/product/__fixtures__/product_fixtures.js
```

And will add links and routes to
```
src/views/layouts/_nav.slang
src/modules/js/routes.js

```

The SPA application layout (in src/assets/javascripts/app.js) has a Material-UI
Mini Variant Drawer menu.  The routes added for each module contain an index route with
a MailIcon icon.  You should change the icon to something that reflects the purpose of the module.
Choose an icon from [material.io/tools/icons](https://material.io/tools/icons/?style=baseline) then
import the icon src/modules/js/routes.js.  See [Usage](https://github.com/mui-org/material-ui/blob/next/packages/material-ui-icons/README.md#usage) for details about icon naming.


### Notes

1. Remove the Authenticate pipe from `config/routes.cr` after generating the auth plugin.  
2. Uncomment AuthenticateJWT pipe from `config/routes.cr` if authentication is required.
3. If you're using [JWT](https://jwt.io/) then a `user_id` field is required on your **models**, **param validators** and **migrations** to render `edit` and `delete` buttons according to `current_user`.
4. If you're getting "Could not load..." error then ensure your models URLs are inside `REGEX_PATHS` in `pipes/authenticate_jwt.cr`.
