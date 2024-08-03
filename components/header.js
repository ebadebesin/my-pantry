import React from 'react';
import { AppBar, Typography, Button, Toolbar } from "@mui/material";

import firebase from '@/firebase'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const Header = () => {
    async function logout() {
        try {
            await firebase.auth().signOut();
            console.log('User signed out successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error during logout:', error);
            return { error: 'Something went wrong.' };
        }
    }
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My Pantry
                </Typography>
                <Button color="inherit" onClick={
                    async () => {
                        const confirm = window.confirm('Are you sure you want to logout?');
                        if (!confirm) {
                            return;
                        }
                        const response = await logout();
                        if (response.success) {
                            window.location.href = '/login';
                        }
                    }
                }>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;