// pages/signUp.js

"use client"

import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import firebase from '@/firebase';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Get the router object
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      // Handle successful sign-up
      setLoading(false);
      router.push('/SignIn');
    } catch (error) {
      setLoading(false)
      if (error.code === 'auth/email-already-in-use') {
        const confirm = window.confirm('Email is already in use');
      if (!confirm) {
          return;
      }
        console.error('Email already in use.');
        // Handle email already in use error
      } else {
      console.error(error);
      }

      // Handle sign-up error
    }

    // if (response.success) {
    //   setLoading(false)
    //   console.log('SignUp successful!')
    //   router.push('/')
    // } else {
    //   setLoading(false)
    //   const errorData = response.error;
    //   setError(errorData.error || 'An error occurred. Please try again.')
    // }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
          Sign Up
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
        <Button variant="contained" color="primary" fullWidth onClick={handleSignUp}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}
