# Setting up your environment
run 'npm install' in both the frontend and backend directories.

# Setting up the database
Run dump to generate schema including tables, procedures, events, and triggers  
Or  
Run fitly.sql file and all items in sqlFunctions.sql file

# How to run the frontend:
cd FITLY/frontend  
npm start

# How to run backend:
cd FITLY/backend  
npx tsx index.ts

# How to connect backend to DB:
First, make sure that the MySQL server is running with the fitly.sql file.  
edit FITLY/backend/database.ts  
change host, user, password, and port to ensure a proper connection.
