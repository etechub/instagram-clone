import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../config';

export default function Story() {
    const [users, setUsers] = useState([])

     useEffect(() => {
        const collectionRef = collection(db, 'users');
        const q = query(collectionRef, orderBy('createAt', 'desc'), limit(50));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            console.log({querySnapshot});
            if (!querySnapshot.empty) {
                const list = [];
                querySnapshot.docs.forEach((doc) => {
                    var r = { ...doc.data(), id: doc.id };
                    r && list.push(r);
                });
                setUsers(list);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <div className="rounded-lg border border-gray-600 w-[290px] sm:w-[320px] md:w-full mx-auto overflow-auto py-4 px-6 ">
            <div className="flex gap-4">
                {users.map((user) => {
                    return (
                        <div key={user?.id} className="flex flex-col items-center">
                            <div
                                className="w-[55px] h-[55px] md:w-[65px] md:h-[65px] rounded-full grid place-items-center"
                                style={{
                                    background: 'rgb(216, 221, 19)',
                                    backgroundImage:
                                        'linear-gradient(158deg, rgba(216, 221, 19, 1) 0%, rgba(206, 31, 208, 1) 44%, rgba(246, 157, 23, 1) 100%)',
                                }}
                            >
                                <img
                                    src={user?.photoURL}
                                    layout="fill"
                                    objectFit="contain"
                                    alt=""
                                    className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black"
                                />
                            </div>
                            <div className="">{user?.displayName}</div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}
