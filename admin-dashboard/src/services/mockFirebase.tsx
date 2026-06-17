// @ts-nocheck
// Copy of mockFirebase.js for admin-dashboard
// This replaces Firebase when NODE_ENV === 'development'

class MockAuth {
  currentUser: any;
  authStateListeners: any[];

  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
  }

  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback);
    // Don't auto-login - let user login through the login page
    callback(this.currentUser);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
    };
  }

  async signInWithEmailAndPassword(email, password) {
    // Mock successful login
    this.currentUser = {
      uid: 'mock-admin-id',
      email: email,
      displayName: 'GSFP Administrator',
      emailVerified: true,
      photoURL: null
    };
    this.authStateListeners.forEach(cb => cb(this.currentUser));
    return { user: this.currentUser };
  }

  async createUserWithEmailAndPassword(email, password) {
    this.currentUser = {
      uid: 'mock-admin-id-' + Date.now(),
      email: email,
      displayName: 'New Admin',
      emailVerified: false,
      photoURL: null
    };
    this.authStateListeners.forEach(cb => cb(this.currentUser));
    return { user: this.currentUser };
  }

  async signInWithPopup(provider) {
    this.currentUser = {
      uid: 'mock-google-admin-id',
      email: 'admin@google.com',
      displayName: 'Google Admin',
      emailVerified: true,
      photoURL: 'https://via.placeholder.com/100'
    };
    this.authStateListeners.forEach(cb => cb(this.currentUser));
    return { user: this.currentUser };
  }

  async signOut() {
    this.currentUser = null;
    this.authStateListeners.forEach(cb => cb(null));
  }

  async sendPasswordResetEmail(email) {
    console.log(`Mock: Password reset email sent to ${email}`);
  }

  async updateProfile(updates) {
    if (this.currentUser) {
      Object.assign(this.currentUser, updates);
      this.authStateListeners.forEach(cb => cb(this.currentUser));
    }
  }
}

class MockFirestore {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('mockFirestoreAdmin') || '{}');
    this.saveData = () => localStorage.setItem('mockFirestoreAdmin', JSON.stringify(this.data));
  }

  collection(collectionName) {
    return new MockCollection(this.data, collectionName, this.saveData);
  }
}

class MockCollection {
  constructor(data, collectionName, saveData) {
    this.data = data;
    this.collectionName = collectionName;
    this.saveData = saveData;
    if (!this.data[collectionName]) {
      this.data[collectionName] = {};
    }
  }

  doc(docId) {
    return new MockDoc(this.data, this.collectionName, docId, this.saveData);
  }

  async add(data) {
    const docId = 'mock-doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    this.data[this.collectionName][docId] = { ...data, id: docId };
    this.saveData();
    return { id: docId };
  }

  async get() {
    const docs = Object.values(this.data[this.collectionName]).map(data => ({
      id: data.id,
      data: () => data
    }));
    return { docs, forEach: (cb) => docs.forEach(cb) };
  }
}

class MockQuery {
  constructor(data, collectionName, saveData) {
    this.data = data;
    this.collectionName = collectionName;
    this.saveData = saveData;
    this.whereClauses = [];
    this.orderByClauses = [];
  }

  where(field, op, value) {
    this.whereClauses.push({ field, op, value });
    return this;
  }

  orderBy(field, direction = 'asc') {
    this.orderByClauses.push({ field, direction });
    return this;
  }

  async get() {
    let docs = Object.values(this.data[this.collectionName] || {});

    // Apply where clauses
    this.whereClauses.forEach(({ field, op, value }) => {
      if (op === '==') {
        docs = docs.filter(doc => doc[field] === value);
      } else if (op === 'array-contains') {
        docs = docs.filter(doc => doc[field] && doc[field].includes(value));
      }
    });

    // Apply order by
    if (this.orderByClauses.length > 0) {
      const { field, direction } = this.orderByClauses[0];
      docs.sort((a, b) => {
        if (direction === 'desc') {
          return b[field] - a[field];
        }
        return a[field] - b[field];
      });
    }

    const mockDocs = docs.map(data => ({
      id: data.id,
      data: () => data
    }));

    return { docs: mockDocs, forEach: (cb) => mockDocs.forEach(cb) };
  }
}

class MockDoc {
  constructor(data, collectionName, docId, saveData) {
    this.data = data;
    this.collectionName = collectionName;
    this.docId = docId;
    this.saveData = saveData;
  }

  async set(data, options = {}) {
    if (options.merge) {
      this.data[this.collectionName][this.docId] = {
        ...this.data[this.collectionName][this.docId],
        ...data
      };
    } else {
      this.data[this.collectionName][this.docId] = data;
    }
    this.saveData();
  }

  async get() {
    const data = this.data[this.collectionName][this.docId];
    return {
      exists: () => !!data,
      data: () => data
    };
  }

  async update(updates) {
    if (this.data[this.collectionName][this.docId]) {
      Object.assign(this.data[this.collectionName][this.docId], updates);
      this.saveData();
    }
  }

  async delete() {
    delete this.data[this.collectionName][this.docId];
    this.saveData();
  }

  collection(subCollection) {
    const fullPath = `${this.collectionName}/${this.docId}/${subCollection}`;
    return new MockCollection(this.data, fullPath, this.saveData);
  }
}

class MockStorage {
  constructor() {
    this.files = JSON.parse(localStorage.getItem('mockStorageAdmin') || '{}');
    this.saveFiles = () => localStorage.setItem('mockStorageAdmin', JSON.stringify(this.files));
  }

  ref(path) {
    return new MockStorageRef(this.files, path, this.saveFiles);
  }
}

class MockStorageRef {
  constructor(files, path, saveFiles) {
    this.files = files;
    this.path = path;
    this.saveFiles = saveFiles;
  }

  async put(file) {
    // Mock upload - store file metadata
    this.files[this.path] = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: Date.now()
    };
    this.saveFiles();
    return {
      ref: this,
      metadata: this.files[this.path]
    };
  }

  async getDownloadURL() {
    // Return a data URL or placeholder
    return `https://via.placeholder.com/300x200?text=${encodeURIComponent(this.files[this.path]?.name || 'File')}`;
  }

  async delete() {
    delete this.files[this.path];
    this.saveFiles();
  }
}

// Export mock services
export const auth = new MockAuth();
export const db = new MockFirestore();
export const storage = new MockStorage();
export const app = { name: 'mock-app' }; // Mock Firebase app

// Mock Firebase functions
export const collection = (name) => db.collection(name);
export const doc = (collectionName, docId) => db.collection(collectionName).doc(docId);
export const query = (collectionRef, ...queryConstraints) => {
  let mockQuery = new MockQuery(db.data, collectionRef.collectionName, db.saveData);
  queryConstraints.forEach(constraint => {
    if (constraint.where) {
      mockQuery = mockQuery.where(...constraint.where);
    } else if (constraint.orderBy) {
      mockQuery = mockQuery.orderBy(...constraint.orderBy);
    }
  });
  return mockQuery;
};
export const where = (field, op, value) => ({ where: [field, op, value] });
export const orderBy = (field, direction) => ({ orderBy: [field, direction] });
export const getDocs = (query) => query.get();
export const addDoc = (collectionRef, data) => collectionRef.add(data);
export const updateDoc = (docRef, updates) => docRef.update(updates);
export const deleteDoc = (docRef) => docRef.delete();
export const setDoc = (docRef, data, options) => docRef.set(data, options);
export const getDoc = (docRef) => docRef.get();

// Storage mocks
export const ref = (path) => storage.ref(path);
export const uploadBytes = (ref, file) => ref.put(file);
export const getDownloadURL = (ref) => ref.getDownloadURL();
export const deleteObject = (ref) => ref.delete();

// Auth mocks
export const createUserWithEmailAndPassword = (auth, email, password) => auth.createUserWithEmailAndPassword(email, password);
export const signInWithEmailAndPassword = (auth, email, password) => auth.signInWithEmailAndPassword(email, password);
export const signInWithPopup = (auth, provider) => auth.signInWithPopup(provider);
export const signOut = (auth) => auth.signOut();
export const onAuthStateChanged = (auth, callback) => auth.onAuthStateChanged(callback);
export const sendPasswordResetEmail = (auth, email) => auth.sendPasswordResetEmail(email);
export const updateProfile = (user, updates) => user.updateProfile(updates);

// Mock Google Auth Provider
export class GoogleAuthProvider {
  constructor() {
    this.providerId = 'google.com';
  }
}

// Mock server timestamp
export const serverTimestamp = () => ({ toDate: () => new Date() });

console.log('Mock Firebase services loaded for admin-dashboard local development');
