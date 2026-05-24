# Product Schema

Required product fields:

- `product`: display name
- `slug`: lowercase URL slug
- `vendor`: vendor or project name
- `category`: broad product category
- `credentials`: array of credential records

Optional product fields:

- `$schema`: path to `../../schema/product.schema.json` for editor validation
- `aliases`: alternate names and search terms
- `tags`: search and filter labels
- `services`: service names such as `http`, `ssh`, `snmp`, or `tomcat-manager`
- `ports`: default or commonly exposed ports
- `protocols`: protocol labels such as `http`, `https`, `ssh`, or `snmp`
- `loginPaths`: login URLs or realms such as `/manager/html`
- `homepage`: product homepage
- `sources`: product-level references

Required credential fields:

- `username`: string, use `""` for blank
- `password`: string, use `""` for blank
- `status`: `active`, `historical`, `reported`, `no-default`, or `unknown`

Optional credential fields:

- `versions`: array of human-readable version ranges
- `introduced`: first known applicable version
- `removed`: first known non-applicable version
- `context`: deployment context, for example `upstream`, `vendor-appliance`, `docker-image`, `distro-package`, or `ctf-lab`
- `confidence`: `confirmed`, `vendor-docs`, `community-reported`, `lab-only`, or `unknown`
- `sourceType`: `vendor-doc`, `manual`, `sample-config`, `community-list`, `ctf`, or `unknown`
- `services`: credential-specific service names
- `ports`: credential-specific ports
- `protocols`: credential-specific protocols
- `loginPaths`: credential-specific login URLs or realms
- `lastVerified`: `YYYY-MM-DD` date for the latest source verification
- `notes`: short clarification
- `scopeNote`: boundary note that explains where this record applies
- `sources`: credential-level references

Records must describe public default, vendor, sample, appliance, or lab credentials only. Do not submit leaked, stolen, customer-specific, or environment-specific secrets.
