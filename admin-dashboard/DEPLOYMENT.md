# ============================================================================
# GSFP Admin Dashboard - Deployment Guide
# ============================================================================

## Prerequisites

- Docker and Docker Compose installed
- Firebase project configured with:
  - Authentication enabled (Email/Password and Google OAuth)
  - Firestore Database created
  - Storage bucket configured
  - App registered with configuration
- Domain name configured (e.g., admin.gsfp.gov.gh)
- SSL certificate (optional but recommended)

## Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Fill in the required Firebase credentials:
```bash
REACT_APP_FIREBASE_API_KEY=your_actual_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
```

3. Set production-specific settings:
```bash
REACT_APP_DEBUG_MODE=false
REACT_APP_ENABLE_MOCK_DATA=false
REACT_APP_ALLOWED_ORIGINS=https://gsfp.gov.gh,https://www.gsfp.gov.gh
```

## Local Deployment

### Using Docker Compose (Recommended)

1. Build and start the container:
```bash
docker-compose up -d
```

2. Access the dashboard at: http://localhost:3001

3. View logs:
```bash
docker-compose logs -f
```

4. Stop the container:
```bash
docker-compose down
```

### Without Docker

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Serve the build folder (using any static file server):
```bash
npx serve -s build -l 3001
```

## Production Deployment

### Option 1: Docker on VPS

1. Copy files to server:
```bash
scp -r admin-dashboard/ user@server:/opt/gsfp/
```

2. SSH into server:
```bash
ssh user@server
```

3. Navigate to directory:
```bash
cd /opt/gsfp/admin-dashboard
```

4. Create .env file with production credentials
5. Start with Docker Compose:
```bash
docker-compose up -d
```

### Option 2: CI/CD with GitHub Actions

1. Configure GitHub Secrets:
   - `DOCKER_USERNAME`: Docker Hub username
   - `DOCKER_PASSWORD`: Docker Hub password
   - `DEPLOY_HOST`: Server hostname/IP
   - `DEPLOY_USER`: SSH username
   - `DEPLOY_SSH_KEY`: SSH private key
   - `SLACK_WEBHOOK`: Slack webhook for notifications (optional)

2. Push to production branch:
```bash
git push origin production
```

3. GitHub Actions will automatically:
   - Run tests
   - Build the application
   - Create Docker image
   - Deploy to server

### Option 3: Cloud Platform Deployment

#### Netlify

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard
5. Deploy automatically on push to main branch

#### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Configure environment variables in Vercel dashboard

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Content collection - admin write, public read for published
    match /content/{documentId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection - admin only
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Stakeholders collection - authenticated users
    match /stakeholders/{stakeholderId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == stakeholderId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Analytics collection - admin only
    match /analytics/{documentId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // UserSettings collection - user-specific
    match /userSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Monitoring and Maintenance

### Health Checks

- Health endpoint: `http://your-domain/health`
- Docker health check runs every 30 seconds

### Logs

View Docker logs:
```bash
docker-compose logs -f admin-dashboard
```

### Updates

To update the application:
```bash
git pull origin production
docker-compose pull
docker-compose up -d
```

### Backup

Regular backups of Firebase data should be configured via Firebase Console or using Firebase CLI:
```bash
firebase firestore:export --backup-path ./backups
```

## Troubleshooting

### Build fails

- Check Node.js version (should be 18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check environment variables are set correctly

### Firebase connection fails

- Verify Firebase credentials in .env
- Check Firebase project is not in test mode
- Ensure Firestore and Storage are enabled
- Check Firebase Security Rules allow access

### Images not uploading

- Check Storage bucket exists
- Verify Storage rules allow uploads
- Check file size limits (default 10MB)
- Ensure file types are allowed

### Content not appearing on frontend

- Check content status is 'published'
- Verify real-time sync is enabled
- Check frontend is reading from correct collection
- Clear browser cache

## Security Checklist

- [ ] Firebase credentials are set in environment variables
- [ ] .env file is not committed to git
- [ ] Firebase Security Rules are configured
- [ ] SSL/TLS is enabled in production
- [ ] CORS is configured correctly
- [ ] File upload limits are set appropriately
- [ ] Admin accounts are secured with strong passwords
- [ ] Two-factor authentication is enabled for Firebase
- [ ] Regular backups are configured
- [ ] Monitoring and alerts are set up
