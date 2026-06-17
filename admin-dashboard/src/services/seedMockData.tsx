// @ts-nocheck
// Seed script for mock Firebase data in local development
// Run this in browser console to populate mock data

import sampleData from '../scripts/populateData.js';

// Seed hero content
sampleData.heroContent.forEach(async (item) => {
  const docRef = doc(db, 'content', item.id);
  await setDoc(docRef, {
    ...item,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
});

// Seed articles
sampleData.articles.forEach(async (item) => {
  const docRef = doc(db, 'content', item.id);
  await setDoc(docRef, {
    ...item,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
});

// Seed gallery
sampleData.gallery.forEach(async (item) => {
  const docRef = doc(db, 'gallery', item.id);
  await setDoc(docRef, {
    ...item,
    createdAt: serverTimestamp()
  });
});

// Seed events
sampleData.events.forEach(async (item) => {
  const docRef = doc(db, 'events', item.id);
  await setDoc(docRef, {
    ...item,
    createdAt: serverTimestamp()
  });
});

// Seed users
const users = [
  {
    id: 'mock-user-id',
    name: 'Administrator',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  }
];

users.forEach(async (user) => {
  const docRef = doc(db, 'users', user.id);
  await setDoc(docRef, user);
});

console.log('Mock data seeded successfully!');
