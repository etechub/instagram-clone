import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { db, storage } from '../config';

export default function CreateModal({ show, setShow }) {
    const user = {id: 'elkwfjs2390we', username: 'dev_ahmed'}
    const [progress, setProgress] = useState('')
    const [selectedFile, setSelectedFile] = useState()
    const [caption, setCaption] = useState()

    const handleSubmit = async () => {
        // console.log(selectedFile, caption)
        const metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'posts/' + user.id + '/'+ selectedFile.name);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                setProgress(`uploading... ${progress.toFixed()}%`)

                // switch (snapshot.state) {
                //     case 'paused':
                //         console.log('Upload is paused');
                //         break;
                //     case 'running':
                //         console.log('Upload is running');
                //         break;
                //     default:
                //     // do nothing
                // }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
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
                    console.log('File available at', downloadURL);
                    await addDoc(collection(db, "posts"), {
                        username: user.username,
                        userId: user.id,
                        profile_pic_url: '',
                        mainImage: downloadURL,
                        caption,
                        date: new Date().toLocaleDateString()
                    });
                    setCaption('')
                    setSelectedFile()
                    setProgress('')
                    setShow(false)
                });
            }
        );
    }

    return (<>
        {show && <div className={`fixed top-0 left-0 w-full h-screen`}>
            <div className="w-full h-full bg-[rgba(0,0,0,0.5)] relative" onClick={() => setShow(false)}>
                <FaTimes className="absolute top-10 right-10 text-white cursor-pointer" onClick={() => setShow(false)} />
            </div>
            <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 text-white">
                <div className="w-[450px] bg-[#262626] text-white rounded-lg">
                    <div className="border-b border-gray-600 text-center py-4 font-bold">Create new post</div>
                    <div className="h-[480px] flex flex-col justify-center items-center">
                        {selectedFile ? <img src={URL.createObjectURL(selectedFile)} alt="" className='w-[80px] h-[80px] rounded-lg' /> : <svg aria-label="Icon to represent media such as images or videos" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><title>Icon to represent media such as images or videos</title>
                            <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path>
                        </svg>}
                        <div className="font-bold mt-10">
                            <label htmlFor="file" className='w-32 h-14 bg-blue-600 text-white rounded-lg py-3 px-5 cursor-pointer'>Choose file</label>
                            <input type="file" id="file" className='hidden' onChange={e => setSelectedFile(e.target.files[0])} />
                        </div>
                        <div className="">
                            <textarea placeholder='enter caption' className='resize-none w-[350px] bg-transparent mx-auto h-20 mt-10 rounded-lg px-4 py-1 border border-gray-600' onChange={(e) => setCaption(e.target.value)}></textarea>
                        </div>

                        <div className="text-center">{progress}</div>

                        <button className='w-32 h-12 mt-10 bg-blue-600 text-white rounded-lg py-3 px-5 cursor-pointer' onClick={handleSubmit}>Post</button>
                    </div>
                </div>
            </div>
        </div>}
    </>)
}
