-- Database fix for learning_plan_topics foreign key issue
-- This script fixes the specific case of missing learning plan with ID 3

-- First, check if the learning plan with ID 3 exists and create it if it doesn't
INSERT INTO learning_plan (ID, TITLE, DESCRIPTION, USER_ID, CREATED_AT)
SELECT 3, 'Temporary Plan', 'This plan was created to resolve foreign key constraint issues', 'admin', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM learning_plan WHERE id = 3);

-- Now check if there are any orphaned records in learning_plan_topics
-- and associate them with the learning plan
UPDATE learning_plan_topics
SET learning_plan_id = 3
WHERE learning_plan_id = 3 AND NOT EXISTS (SELECT 1 FROM learning_plan WHERE id = 3);

-- Fix the sequence to avoid future conflicts
ALTER SEQUENCE IF EXISTS learning_plan_seq RESTART WITH 100;

-- Add cascading delete constraint to prevent orphaned records in the future
ALTER TABLE learning_plan_topics 
DROP CONSTRAINT IF EXISTS FKN70IGL07IIDJGQETOK6Y0AGW6;

ALTER TABLE learning_plan_topics
ADD CONSTRAINT FKN70IGL07IIDJGQETOK6Y0AGW6
FOREIGN KEY (learning_plan_id) REFERENCES learning_plan(id)
ON DELETE CASCADE;

-- If you find the learning plan with ID 3 is empty/temporary and want to 
-- transfer its topics to another plan, use this:
-- UPDATE learning_plan_topics 
-- SET learning_plan_id = [target_id]
-- WHERE learning_plan_id = 3;