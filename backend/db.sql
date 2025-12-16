-- DROP TABLES TO ENSURE CLEAN SLATE
DROP TABLE IF EXISTS user_templates CASCADE;
DROP TABLE IF EXISTS template_exercises CASCADE;
DROP TABLE IF EXISTS workout_templates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- COMMANDS FOR DB TABLES
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workout_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  difficulty VARCHAR(20),
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS template_exercises (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_name VARCHAR(255) NOT NULL,
  sets INTEGER,
  reps INTEGER,
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  order_index INTEGER
);

CREATE TABLE IF NOT EXISTS user_templates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES workout_templates(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, template_id)
);

-- COMMANDS FOR DB SEED
INSERT INTO workout_templates (name, description, category, difficulty, duration_minutes)
VALUES 
('Full Body Blast', 'A high-intensity full body workout.', 'HIIT', 'Intermediate', 30),
('Upper Body Strength', 'Focus on chest, back, and arms.', 'Strength', 'Advanced', 45),
('Morning Yoga Flow', 'Gentle stretching to start your day.', 'Flexibility', 'Beginner', 20);

INSERT INTO template_exercises (template_id, exercise_name, sets, reps, rest_seconds, order_index)
VALUES
(1, 'Burpees', 3, 15, 60, 1),
(1, 'Push-ups', 3, 20, 60, 2),
(1, 'Squats', 3, 20, 60, 3),
(2, 'Bench Press', 4, 10, 90, 1),
(2, 'Pull-ups', 4, 8, 90, 2),
(2, 'Shoulder Press', 3, 12, 60, 3),
(3, 'Downward Dog', 1, 1, 0, 1),
(3, 'Warrior I', 1, 1, 0, 2),
(3, 'Childs Pose', 1, 1, 0, 3);
