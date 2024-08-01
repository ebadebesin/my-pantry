"use client"

import { Box, Typography, Button, Modal, TextField } from "@mui/material";
import { Stack } from "@mui/material";

// import { firestore } from "@/firebase";

// import { getAuth, onAuthStateChanged } from 'firebase/auth';

import firebase from '@/firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { collection, query, doc, getDocs, setDoc, deleteDoc, getDoc, where} from "firebase/firestore"; 
import { useEffect, useState } from "react";

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
  const [searchResults, setSearchResults] = useState([]);


////////////// Update function  
  // const updatePantry = async() => {
  //   const snapshot = query(collection(firestore, 'pantry'))
  //   const docs = await getDocs(snapshot)
  //   const pantryList = []
  //   docs.forEach((doc) => {
  //     pantryList.push({name: doc.id, ...doc.data()})
  //   });
  //   console.log(pantryList);
  //   setPantry(pantryList)
  // }

  // useEffect(() => {
  //   updatePantry()
  // },[])

  const updatePantry = async() => {
    try {
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
    const docRef = doc(collection(firestore, 'pantry'), item)
    //check if exist
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1}) 
    } else {
      await setDoc(docRef, {count: 1})
    }
    await updatePantry()
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


 ////////// // Search Function
  const searchItem = async (item) => {
    try {
      if (!item) {
        // No search term, fetch all items
        console.log('no item found');
        return await updatePantry();
      }
  
      const q = query(collection(firestore, 'pantry'), where("name", ">=", item)); // Use "name" field for searching items
      const docSnap = await getDocs(q);
      const docs = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Find the exact match for the search term
      const exactMatch = docs.find(items => items.name.toLowerCase() === items.toLowerCase());
  
      // Update search results, prioritizing the exact match
  setSearchResults(exactMatch ? [exactMatch].concat(docs.filter(item => item !== exactMatch)) : docs.filter(item => item !== exactMatch));
  console.log('found item');
    } catch (error) {
      console.error("Error searching documents:", error);
    }
    await updatePantry()
  }


  // Removes all items from firebase table based on itemName
  // const removeAllItems = async (item) => {
  //   const docRef = doc(collection(firestore, "pantry"), item);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     await deleteDoc(docRef);
  //   }
  //   await updateInventory();
  // }



  return (
  <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection={'column'} gap={2} overflow={"hidden"}>
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

      <Button variant="contained" onClick={handleOpen}> Add item</Button>


    <Box width="55%" height="60%" border="1px solid black" overflow={'auto'}>
    
      {/* Pantry Header Box */}
      <Box width="800px" heigth="500px" bgcolor={'#ADD8E6'}>
        <Typography variant={'h2'} textAlign={'center'} color={'#333'}>
            Pantry Items
        </Typography> 
      </Box>

      {/* Search box */}
      <Box width="800px" heigth="500px" display={'flex'} paddingX={5} alignItems={'center'} bgcolor={'#f0f0f0'} justifyContent={'space-between'}>
        <TextField
          id="outlined-basic"
          label="Search Pantry"
          variant="outlined"
          fullWidth
          value={itemName}
          onChange={(e) => setItemName(e.target.value)} // Update itemName state
        />
        <Button variant="contained" onClick={() => searchItem(itemName)}>
          Search
        </Button>
      </Box>


      {/* Pantry Item Stack */}

      {searchResults.length > 0 ? (


      <Stack width="800px" heigth="500px" spacing ={2} overflow={'auto'}>

      {searchResults.map(({name, count}) => (       

      // {pantry.map(({name, count}) => (

      <Box key={name} width="100%" minHeight="150px" display= {'flex'} justifyContent={'space-between'} paddingX={5} alignItems={'center'} bgcolor={'#f0f0f0'}>
        
        <Typography variant={'h3'} textAlign={'center'} color={'#333'}>
        {
          //capitalize first letter of text
          name.charAt(0).toUpperCase() + name.slice(1)
        }
        </Typography>
        <Typography variant={'h3'} textAlign={'center'} color={'#333'}> Quantity: {count} </Typography>

        <Button variant="contained" onClick={() => {removeItem(name); handleClose(); }}>Remove</Button>
        
      </Box>


      ))}
      </Stack>

      ) : ( 

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

        <Button variant="contained" onClick={() => {removeItem(name); handleClose(); }}>Remove</Button>
        
      </Box>


      ))}
      </Stack>

      )}

    </Box>
      

  </Box>
    
  );
}
