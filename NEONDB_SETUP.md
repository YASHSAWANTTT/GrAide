# NeonDB Connection Setup Guide

This guide will help you connect your GrAide application to a Neon Postgres database.

## Step 1: Create a Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign Up"** and create a new account
3. Verify your email address

## Step 2: Create a New Project

1. After logging in, click **"Create Project"** in the Neon dashboard
2. Fill in the project details:
   - **Project Name**: e.g., "GrAide Production" or "GrAide Development"
   - **Region**: Choose the region closest to your users (e.g., `us-east-1`, `eu-west-1`)
   - **PostgreSQL Version**: Select the latest stable version (recommended: 15 or 16)
3. Click **"Create Project"**

## Step 3: Get Your Connection String

1. After project creation, you'll be taken to the project dashboard
2. Look for the **"Connection Details"** section
3. You'll see a connection string that looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. Click **"Copy"** to copy the full connection string

## Step 4: Set Up Environment Variables

### For Local Development

1. Create or edit `.env.local` in your project root:
   ```bash
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

2. **Important**: Make sure `.env.local` is in your `.gitignore` file (it should be by default)

### For Production (Vercel/Other Hosting)

1. Go to your hosting platform's environment variables settings
2. Add a new environment variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string
3. Save the changes

## Step 5: Run Database Migrations

After setting up your connection string, run the migrations to set up your database schema:

```bash
# Generate migration files (if needed)
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push

# Or run migrations manually
npx drizzle-kit migrate
```

## Step 6: Remove the Paid Column (If Needed)

If your database still has the `paid` column from the old schema, run this migration:

```bash
# Option 1: Run the SQL migration file directly
psql $DATABASE_URL -f drizzle/0003_remove_paid_column.sql

# Option 2: Or connect to Neon and run the SQL in the SQL Editor
```

The SQL to run:
```sql
ALTER TABLE "users" DROP COLUMN IF EXISTS "paid";
```

## Step 7: Verify Connection

Test your database connection:

1. **Using the test endpoint** (if available):
   ```bash
   curl http://localhost:3000/api/test-db
   ```

2. **Or check the connection in your app**:
   - Start your dev server: `npm run dev`
   - Try logging in - if the user syncs to the database, the connection is working!

## Connection String Format

Your Neon connection string will have this format:
```
postgresql://[user]:[password]@[hostname]/[database]?sslmode=require
```

Example:
```
postgresql://neondb_owner:npg_abc123xyz@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Important Notes

1. **SSL Required**: Neon requires SSL connections. The connection string includes `?sslmode=require` by default.

2. **Connection Pooling**: Neon provides automatic connection pooling. No additional configuration needed.

3. **Free Tier Limits**: 
   - Free tier includes 0.5 GB storage
   - 3 projects maximum
   - Automatic sleep after 5 minutes of inactivity (wakes up on next request)

4. **Production Considerations**:
   - Consider upgrading to a paid plan for production
   - Set up automatic backups
   - Monitor usage and performance

5. **Security**:
   - Never commit your connection string to version control
   - Use environment variables for all database credentials
   - Rotate passwords regularly

## Troubleshooting

### Connection Timeout
- Check if your IP is blocked (Neon allows all IPs by default)
- Verify the connection string is correct
- Check if the database is in sleep mode (first request may be slow)

### SSL Error
- Ensure `?sslmode=require` is in your connection string
- Check that your database client supports SSL

### Authentication Failed
- Verify your username and password are correct
- Check if the database user has proper permissions
- Try resetting the password in Neon dashboard

### Migration Errors
- Make sure you're connected to the correct database
- Check that previous migrations have been applied
- Review the migration files for syntax errors

## Next Steps

1. ✅ Set up your `DATABASE_URL` environment variable
2. ✅ Run database migrations
3. ✅ Remove the `paid` column if it exists
4. ✅ Test the connection
5. ✅ Start building your application!

For more help, visit [Neon Documentation](https://neon.tech/docs)

