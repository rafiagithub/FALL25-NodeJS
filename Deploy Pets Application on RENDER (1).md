# Deploying the Pets App Project

This guide provides step-by-step instructions to deploy the Pets App project using **Render** for the backend and **MongoDB Atlas** for the database.

---

## Step 1: Prepare Your Code for Deployment

1. Ensure your project is in a Git repository. If it's not, initialize one:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push your code to a GitHub repository:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy Backend (Node.js App) on Render

1. Visit [Render](https://render.com/).
2. Sign in or create an account.
3. Click **"New"** > **"Web Service"**.
4. Connect your GitHub account and select your repository.
5. Configure the deployment settings:
   - **Environment**: `Node.js`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Region**: Choose a region closest to your users.
6. Click **"Create Web Service"**.

Render will now deploy your Node.js application. Once the deployment is complete, you'll receive a live URL for your app.

---

## Step 3: Deploy Database (MongoDB) with MongoDB Atlas

Render doesn’t provide a managed MongoDB database, so we’ll use **MongoDB Atlas** for the database.

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in or create an account.
2. Create a new cluster:
   - Select the free tier.
   - Choose a cloud provider and region.
3. Once the cluster is ready:
   - Click **"Connect"** > **"Connect your application"**.
   - Copy the connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).
4. Update your `server.js` file with the new connection string:
   ```javascript
   mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/petsDB?retryWrites=true&w=majority', {
       useNewUrlParser: true,
       useUnifiedTopology: true,
   });
   ```

5. Push the changes to GitHub:
   ```bash
   git add server.js
   git commit -m "Update MongoDB connection string"
   git push
   ```

Your Render deployment will automatically redeploy with the updated MongoDB connection.

---

## Step 4: Frontend Deployment (Optional)

While Render can serve static files for the frontend, it's often better to use a specialized service like **Vercel** for frontend hosting.

### Deploying Frontend on Render:
1. Place your frontend files (e.g., `index.html`, `create.html`, `update.html`) in a folder named `public`.
2. Update your `server.js` to serve static files:
   ```javascript
   app.use(express.static(path.join(__dirname, 'public')));
   ```
3. Push the changes to GitHub. Render will automatically redeploy your app.

### Deploying Frontend on Vercel:
1. Visit [Vercel](https://vercel.com/).
2. Sign in or create an account.
3. Click **"New Project"**, import your GitHub repository, and deploy.
4. Once deployed, you’ll receive a live URL for your frontend.

---

## Step 5: Verify the Deployment

1. Access your live backend URL (e.g., `https://your-app.onrender.com`) to test the API.
2. Access your live frontend URL and ensure it connects properly to the backend.
3. Test all CRUD operations to ensure everything works as expected.

---

## Notes

- **Environment Variables**: Use Render's dashboard to securely store sensitive information like MongoDB credentials.
- **Free Tier Limitations**:
  - Render services may shut down after periods of inactivity.
  - MongoDB Atlas free tier is limited to 512 MB of storage.
- **Scaling**: For higher traffic, consider upgrading to paid tiers or using other hosting providers.

---

