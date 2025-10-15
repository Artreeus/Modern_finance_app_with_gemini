# 🔧 Environment Variables Setup

## Create Your .env File

Copy this content into a new file named `.env` in your project root:

```env
# ============================================
# REQUIRED CONFIGURATION
# ============================================

# MongoDB Connection
# Get this from MongoDB Atlas: https://cloud.mongodb.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-app?retryWrites=true&w=majority

# NextAuth Configuration
# For local development:
NEXTAUTH_URL=http://localhost:3000

# NextAuth Secret (IMPORTANT!)
# Generate with: openssl rand -base64 32
# Or use: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production


# ============================================
# OPTIONAL CONFIGURATION
# ============================================

# Google Gemini AI (Optional - for AI financial advice)
# Get free API key from: https://makersuite.google.com/app/apikey
# GEMINI_API_KEY=your-gemini-api-key-here

# Cloudinary (Optional - for receipt image uploads)
# Get free account from: https://cloudinary.com
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
# NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Environment
NODE_ENV=development
```

---

## Quick Setup Steps

### 1. **MongoDB URI** (REQUIRED)

**Get it from MongoDB Atlas:**
1. Go to https://cloud.mongodb.com
2. Create free cluster (if you haven't)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `finance-app`

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:MyPassword123@cluster0.abc123.mongodb.net/finance-app?retryWrites=true&w=majority
```

### 2. **NextAuth Secret** (REQUIRED)

**Generate a secure secret:**

**Option 1 - Using OpenSSL (recommended):**
```bash
openssl rand -base64 32
```

**Option 2 - Using online generator:**
Visit: https://generate-secret.vercel.app/32

**Option 3 - Quick random string:**
```
any-long-random-string-here-make-it-unique-and-secret-123456789
```

**Example:**
```env
NEXTAUTH_SECRET=dGhpc2lzYXNlY3JldGtleWZvcm5leHRhdXRoMTIzNDU2Nzg5
```

### 3. **Gemini AI** (OPTIONAL)

**Only if you want AI financial advice:**

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy and add to .env:
```env
GEMINI_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr678
```

**If you skip this:** The app will work perfectly! AI advice just won't be available.

### 4. **Cloudinary** (OPTIONAL)

**Only if you want receipt image uploads:**

1. Go to https://cloudinary.com
2. Sign up for free account
3. Get your cloud name and create upload preset
4. Add to .env:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
```

**If you skip this:** The app will work! Receipt uploads just won't work.

---

## ✅ Minimal Working .env

**This is all you need to start:**

```env
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-key
NODE_ENV=development
```

Everything else is optional!

---

## 🚀 After Creating .env

1. **Save the file** as `.env` in your project root
2. **Restart the server:**
   ```bash
   npm run dev
   ```
3. **Visit:** http://localhost:3001 (or 3000 if available)
4. **Create an account** and start using the app!

---

## ❓ Common Issues

### **Issue: "NEXTAUTH_SECRET is not set"**
**Fix:** Add `NEXTAUTH_SECRET` to your `.env` file

### **Issue: "Failed to connect to MongoDB"**
**Fix:** Check your `MONGODB_URI` is correct and database password is right

### **Issue: "AI feature not available"**
**Fix:** This is normal if `GEMINI_API_KEY` is not set. The app works without it!

---

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` (never commit it!)
- ✅ Never share your secrets
- ✅ Use different secrets for production
- ✅ Keep API keys private

---

## 📝 Full Example

Here's a complete working example:

```env
# MongoDB
MONGODB_URI=mongodb+srv://financeuser:MySecurePass123@cluster0.abc12.mongodb.net/finance-app?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dGhpc2lzYXNlY3JldGtleWZvcm5leHRhdXRoMTIzNDU2Nzg5

# Optional Features
GEMINI_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr678
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=my-finance-app
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=finance-receipts

# Environment
NODE_ENV=development
```

---

**That's it!** Your app is ready to use! 🎉

