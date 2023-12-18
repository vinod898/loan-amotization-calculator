import { GoogleAuthProvider, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../Config/firebase-config';
import { User as Person } from '../Domain/user'

export const signInUser = async (person: Person) => {
try {
    const userCredential:UserCredential = await signInWithEmailAndPassword(auth, person.email, person.password);
    const fireBaseUser: User = userCredential?.user;
    if (fireBaseUser?.uid) {
        person.id = fireBaseUser.uid;
        person.firstName = fireBaseUser.displayName?.split(' ')[0]??'';
        person.lastName = fireBaseUser.displayName?.split(' ')[1]??'';
    }
} catch (error: any) {
    // Handle errors here
    const errorCode = error?.code;
    const errorMessage = error?.message;
    console.error('AuthService ::Error signingin user:', errorCode, errorMessage);
}

return person;
}

export const signUpUser = async (person: Person) => {
    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, person.email, person.password);
        const fireBaseUser: User = userCredential?.user;
        if (fireBaseUser?.uid) {
            person.id = fireBaseUser.uid;
            await updateProfile(fireBaseUser, {
                displayName: `${person.firstName} ${person.lastName}`, photoURL: "https://example.com/jane-q-user/profile.jpg"
            });
            console.log('AuthService :: created successfully....')
        }
    } catch (error: any) {
        // Handle errors here
        const errorCode = error?.code;
        const errorMessage = error?.message;
        console.error('AuthService ::Error updating user:', errorCode, errorMessage);
    }

    return person;
}



export const signInWithGoogle = async () => {
    const person:Person = {} as Person;
    try {
      const provider = new GoogleAuthProvider();
      const userCredential: UserCredential = await signInWithPopup(auth, provider);
      const fireBaseUser: User = userCredential?.user;
  
      if (fireBaseUser?.uid) {
        // Perform any necessary actions after Google sign-in
        // For example, retrieve user information and handle it accordingly
        const { displayName, email,uid, photoURL } = fireBaseUser;
        person.id = uid;
        person.firstName = displayName?.split(' ')[0]??'';
        person.lastName = displayName?.split(' ')[1]??'';
        person.email = email||'';
        person.photoURL = photoURL||'';

        console.log('Google Sign-In successful:', displayName, email);
      }
    } catch (error: any) {
      // Handle errors here
      const errorCode = error?.code;
      const errorMessage = error?.message;
      console.error('AuthService ::Error signing in with Google:', errorCode, errorMessage);
    }
    return person;
  };
