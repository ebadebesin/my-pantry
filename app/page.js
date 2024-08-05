"use client"

import { Box, Typography, Button, Modal, TextField, Tooltip } from "@mui/material";
import { Stack } from "@mui/material";
import { SearchRounded } from '@mui/icons-material';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import Header from '@/components/header';

// import { firestore } from "@/firebase";

import firebase from '@/firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { collection, doc, getDocs, setDoc, deleteDoc, getDoc, where} from "firebase/firestore"; 
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

// import SignIn from '@/components/SignIn';
// import SignUp from '@/components/SignUp';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

// Sets the type of item
const type = [
  {
    value: 'Perishable',
    label: 'Perishable',
  },
  {
    value: 'Non-perishable',
    label: 'Non-perishable',
  },
];

export default function Home() {
  const firestore = firebase.firestore();
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearch] = useState('');

  const router = useRouter();

////////////// Update function  

  const updatePantry = async() => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        return { error: 'User not authenticated.' };
      }
      const snapshot = await getDocs(collection(firestore, 'pantry'))
      const pantryList = snapshot.docs.map(doc => ({name: doc.id, ...doc.data()}))
      setPantry(pantryList)
    } catch (error) {
      console.error("Error fetching pantry items:", error);
    }
  }

  useEffect(() => {
    updatePantry()
  },[])


///////////// Add function  
  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const docData = docSnap.data();
        const updatedData = {
          count: (docData.count || 0) + 1,
          name: docData.name || item // Ensure the 'name' field is set
        };
        await setDoc(docRef, updatedData);
      } else {
        await setDoc(docRef, { name: item, count: 1 });
      }
      await updatePantry();
    } catch (error) {
      console.error('Error adding item:', error);
    }
    // const docRef = doc(collection(firestore, 'pantry'), item)
    // //check if exist
    // const docSnap = await getDoc(docRef, {name: item});
    // if (docSnap.exists()){
    //   const {count} = docSnap.data()
    //   await setDoc(docRef, {count: count + 1}) 
    // } else {
    //   await setDoc(docRef, {count: 1})
    // }
    // await updatePantry()
  }


 ////// /////// Remove Function
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      if (count === 1) {
        await deleteDoc(docRef)
      } else {
      await setDoc(docRef, {count: count - 1})
      }
    }
  await updatePantry()
  }


 ////////// // Search Function/filter function
 const search = async (item) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser; // Ensure you are getting the authenticated user
    if (!user) {
      console.error('User not authenticated.');
      return { error: 'User not authenticated.' };
    }

    const collectionRef = collection(firestore, "pantry");
    console.log(`Searching for documents with item: ${item}`);

    // Fetch all documents
    const querySnapshot = await getDocs(collectionRef);

    // Log the fetched documents for debugging
    const fetchedDocs = querySnapshot.docs.map(doc => doc.data());
    console.log('Fetched documents:', fetchedDocs);

    if (querySnapshot.empty) {
      console.error('No documents found.');
      return { error: 'No documents found.' };
    }

    const documents = fetchedDocs.filter(doc => doc.name && doc.name.toLowerCase().includes(item.toLowerCase()));

    console.log('Filtered documents:', documents);

    if (documents.length === 0) {
      console.error('No documents found.');
      const confirm = window.confirm('That item is not in pantry');
      if (!confirm) {
          return;
      }
      return { error: 'No documents found.' };
    }

    setPantry(documents);

  } catch (error) {
    console.error('Error searching documents:', error);
    return { error: 'Something went wrong.' };
  }
//   try {
//     const user = firebase.auth().currentUser;
//     if (!user) {
//       console.error('User not authenticated.');
//       return { error: 'User not authenticated.' };
//     }

//     // const collectionRef = firebase.firestore().collection("pantry");
//     const collectionRef = collection(firestore, "pantry");

//     console.log(`Searching for documents with item: ${item}`);

//     // Fetch all documents and filter client-side
//     const querySnapshot = await getDocs(collectionRef);

//     // console.log(querySnapshot);

//     if (querySnapshot.empty) {
//       console.error('No documents found.');
//       return { error: 'No documents found.' };
//     }

//     const documents = querySnapshot.docs
//     .map(doc => doc.data())
//     .filter(doc => doc.id && doc.id.toLowerCase().includes(item.toLowerCase()));
  
//  // console.log(querySnapshot.docs);

//     console.log('Found  document: ', documents);

//     if (documents.length === 0) {
//       console.error('No documents found.'); //+++
//       return { error: 'No documents found.' };
//     }

//     setPantry(documents);

//   } catch (error) {
//     console.error('Error searching documents:', error);
//     return { error: 'Something went wrong.' };
//     }

 };


  async function check() {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve({ success: true, user: user, message: 'User is logged in.' });
        } else {
          resolve({ success: false, message: 'No user is logged in.' });
        }
      }, (error) => {
        console.error(error);
        reject({ error: 'Something went wrong.' });
      });
    });
  }


  useEffect(() => {
    const checkAuth = async () => {
      const res = await check()
      const data = res;
      if (!data.success) {
        router.push('/SignIn')
      }
      updatePantry();
    };
    checkAuth();
  }, [])


  const removeAllItems = async () => {
    try {
      const user = firebase.auth().currentUser;
    if (!user) {
      console.error('User not authenticated.');
      return { error: 'User not authenticated.' };
    }

      const querySnapshot = await getDocs(collection(firestore, "pantry"));
      const batch = firestore.batch();
  
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
      console.log("All items removed from pantry");
    } catch (error) {
      console.error("Error removing items:", error);
    }
    await updatePantry()
  }

  // Removes all items from firebase table based on itemName
  const removeItembyName = async (item) => {
    try{
      // const user = firebase.auth().currentUser;
      // if (!user) {
      //   console.error('User not authenticated.');
      //   return { error: 'User not authenticated.' };
      // }
    const docRef = doc(collection(firestore, 'pantry'), item)  
        await deleteDoc(docRef)

      console.log(`Item ${item} removed from pantry`);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    await updatePantry()
  }


  return (
  <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection={'column'} gap={2} overflow={"hidden"}>
          <Header />


        <Box display= {'flex'} gap={1}>
        <TextField
            id="search"
            label="Search Pantry"
            variant='outlined'
            sx={{ width: '80%' }}
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant='contained' 
          // onClick={() => search(document.getElementById('search').value)}
          onClick={() => search(searchQuery)}

          >
            <SearchRounded />
          </Button>
      </Box>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">

        {/* Add Item Box */}
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2} >
            <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value) } />
            
            <Button variant="outlined"
             onClick={() => {addItem(itemName); setItemName(''); handleClose(); }}>Add 
            </Button>
          </Stack>
        </Box>
      </Modal>

<Box display="flex" justifyContent="center" alignItems="center" flexDirection={'row'} gap={2} >
      <Button variant="contained" onClick={handleOpen}> Add item to Pantry</Button>
      <Button variant="contained" onClick={() => removeAllItems()}> Remove all Pantry Items</Button>
</Box>


    <Box width="55%" height="60%" border="1px solid black" overflow={'auto'}>
    
      {/* Pantry Header Box */}
      <Box width="800px" heigth="500px" bgcolor={'#ADD8E6'} position="sticky" top={0} zIndex={1} // Ensure it's above other content
      >
        <Typography variant={'h2'} textAlign={'center'} color={'#333'}>
            Pantry Items
        </Typography> 
      </Box>


        <Stack width="800px" heigth="500px" spacing ={2} overflow={'auto'}>

      {pantry.map(({name, count}) => (

      <Box key={name} width="100%" minHeight="150px" display= {'flex'} justifyContent={'space-between'} paddingX={5} alignItems={'center'} bgcolor={'#f0f0f0'}>
        
        <Typography variant={'h3'} textAlign={'center'} color={'#333'}>
        {
          //capitalize first letter of text
          name.charAt(0).toUpperCase() + name.slice(1)
        }
        </Typography>
        <Typography variant={'h3'} textAlign={'center'} color={'#333'}> Quantity : {count} </Typography>

        <Button variant="contained" label="decrease" onClick={() => {removeItem(name); handleClose(); }}> <Tooltip title="Decrease item quantity"><RemoveCircleIcon /> </Tooltip> 
        </Button>

        <Button variant="contained" label="remove item" onClick={() => {removeItembyName(name); handleClose(); }}> <Tooltip title="Remove item">  <DeleteForeverSharpIcon /> </Tooltip>
        </Button>

        
      </Box>


      ))}
      </Stack>

    </Box>
      
    <Box bgcolor={'lightblue'} padding={"20px"} textAlign={'center'} bottom={0} position={'absolute'} width={'100%'}>
          My Pantry © 2024 | All rights reserved.
        </Box>

  </Box>
    
  );
}
