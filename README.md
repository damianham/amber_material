# amber_material

[![Amber Framework](https://img.shields.io/badge/using-amber_framework-orange.svg)](https://amberframework.org)

Amber web framework modular application recipe for a React SPA with Material UI.

This is for the [Amber](https://amberframework.org) web framework. An Amber recipe is an application template
that you can use to bootstrap a new Amber application with some features that are not in the
base Amber application template. This recipe differs from the base Amber application template in some
significant ways;

- The scaffold command will place all artifacts for a component (controller, model,
  view and javascript modules and tests) in a component folder in src/modules. This differs from
  the standard code layout of a Ruby on Rails and Amber application but it is a better way to
  organise your code.  Principle of Proximity - yay!
- To support rendering views within components in **src/modules**, controllers use the
  **render_module** macro from the shard damianham/amber_render_module rather than the standard **render** macro.
- When a registered user has signed in to the web application the SPA (Single Page Application)
  presents the UI and the Amber application becomes an API application with data transfer
  from/to the SPA and the Amber application in JSON format rather than the UI being rendered by the Amber templating engine. This behaviour is easily modifiable in the index method of the HomeController.

Enjoy!

## Prerequisites

Amber requires [Crystal](https://crystal-lang.org/) ([installation guide](https://crystal-lang.org/docs/installation/)).

This recipe requires Amber installed and executable on the path.  See the
[Amber docs](https://docs.amberframework.org/amber) to get started with Amber.  
See the [Getting Help](https://docs.amberframework.org/amber/#getting-help) section of the Amber docs
if you get stuck with anything.  Once you have installed Crystal getting started with Amber
is super easy.  One way you can do that is to build Amber from the Github repository then copy
the executable into your shell path.
```
$ git clone https://github.com/amberframework/amber.git
$ cd amber
$ shards build
$ cp bin/amber ~/.local/bin  # or ~/bin - whatever is on your path

```

Once you have created and started a new Amber application with this recipe the
Amber backend serves both html and json.  This recipe also includes a JWT authorisation
pipe in src/pipes and logs the user into the web application with a token from
local storage.  See the [Crystal JWT](https://github.com/crystal-community/jwt) docs
for details on how to configure the JWT token (in src/controllers/HomeController).

Create a new amber app with this recipe using SQLite3 database
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
a ViewModuleIcon icon.  You should change the icon to something that reflects the purpose of the module.
Choose an icon from [material.io/tools/icons](https://material.io/tools/icons/?style=baseline) then
import the icon in src/assets/javascripts/app.js. You also need to define a text name for the icon in
the icons object
```
// src/assets/javascripts/app.js
const icons = {
  'Exit': ExitToApp,
  'Home': HomeIcon,
  'Inbox': InboxIcon,
  'Mail': MailIcon,
  'Person': PersonIcon,
  'View': ViewModuleIcon
};

```
and use the text name as the icon identifier for the route in src/modules/js/routes.js.

See [Usage](https://github.com/mui-org/material-ui/blob/next/packages/material-ui-icons/README.md#usage) for details about icon naming.

## Material UI Theme

The SPA uses Material UI to theme the frontend application.  You can customize the colour scheme of the theme
in **src/assets/javascripts/main.js**. See [Material UI Themes](https://material-ui.com/customization/themes/)
for information about how to customize the theme. A handy tool is the [Material Color Tool](https://material.io/tools/color/#!/?view.left=0&view.right=0) to help you pick your colour scheme.

### Testing

Test the web application crystal code with
```
$ crystal spec
```

Test the SPA javascript code with
```
$ npm run test
```

## TODO

- signin/signout from the SPA
- oauth signin
- modify profile in SPA

### Notes

1. Remove the Authenticate pipe from `config/routes.cr` after generating the auth plugin.  
2. Uncomment AuthenticateJWT pipe from `config/routes.cr` if authentication with JWT is required.
3. If you're using [JWT](https://jwt.io/) then in a future version of this recipe a `user_id` field will required on your **models**, **param validators** and **migrations** to render `edit` and `delete` buttons according to `current_user`.
4. If you're getting "Could not load..." error then ensure your models URLs are inside `REGEX_PATHS` in `pipes/authenticate_jwt.cr`.
