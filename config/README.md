# Database Configuration

This directory contains environment-specific database configurations.

## Usage

1. Copy the example files and remove the `.example` extension:
   ```bash
   cp database.development.json.example database.development.json
   cp database.staging.json.example database.staging.json
   cp database.production.json.example database.production.json
   ```

2. Update the configuration files with your actual database credentials.

3. The backup and restore scripts will automatically use these configurations based on the `NODE_ENV` environment variable or the `--env` parameter.

## Environment Variables

Environment variables always take precedence over config files:
- `MARIADB_HOST`
- `MARIADB_PORT`
- `MARIADB_USER`
- `MARIADB_PASSWORD`
- `MARIADB_DATABASE`

## Security

⚠️ **Important**: Never commit actual database passwords to version control!
- Add `config/database.*.json` to your `.gitignore` file
- Use environment variables in production
- Keep example files for reference only
