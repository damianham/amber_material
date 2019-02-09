# amber_react_sidebar
Amber web framework application recipe for a React SPA with Granite ORM.

## NOT READY YET - do not use

The amber backend serves both html and json.  Also includes a JWT authorisation
pipe in src/pipes.  Create a new amber app with this template with these commands;

The React SPA is only displayed when the user is logged in, otherwise the page is rendered by the Amber backend.

The SPA Includes a sidebar component and a main display component. 

```
amber new mynewapp -r damianham/amber_react_sidebar
cd mynewapp
amber g auth User
amber g scaffold Category title:string user:reference
amber g scaffold Product title:string description:text category:reference user:reference
amber g scaffold Comment body:text product:reference user:reference
```

### Notes

1. Remove the Authenticate pipe from `config/routes.cr` after generating the auth plugin.  
2. Uncomment AuthenticateJWT pipe from `config/routes.cr` if authentication is required.
3. If you're using [JWT](https://jwt.io/) then a `user_id` field is required on your **models**, **param validators** and **migrations** to render `edit` and `delete` buttons according to `current_user`.
4. If you're getting "Could not load..." error then ensure your models URLs are inside `REGEX_PATHS` in `pipes/authenticate_jwt.cr`.
