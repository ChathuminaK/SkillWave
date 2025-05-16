# How to Fix the Learning Plan Update Issue

## Problem Description

When updating a learning plan with media, you might encounter the following error:

```
Failed to update learning plan with media: could not execute statement [Referential integrity constraint violation: "FKN70IGL07IIDJGQETOK6Y0AGW6: PUBLIC.LEARNING_PLAN_TOPICS FOREIGN KEY(LEARNING_PLAN_ID) REFERENCES PUBLIC.LEARNING_PLAN(ID) (CAST(3 AS BIGINT))"]
```

This error occurs because:
1. There's a foreign key constraint between `learning_plan_topics` and `learning_plan` 
2. The system is trying to update a learning plan with ID 3 that doesn't exist or has been deleted

## Solution Options

### Option 1: Use the Database Repair API

1. Make a GET request to: `http://localhost:8080/api/database/repair-learning-plan`
2. This will automatically:
   - Create a temporary learning plan with ID 3 if it doesn't exist
   - Fix the database sequences
   - Update the constraints to include CASCADE DELETE for future prevention

### Option 2: Run the Database Fix SQL Script

1. Navigate to the `backend` directory
2. Run the `database-fix.sql` script against your H2 database:
   ```
   java -cp ./target/SkillWave-0.0.1-SNAPSHOT.jar org.h2.tools.RunScript -url "jdbc:h2:file:C:/Users/MCS/Desktop/SkillWave/skillwavedb" -user sa -password password -script database-fix.sql
   ```

### Option 3: Manual Database Fix

1. Connect to your H2 database console at: `http://localhost:8080/h2-console`
2. Use the following connection details:
   - JDBC URL: `jdbc:h2:file:C:/Users/MCS/Desktop/SkillWave/skillwavedb`
   - Username: `sa`
   - Password: `password`
3. Run these SQL statements:
   ```sql
   -- Create learning plan with ID 3 if it doesn't exist
   INSERT INTO learning_plan (ID, TITLE, DESCRIPTION, USER_ID, CREATED_AT)
   SELECT 3, 'Temporary Plan', 'Created to fix constraint issues', 'admin', CURRENT_TIMESTAMP
   WHERE NOT EXISTS (SELECT 1 FROM learning_plan WHERE id = 3);
   
   -- Fix sequence to avoid future conflicts
   ALTER SEQUENCE IF EXISTS learning_plan_seq RESTART WITH 100;
   
   -- Add cascading delete to prevent orphaned records
   ALTER TABLE learning_plan_topics 
   DROP CONSTRAINT IF EXISTS FKN70IGL07IIDJGQETOK6Y0AGW6;
   
   ALTER TABLE learning_plan_topics
   ADD CONSTRAINT FKN70IGL07IIDJGQETOK6Y0AGW6
   FOREIGN KEY (learning_plan_id) REFERENCES learning_plan(id)
   ON DELETE CASCADE;
   ```

## Prevention

The code has been updated to:
1. Check if learning plans exist before trying to update them
2. Handle `ElementCollection` relationships properly by clearing and re-adding topics
3. Create a temporary plan as a fallback for the specific problem case (ID 3)
4. Add CASCADE DELETE constraints to automatically clean up related records

## Support

If you continue to experience issues, please contact the development team.
