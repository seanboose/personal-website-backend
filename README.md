# overview

express backend for a personal website. facilitates communicate between frontend and s3

uses Bearer token authorization (JWT)

# deployment

automatically deployed on pushes to `production` and `staging` branches (to production and staging environments).
because i'm cheap, this project currently uses the free plan on render and shuts itself down after periods of
inactivity.
this means initial attempts to access can meet pretty huge delays. everything is fine, it's just spinning up the server.

urls

- production: https://personal-website-backend-fvac.onrender.com
- staging: https://personal-website-backend-staging.onrender.com

# related repos

- frontend: @seanboose/personal-website-frontend
- shared types: @seanboose/personal-website-api-types
