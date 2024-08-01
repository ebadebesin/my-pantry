// pages/signIn.js
"use client"

import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import firebase from '@/firebase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // Handle successful sign-in
    } catch (error) {
      console.error(error);
      // Handle sign-in error
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box p={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSignIn}>
          Sign In
        </Button>
      </Box>
    </Box>
  );
}
