import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { FaTimes, FaUser } from 'react-icons/fa';
import { auth, db, storage } from '../config';

export default function AuthModal({ showAuth, setShowAuth }) {
    const [tab, setTab] = useState(0)
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')
    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState('')

    const handleLogin = async () => {
        await signInWithEmailAndPassword(auth, email, password)
        setShowAuth(false)
    }

    const handleSubmit = async () => {
        if (password !== cPassword) return alert('Your password must be the same');

        if (email && password && userName) {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Signed in 
                    const user = userCredential.user;

                    console.log(user);

                    if (user) {
                        await updateProfile(auth.currentUser, {
                            displayName: userName
                        })
                        await setDoc(doc(db, "users", auth.currentUser.uid), {
                            userId: auth.currentUser.uid,
                            displayName: userName,
                            createAt: Timestamp.fromDate(new Date())
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    alert(error.message)
                });
        } else {
            alert('pls fill required fields')
        }
        console.log('sdlfk');
        if (file && auth?.currentUser) {
            const metadata = {
                contentType: 'image/jpeg'
            };
            const storageRef = ref(storage, 'profiles/');
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    setProgress(`uploading... ${progress.toFixed()}%`)
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            console.log(`User doesn't have permission to access the object`);
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            console.log(`User canceled the upload`);
                            break;

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            console.log(`Unknown error occurred, inspect error.serverResponse`);
                            break;

                        default:
                        // do nothing
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        // console.log('File available at', downloadURL);
                        if (downloadURL) {
                            await updateProfile(auth.currentUser, {
                                photoURL: downloadURL
                            })
                            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                                photoURL: downloadURL
                            }).catch(err => {
                                console.log(err);
                            });
                            setEmail('')
                            setFile()
                            setProgress('')
                            setShowAuth(false)
                        }

                    });
                }
            );
        } else {
            setEmail('')
            setFile()
            setProgress('')
            setTimeout(() => {
                setShowAuth(false)
            }, 300);
        }

    }

    return (<>
        {showAuth && <div className={`fixed top-0 left-0 w-full h-screen`}>
            <div className="w-full h-full bg-[rgba(0,0,0,0.5)] relative" onClick={() => setShowAuth(false)}>
                <FaTimes className="absolute top-10 right-10 text-white cursor-pointer" onClick={() => setShowAuth(false)} />
            </div>
            <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 text-white">
                <div className="w-[300] md:w-[450px] px-4 bg-[#262626] text-white rounded-lg">
                    <div className="border-b border-gray-600 text-center py-4 font-bold flex gap-3 justify-center">
                        <div className={`py-2 px-4 rounded-lg ${tab === 0 && "bg-blue-600"}`}
                            onClick={() => setTab(0)}>Login</div>

                        <div className={`py-2 px-4 rounded-lg ${tab === 1 && "bg-blue-600"}`}
                            onClick={() => setTab(1)}>Signup</div>
                    </div>

                    {tab === 0 ?
                        <div className="h-[520px] flex flex-col justify-center items-center">
                            <div className="grid place-items-center w-[60px] h-[60px] rounded-full bg-blue-600 mb-3">
                                <FaUser size={40} />
                            </div>
                            <div className="">
                                <input type="email" placeholder='enter email' className='resize-none w-[280px] md:w-[350px] bg-transparent mx-auto h-10 rounded-lg px-4 py-1 border border-gray-600' required onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="">
                                <input type="password" placeholder='enter password' className='resize-none w-[280px] md:w-[350px] bg-transparent mx-auto h-10 mt-5 rounded-lg px-4 py-1 border border-gray-600' required onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <button className='w-[10rem] h-12 mt-5 bg-blue-600 text-white rounded-lg py-3 px-5 cursor-pointer' onClick={handleLogin}>{progress && progress !==
                                '100%' ? 'creating...' : 'Login'}</button>
                        </div> :
                        <div className="h-[520px] flex flex-col justify-center items-center">
                            {file ? <img src={URL.createObjectURL(file)} alt="" className='w-[60px] h-[60px] rounded-full' /> :
                                <div className="grid place-items-center w-[60px] h-[60px] rounded-full bg-blue-600">
                                    <FaUser size={40} />
                                </div>
                            }
                            <div className="font-bold my-6">
                                <label htmlFor="file" className='w-full bg-blue-600 text-white rounded-lg py-3 px-3 cursor-pointer flex flex-col md:flex-row gap-2 text-center'><span>Choose profile picture</span> <span>(Optional)</span></label>
                                <input type="file" id="file" className='hidden' onChange={e => setFile(e.target.files[0])} />
                            </div>
                            <div className="">
                                <input type="email" placeholder='enter email' className='resize-none w-[280px] md:w-[350px] bg-transparent mx-auto h-10 rounded-lg px-4 py-1 border border-gray-600' required onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="">
                                <input type="password" placeholder='enter password' className='resize-none w-[280px] md:w-[350px] bg-transparent mx-auto h-10 mt-5 rounded-lg px-4 py-1 border border-gray-600' required onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="">
                                <input type="password" placeholder='confirm password' className='resize-none w-[280px] md:w-[350px] bg-transparent mx-auto h-10 mt-5 rounded-lg px-4 py-1 border border-gray-600' required onChange={(e) => setCPassword(e.target.value)} />
                            </div>
                            <div className="">
                                <input type="text" placeholder='enter username' className='resize-none w-[280px] md:w-[350px] bg-transparent mx-auto h-10 mt-5 rounded-lg px-4 py-1 border border-gray-600' required onChange={(e) => setUserName(e.target.value)} />
                            </div>

                            <div className="text-center">{progress}</div>

                            <button className='w-[10rem] h-12 mt-5 bg-blue-600 text-white rounded-lg py-3 px-5 cursor-pointer' onClick={handleSubmit}>{progress && progress !==
                                '100%' ? 'creating...' : 'Create Account'}</button>
                        </div>
                    }
                </div>
            </div>
        </div>}
    </>)
}
