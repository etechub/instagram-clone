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
import { CiLogin, CiLogout } from 'react-icons/ci'

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
            <div className="h-screen md:grid md:grid-cols-[1fr_5fr] text-white bg-black ">
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
                            <div className="flex items-center text-base gap-3" title={user.displayName}>
                                <div className="relative">
                                    <img
                                        src={user.photoURL}
                                        alt=""
                                        className="rounded-full w-8"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                                <h1>Profile</h1>
                            </div>
                            <div className="flex items-center text-base gap-3" 
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
                                <CiLogin size={25} color="red" />
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

                <div className="h-screen overflow-auto py-8 px-4 md:p-8 flex flex-col items-center">
                    <div className="md:max-w-[500px] mx-auto">

                        <div className="rounded-lg border border-gray-600 w-[280px] md:w-full mx-auto overflow-auto py-4 px-6 ">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                        style={{
                                            background: 'rgb(216, 221, 19)',
                                            backgroundImage:
                                                'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                        }}
                                    >
                                        <img
                                            src={img2}
                                            layout="fill"
                                            objectFit="contain"
                                            alt=""
                                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                        />
                                    </div>
                                    <div className="">Dev_ahmed</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                        style={{
                                            background: 'rgb(216, 221, 19)',
                                            backgroundImage:
                                                'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                        }}
                                    >
                                        <img
                                            src={img2}
                                            layout="fill"
                                            objectFit="contain"
                                            alt=""
                                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                        />
                                    </div>
                                    <div className="">Dev_ahmed</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                        style={{
                                            background: 'rgb(216, 221, 19)',
                                            backgroundImage:
                                                'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                        }}
                                    >
                                        <img
                                            src={img2}
                                            layout="fill"
                                            objectFit="contain"
                                            alt=""
                                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                        />
                                    </div>
                                    <div className="">Dev_ahmed</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                        style={{
                                            background: 'rgb(216, 221, 19)',
                                            backgroundImage:
                                                'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                        }}
                                    >
                                        <img
                                            src={img2}
                                            layout="fill"
                                            objectFit="contain"
                                            alt=""
                                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                        />
                                    </div>
                                    <div className="">Dev_ahmed</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                        style={{
                                            background: 'rgb(216, 221, 19)',
                                            backgroundImage:
                                                'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                        }}
                                    >
                                        <img
                                            src={img2}
                                            layout="fill"
                                            objectFit="contain"
                                            alt=""
                                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                        />
                                    </div>
                                    <div className="">Dev_ahmed</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                        style={{
                                            background: 'rgb(216, 221, 19)',
                                            backgroundImage:
                                                'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                        }}
                                    >
                                        <img
                                            src={img2}
                                            layout="fill"
                                            objectFit="contain"
                                            alt=""
                                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                        />
                                    </div>
                                    <div className="">Dev_ahmed</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                        style={{
                                            background: 'rgb(216, 221, 19)',
                                            backgroundImage:
                                                'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                        }}
                                    >
                                        <img
                                            src={img2}
                                            layout="fill"
                                            objectFit="contain"
                                            alt=""
                                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                        />
                                    </div>
                                    <div className="">Dev_ahmed</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                        style={{
                                            background: 'rgb(216, 221, 19)',
                                            backgroundImage:
                                                'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                        }}
                                    >
                                        <img
                                            src={img2}
                                            layout="fill"
                                            objectFit="contain"
                                            alt=""
                                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                        />
                                    </div>
                                    <div className="">Dev_ahmed</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-6">
                            {posts.length > 0 &&
                                posts.map((post) => {
                                    // console.log(post);
                                    return (
                                        <div key={post.id} className="">
                                            <div className="border border-gray-600 rounded-t-lg flex justify-between items-center py-3 px-4">
                                                <div className="flex gap-4">
                                                    {user.photoURL ? <img
                                                        src={user.photoURL}
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
                                                    <div className="">{user.displayName}</div>
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
                                                    layout="fill"
                                                    objectFit="contain"
                                                    alt=""
                                                    className="w-full h-fit"
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
                    </div>
                </div>
            </div>
            <CreateModal show={show} setShow={setShow} />
            <AuthModal showAuth={showAuth} setShowAuth={setShowAuth} />
        </>
    );
}

export default App;
