
// Import the necessary Firebase SDK modules
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Reference to the Firestore collection for contacts
const contactsCollection = admin.firestore().collection('contacts');

// Create a new contact
exports.createContact = functions.https.onRequest(async (req, res) => {
  try {
    const newContact = req.body;
    const contactRef = await contactsCollection.add(newContact);
    const contactId = contactRef.id;
    const contact = await contactRef.get();
    res.status(201).json({id:contactId, ...contact.data()});
  } catch (error) {
    res.status(500).send('Error creating contact');
  }
});

// Read all contacts
exports.getContacts = functions.https.onRequest(async (req, res) => {
  try {
    const contactsSnapshot = await contactsCollection.get();
    const contacts = contactsSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).send('Error retrieving contacts');
  }
});

// Update a contact
exports.updateContact = functions.https.onRequest(async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const updatedContact = req.body;

    await contactsCollection.doc(contactId).update(updatedContact);
    res.status(200).send('Contact updated successfully');
  } catch (error) {
    res.status(500).send('Error updating contact');
  }
});

// Delete a contact
exports.deleteContact = functions.https.onRequest(async (req, res) => {
  try {
    const contactId = req.params.contactId;
    await contactsCollection.doc(contactId).delete();
    res.status(200).send('Contact deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting contact');
  }
});

// Search contacts by name
exports.searchContacts = functions.https.onRequest(async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const querySnapshot = await contactsCollection.where('name', '>=', searchTerm).get();
    const contacts = querySnapshot.docs.map((doc) => doc.data());
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).send('Error searching contacts');
  }
});


//Auth Functions 

// function to create a user
exports.addUser = functions.auth.user().onCreate((user)=>{
  console.log(`${user.email} has been created...`)
  return Promise.resolve
})


// function to delete a user
exports.delUser = functions.auth.user().onDelete((user)=>{
  console.log(`${user.email} has been deleted...`)
  return Promise.resolve
})

