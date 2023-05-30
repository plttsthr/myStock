import swal from 'sweetalert';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signOut, sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";
import {auth, storage, db} from "../Model/firebase"; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setDoc, doc, updateDoc, deleteDoc, arrayRemove } from 'firebase/firestore';
import { collection, addDoc, getDoc, getDocs } from 'firebase/firestore';

// Cambios por hacer: quitar los swal del controller y ponerlos en el view
class Controller{
    constructor(auth){
        this.auth = auth;
        this.authUser = null;
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user);
                this.authUser = user;
            } else {
                console.log("user null");
                this.authUser = null;
            }
        });
    }

    // sends verification email to the user
    verifyEmail(){
        sendEmailVerification(this.authUser)
        .then( () => {
            swal("Email Verification Sent","Check your email and click the link we sent to continue.","success");
        })
        .catch( (error) => {

            
            switch (error.message) {
                case "Cannot read properties of null (reading 'getIdToken')":
                    swal("User already exists", "Use another email","error");
                    break;
            
                default:
                    // When this happen we should put an extra button to send the verification again!!!!
                    swal("Could not send verification email", "Try sending it again.","error");
                    break;
            }
        });
    };

    // password security checks
    passValidation(p1, p2){
    
        if (p1 !== p2){ // Check the 2 password boxes
          swal("Error", "Passwords did not match. Try Again", "error")
          return false;
        }
    
        let regx = /^(?=.*[!@#?])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*\s).{8,16}$/;
        
        if ( p1.match(regx) ){ // contains all required characters
          return true;
        }
        else{ // Does not contain all characters
          swal("Error", "Password does not meet the requirements. Try Again", "error")
          return false;
        }
    };

    // Creates user in the authentication service with the email and password chosen
    // after creation, user is sent verification email
    emailVerifyProcedure(email, password, confirmPassword){
        if ( this.passValidation(password, confirmPassword) ){
            createUserWithEmailAndPassword(this.auth, email, password)
            .then( (userCredential)=>{
                // User was added to authentication service with email and password
                console.log(this.authUser);
                this.verifyEmail();
            }).catch( error => {
                //console.log(error.message);
                if (error.message === "Firebase: Error (auth/email-already-in-use)." ){
                    // work later on sending more verification email if necessary
                    console.log("sending verification again");
                    this.verifyEmail();
                }
            });    
        }   
    };

    // Helper function to check a user's status
    async checkCurrentUserStatus(){
        // Create a promise so that currentUser can be created
        await new Promise((resolve) => {
            const checkUser = setInterval(() => {
                if (this.auth.currentUser != null) {
                    clearInterval(checkUser);
                    resolve();
                }
            // Check every 100 miliseconds
            }, 100);
        });

        // Destructing uid from auth.currentUser object (extract field from object)
        const { uid } = this.auth.currentUser;
        return uid;
    }

    // Grab users information from Firestore 
    async grab_user_info(grab_items){    
        // Wait until currentUser is valid and grab user ID
        const uid = await this.checkCurrentUserStatus();

        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        // Grab that item from the userID object
        for( let i = 0; i < grab_items.length; i++ ) {
            // Check for user_item in array
            grab_items[i] = docSnap.data()[grab_items[i]];
        }
        return grab_items;
    }

    // Grab users image from Storage 
    async grab_user_picture(pictureType){
        // Wait until currentUser is valid   
        const uid = await this.checkCurrentUserStatus();
        const image = 'users/'+uid+'/pictures/'+pictureType+'.jpg';
        const reference = ref(storage, image);

        // Create URL from reference
        await getDownloadURL(reference).then((url) => {
            pictureType = url;
        });

        // Return URL
        return pictureType;
    }

    // Checks if the state of the user's email verification status is set to true
    async checkEmailVerification(){
        // reload state of user instance attributes before checking if the email is verified.
        await this.authUser.reload()

        if ( this.authUser.emailVerified ){ 
            swal("Email verification succesful", "Now you can continue to signup.", "success");
            return true;
        }
        else{
            swal("Verify your email", "Once it is verified you will be allowed to continue.","warning");
            return false;
        }
    }

    async emailVerifyNext(){

        if( this.authUser && await this.checkEmailVerification()) { // null or object containing user information
            return true;
        }
        else{ 
            swal("Email not verified", "You must verify your email to proceed", "warning")
            return false;
        }
    }

    sendPassReset(email){
        sendPasswordResetEmail(this.auth, email)
        .then(() => {
            swal("Check your Inbox", "Password reset link sent to email!", "success");
            return true
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            swal("Ohh noo", "Error sending password reset link.", "error");
            return false
        });
    }

    async loginUser(email, password){
        try{
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
            return true;
        }
        catch( error ){
            return false;
        }
    }

    userSignOut(){
        signOut(this.auth)
        .then( () => { console.log("Signed out succesfully.") } )
        .catch( error => console.log(error) )
    }

    // puts profile specified picture into storage
    async uploadImage( namePicture, handletoPicture ){ 
        // Grab a reference to the location where we want to upload the image
        const imageRef = ref( storage, 'users/'+ this.authUser.uid +'/pictures/'+ namePicture+'.jpg');
        // Function uploadBytes returns a promise
        return await uploadBytes( imageRef, handletoPicture );
    };

    async submitData( path, payload ){
        // Grab a reference to the "users collection", with new field called "unknown"
        const docReference = doc(db, path, this.authUser.uid)
          
        // Set new data into database
        return await setDoc(docReference, payload);
    }

    async submitDataRandId( path, payload ){
        const col = collection(db, path);
        return await addDoc( col, payload);
    }

    async updateField( path, payload ){
        const docRef = doc(db, path);
        return await updateDoc(docRef, payload);
    }


    async deleteAccount( account ){
        return await this.submitDataRandId( "accountRequests", {action: "delete", account: account, userId: this.authUser.uid} );
    }

    async deleteProfile(){
        const userRef = doc(db, `users/${this.authUser.uid}`);
        await deleteDoc( userRef );
    }

    async addAccount( currency ){
        return await this.submitDataRandId( "accountRequests", {action: "create", currency: currency, userId: this.authUser.uid} );
    }

    async fundAccount( account, amount ){
        return await this.submitDataRandId( "accountRequests", {action: "fund", account: account, amount: Number(amount), userId: this.authUser.uid} );
    }

    async transferAccounts(fromAcc, toAcc, amount){

        return await this.submitDataRandId( "accountRequests", {action: "transfer", srcAcc: fromAcc, destAcc: toAcc, amount: Number(amount)} );
        
    }

    async getBalance( msnumber ){
        // Wait until currentUser is valid and grab user ID
        const uid = await this.checkCurrentUserStatus();

        const docRef = doc(db, 'accounts', msnumber);
        const docSnap = await getDoc(docRef);

        console.log("Account Data:", docSnap.data() );

        // returns an array containing [currency, funds]
        return [docSnap.data().currency, docSnap.data().funds]

    }

    // adds all member information and pictures into the database.
    async addMember(imagePath, idFilePath, path, payload){
        let sts = true;
        await this.submitData(path, payload).catch(()=>{sts=false;});
        await this.uploadImage("profilePicture",imagePath).catch(()=>{sts=false;});
        await this.uploadImage("IDpicture", idFilePath).catch(()=>{sts=false;});
        // now it is done through a firebase cloud function in the backend
        //await this.sendEmail(this.authUser.email, "Welcome to my Stock App", "We hope you enjoy our service!");
        // sign out user's session
        this.userSignOut();
        
        // could be more subtle in the future and return the type of error to the view
        return sts;
    }

    async getStocksInfo(){

        const querySnapshot = await getDocs(collection(db, "stocks"));
        this.info = []
        var stocks = this;
        querySnapshot.forEach((doc) => {
        stocks.info.push(doc.data())
        });

    console.log(stocks.info);
    return stocks.info;
   }

   // Get Image out of a specific path
   async getImage( path ){

    // Wait until currentUser is valid  
    const uid = await this.checkCurrentUserStatus();
    const image = path;
    const reference = ref(storage, image);
    this.url = null;
    var pic = this;
    
    // Create URL from reference
    await getDownloadURL(reference).then((url) => {
    pic.url = url;
    });

    // Return URL
    return pic.url;
    }
}

export default Controller;