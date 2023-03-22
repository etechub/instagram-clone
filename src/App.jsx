import './App.css';
import { useEffect, useState } from 'react';
import img1 from './img/hello.png';
import img2 from './img/profile.jpg';
import { AiOutlineHome } from 'react-icons/ai';
import { HiOutlineSearch } from 'react-icons/hi';
import { MdOutlineExplore } from 'react-icons/md';
import { BsBookmark, BsCameraReels } from 'react-icons/bs';
import { BiMessageSquareAdd } from 'react-icons/bi';
import { TbMessageShare } from 'react-icons/tb';
import { FiHeart, FiMoreHorizontal } from 'react-icons/fi';
import { FaBars, FaRegComment, FaUser } from 'react-icons/fa';
import { SlPaperPlane } from 'react-icons/sl';
import CreateModal from './components/createModal';
import AuthModal from './components/authModal';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from './config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { CiLogin, CiLogout, CiSearch } from 'react-icons/ci'
import Story from './components/Story';

function App() {
    const [show, setShow] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user)
        })
    }, [])

    useEffect(() => {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, orderBy('date', 'desc'), limit(20));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // console.log(querySnapshot);
            if (!querySnapshot.empty) {
                const list = [];
                querySnapshot.docs.forEach((doc) => {
                    var r = { ...doc.data(), id: doc.id };
                    r && list.push(r);
                });
                setPosts(list);
            }
            //  && setPosts(querySnapshot.docs)
        });
        return unsubscribe;
    }, []);

    const truncateString = (str, limit) => {
        if (str.length <= limit) {
            return str;
        }
        return str.slice(0, limit) + '...';
    };

    return (
        <>
            <div className="h-screen md:grid md:grid-cols-[1fr_5fr] w-full text-white bg-black ">
                <div className="relative h-screen overflow-auto hidden md:flex flex-col lg:inline-grid gap-2 bg-black w-64 pr-1 border-r border-gray-600">
                    <div className="pt-4 h-24 w-48">
                        <img src={img1} layout="fill" objectFit="contain" alt="" />
                    </div>
                    <div className="ml-12 flex flex-col gap-8">
                        <div className="flex items-center text-base gap-3">
                            <AiOutlineHome size={25} color="white" />
                            <h1>Home</h1>
                        </div>
                        <div className="flex items-center text-base gap-3">
                            <HiOutlineSearch size={25} color="white" />
                            <h1>Search</h1>
                        </div>
                        <div className="flex items-center text-base gap-3">
                            <MdOutlineExplore size={25} color="white" />
                            <h1>Explore</h1>
                        </div>
                        <div className="flex items-center text-base gap-3">
                            <BsCameraReels size={25} color="white" />
                            <h1>Reels</h1>
                        </div>
                        <div className="flex items-center text-base gap-3">
                            <div className="relative">
                                <FiHeart size={25} color="white" />
                                <sup className="absolute left-4 bg-red-500 rounded-full top-0 w-1 p-[6px]"></sup>
                            </div>
                            <h1>Notification</h1>
                        </div>
                        <div className="flex items-center text-base gap-3">
                            <TbMessageShare size={25} color="white" />
                            <h1>Message</h1>
                        </div>
                        <div className="text-base">
                            <div
                                className="flex items-center gap-3 w-fit cursor-pointer"
                                onClick={() => {
                                    user ? setShow(true) : setShowAuth(true)
                                }}
                            >
                                <BiMessageSquareAdd size={25} color="white" />
                                <h1>Create</h1>
                            </div>
                        </div>
                        {user ? <>
                            <div className="flex items-center text-base gap-3" title={user?.displayName}>
                                <div className="relative">
                                    <img
                                        src={user?.photoURL}
                                        alt=""
                                        className="rounded-full w-8 h-8"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                                <h1>Profile</h1>
                            </div>
                            <div className="flex items-center cursor-pointer text-base gap-3"
                                onClick={() => {
                                    signOut(auth).then(() => {
                                        // Sign-out successful.
                                    }).catch((error) => {
                                        console.log(error);
                                        // An error happened.
                                    });
                                }}
                            >
                                <CiLogout size={25} color="red" />
                                <h1>Logout</h1>
                            </div>
                        </> :
                            <div className="flex items-center text-base gap-3" onClick={() => setShowAuth(true)}>
                                <CiLogin size={25} color="green" />
                                <h1>Login</h1>
                            </div>
                        }
                    </div>

                    <div className="left-0 bottom-6 flex justify-start pl-12 items-center text-base">
                        <div className="flex gap-3">
                            <FaBars size={25} color="white" />
                            <h1>More</h1>
                        </div>
                    </div>
                </div>
                <div className="h-screen overflow-auto px-4 md:p-8 flex flex-col items-center">
                    <div className=' md:hidden sticky top-0 pb-4 flex bg-black'>
                        <div className='relative mt-4 h-8 w-18'>
                            <img src={img1} layout="fill" objectFit="contain" alt='' />
                        </div>
                        <div className=' mt-4 flex gap-3 items-center inset-y-0 h-12 pl-3 bg-gray-900 sm:text-sm  border-gray-300 pointer-events-none '>
                            <CiSearch className='h-5 w-5 text-gray-500' />
                            <input type="text" className='bg-transparent' placeholder='search' />
                        </div>
                        <div className="relative pl-2 pt-6">
                            <FiHeart size={25} color="white" />
                            <sup className="absolute left-6 mt-6 bg-red-500 rounded-full top-0 w-1 p-[6px]"></sup>
                        </div>
                    </div>
                    <div className="md:max-w-[500px] mx-auto">
                        <Story />

                        <div className="mt-5 flex flex-col mb-12 gap-6">
                            {posts.length > 0 &&
                                posts.map((post) => {
                                    // console.log(post);
                                    return (
                                        <div key={post.id} className="">
                                            <div className="border border-gray-600 rounded-t-lg flex justify-between items-center py-3 px-4">
                                                <div className="flex gap-4">
                                                    {post?.profile_pic_url ? <img
                                                        src={post?.profile_pic_url}
                                                        layout="fill"
                                                        objectFit="contain"
                                                        alt=""
                                                        className="w-[30px] h-[30px] rounded-full"
                                                    /> :
                                                        <div className="grid place-items-center w-[30px] h-[30px] rounded-full bg-blue-600"
                                                            style={{
                                                                background: 'rgb(216, 221, 19)',
                                                                backgroundImage:
                                                                    'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                                            }}>
                                                            <FaUser size={18} />
                                                        </div>
                                                    }
                                                    <div className="">{post?.username}</div>
                                                </div>
                                                <FiMoreHorizontal
                                                    data-te-ripple-init
                                                    size={20}
                                                    data-te-ripple-color="light"
                                                    className="shadow-md transition duration-150 ease-in-out cursor-pointer"
                                                />
                                            </div>

                                            <div className="">
                                                <img
                                                    src={post.mainImage}
                                                    // layout="fill"
                                                    // objectFit="contain"
                                                    alt=""
                                                    className="w-[300px] md:w-[500px] mx-auto h-fit max-h-[500px]"
                                                />
                                            </div>
                                            <div className="border border-gray-600 rounded-b-lg py-4 px-4">
                                                <div className="flex justify-between">
                                                    <div className="flex gap-5">
                                                        <FiHeart size={20} />
                                                        <FaRegComment size={20} />
                                                        <SlPaperPlane size={20} />
                                                    </div>

                                                    <BsBookmark size={20} />
                                                    {/* <BsFillBookmarkFill size={20} color='white' /> */}
                                                </div>

                                                <div className="py-4">3,000 likes</div>

                                                <div className="">
                                                    {truncateString(post?.caption, 100)}
                                                </div>

                                                <div className="py-4 text-gray-400">
                                                    View all 400 comments
                                                </div>

                                                <div className="text-gray-400 text-xs">
                                                    {post.date.toDate().toDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>


                        <div className='flex gap-3 justify-evenly p-4 w-full fixed left-0 bottom-0 md:hidden bg-black'>
                            <div className='flex items-center text-base gap-3 cursor-pointer'
                                onClick={() => {
                                    // user ? setShow(true) : setShowAuth(true)
                                }}>
                                <AiOutlineHome size={25} color='white' />
                            </div>
                            {/* <div className='flex items-center text-base gap-3 cursor-pointer'>
                                <HiOutlineSearch size={25} color='white' />
                            </div> */}
                            {/* <div className='flex items-center text-base gap-3 cursor-pointer'>
                                <MdOutlineExplore size={25} color='white' />
                            </div> */}
                            <div className='flex items-center text-base gap-3 cursor-pointer'
                                onClick={() => {
                                    user ? setShow(true) : setShowAuth(true)
                                }}>
                                <BsCameraReels size={25} color='white' />
                            </div>
                            <div className='flex items-center text-base gap-3 cursor-pointer'
                                onClick={() => {
                                    user ? setShow(true) : setShowAuth(true)
                                }}>
                                <div className='relative'>
                                    <FiHeart size={25} color='white' />
                                    <sup className='absolute left-4 bg-red-500 rounded-full top-0 w-1 p-[6px]'></sup>
                                </div>
                            </div>
                            <div className='flex items-center text-base gap-3 cursor-pointer'
                                onClick={() => {
                                    user ? setShow(true) : setShowAuth(true)
                                }}>
                                <TbMessageShare size={25} color='white' />
                            </div>
                            <div className='flex items-center text-base gap-3 cursor-pointer'
                                onClick={() => {
                                    user ? setShow(true) : setShowAuth(true)
                                }}
                            >
                                <BiMessageSquareAdd size={25} color='white' />
                            </div>
                            {user ? <>
                                <div className="flex items-center text-base gap-3 cursor-pointer" title={user?.displayName}>
                                    <div className="relative">
                                        <img
                                            src={user?.photoURL}
                                            alt=""
                                            className="rounded-full w-[20px] h-[20px]"
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                    {/* <h1>Profile</h1> */}
                                </div>
                                <div className="flex items-center text-base gap-3 cursor-pointer"
                                    onClick={() => {
                                        signOut(auth).then(() => {
                                            // Sign-out successful.
                                        }).catch((error) => {
                                            console.log(error);
                                            // An error happened.
                                        });
                                    }}
                                >
                                    <CiLogout size={25} color="red" />
                                    {/* <h1>Logout</h1> */}
                                </div>
                            </> :
                                <div className="flex items-center text-base gap-3 cursor-pointer" onClick={() => setShowAuth(true)}>
                                    <CiLogin size={25} color="green" />
                                    {/* <h1>Login</h1> */}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <CreateModal show={show} setShow={setShow} />
            <AuthModal showAuth={showAuth} setShowAuth={setShowAuth} />
        </>
    );
}

export default App;
